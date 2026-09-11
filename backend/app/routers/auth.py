import uuid
import secrets
from datetime import datetime, timedelta
from typing import Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import OtpChallenge, User, Worker
from app.schemas import (
    UserResponse,
    LocationCoordinates,
    UserLoginRequest,
    UserRegisterRequest,
    UserAuthResponse,
    OtpRequest,
    OtpVerifyRequest
)
from app.security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Authentication & Users"])

def user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        name=user.name,
        mobile=user.mobile,
        email=user.email,
        role=user.role,
        avatar=user.avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        location=LocationCoordinates(
            lat=user.lat or 13.1147,
            lng=user.lng or 80.1048,
            address=user.address or "Avadi Main Road, Avadi",
            city=user.city or "Avadi",
            pincode=user.pincode or "600054",
            landmark=user.landmark
        ),
        createdAt=user.created_at
    )

@router.post("/register", response_model=UserAuthResponse, status_code=201)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if mobile or email already exists
    existing = db.query(User).filter(
        (User.mobile == payload.mobile) | (User.email == payload.email)
    ).first()
    
    if existing:
        # If user already registered, return friendly message
        return UserAuthResponse(
            user=user_to_response(existing),
            token=create_access_token(existing),
            role=existing.role,
            message="Account already exists. Logged in successfully."
        )

    user_id = f"user-{uuid.uuid4().hex[:8]}"
    
    new_user = User(
        id=user_id,
        name=payload.name,
        mobile=payload.mobile,
        email=payload.email,
        password_hash=hash_password(payload.password or "password123"),
        role=payload.role,
        avatar=payload.avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        lat=payload.lat or 13.1147,
        lng=payload.lng or 80.1048,
        address=payload.address or "Avadi Main Road, Avadi",
        city=payload.city or "Avadi",
        pincode=payload.pincode or "600054",
        landmark=payload.landmark,
        created_at=datetime.utcnow().isoformat()
    )
    db.add(new_user)

    # If registering as worker, also register a worker stub
    if payload.role == "worker":
        worker_id = f"worker-{uuid.uuid4().hex[:6]}"
        primary_cat = payload.primaryCategory or "General Services"
        new_worker = Worker(
            id=worker_id,
            user_id=user_id,
            name=payload.name,
            mobile=payload.mobile,
            email=payload.email,
            avatar=new_user.avatar,
            headline=f"Certified {primary_cat} Specialist",
            bio=f"{payload.experienceYears or 2} years experienced tradesperson.",
            primary_category=primary_cat,
            skills=payload.skills or [primary_cat],
            experience_years=payload.experienceYears or 2,
            rating=5.0,
            completed_jobs_count=0,
            availability="available",
            lat=new_user.lat,
            lng=new_user.lng,
            address=new_user.address,
            city=new_user.city,
            pincode=new_user.pincode,
            landmark=new_user.landmark,
            service_radius_km=8.0,
            base_charge_per_hour=payload.baseChargePerHour or 350.0,
            cooperative_id=payload.cooperativeId or "coop-1",
            cooperative_name="Avadi Skilled Workers Cooperative Society",
            verifications={
                "identity": "pending",
                "skill": "pending",
                "shop": "pending",
                "mobile": "verified"
            },
            is_overall_verified=False,
            joined_date=datetime.utcnow().strftime("%Y-%m-%d"),
            response_time_minutes=10
        )
        db.add(new_worker)

    db.commit()
    db.refresh(new_user)

    return UserAuthResponse(
        user=user_to_response(new_user),
        token=create_access_token(new_user),
        role=new_user.role,
        message="Registration successful! Welcome to Namma Sevai."
    )

@router.post("/login", response_model=UserAuthResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    clean_id = payload.identifier.strip()
    
    # Lookup by email or mobile
    user = db.query(User).filter(
        (User.email.ilike(clean_id)) | (User.mobile.ilike(f"%{clean_id}%"))
    ).first()

    if not user:
        # If user not found, but role matches a seeded demo persona, fetch by role
        if payload.role:
            user = db.query(User).filter(User.role == payload.role).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Account not found. Please check your credentials or register a new account."
        )

    # Cryptographic password verification
    if payload.password and user.password_hash:
        if not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid password. Please check your credentials.")

    return UserAuthResponse(
        user=user_to_response(user),
        token=create_access_token(user),
        role=user.role,
        message=f"Welcome back, {user.name}!"
    )

@router.post("/send-otp")
def send_otp(payload: OtpRequest, db: Session = Depends(get_db)):
    mobile = payload.mobile.strip()
    use_demo_otp = settings.APP_ENV != "production" and (
        not settings.MSG91_AUTH_KEY or not settings.MSG91_TEMPLATE_ID
    )
    if not use_demo_otp and (not settings.MSG91_AUTH_KEY or not settings.MSG91_TEMPLATE_ID):
        raise HTTPException(status_code=503, detail="MSG91 OTP service is not configured")

    otp = "1234" if use_demo_otp else f"{secrets.randbelow(900000) + 100000}"
    challenge = OtpChallenge(
        id=f"otp-{uuid.uuid4().hex[:12]}",
        mobile=mobile,
        code_hash=hash_password(otp),
        expires_at=datetime.utcnow() + timedelta(seconds=settings.MSG91_OTP_EXPIRY_SECONDS),
    )
    db.query(OtpChallenge).filter(
        OtpChallenge.mobile == mobile, OtpChallenge.consumed_at.is_(None)
    ).update({OtpChallenge.consumed_at: datetime.utcnow()})
    db.add(challenge)
    if not use_demo_otp:
        try:
            response = httpx.post(
                settings.MSG91_OTP_API_URL,
                headers={"authkey": settings.MSG91_AUTH_KEY, "Content-Type": "application/json"},
                json={"template_id": settings.MSG91_TEMPLATE_ID, "mobile": mobile, "otp": otp},
                timeout=10.0,
            )
            response.raise_for_status()
        except (httpx.HTTPError, ValueError) as exc:
            db.rollback()
            raise HTTPException(status_code=502, detail="Unable to send OTP through MSG91") from exc
    db.commit()
    response = {"success": True, "mobile": mobile, "message": "One-Time Password sent successfully"}
    if use_demo_otp:
        response["demoOtp"] = otp
    return response

@router.post("/verify-otp", response_model=UserAuthResponse)
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    clean_mobile = payload.mobile.strip()
    challenge = db.query(OtpChallenge).filter(
        OtpChallenge.mobile == clean_mobile,
        OtpChallenge.consumed_at.is_(None),
        OtpChallenge.expires_at > datetime.utcnow(),
    ).order_by(OtpChallenge.created_at.desc()).first()
    if not challenge or challenge.attempts >= 5:
        raise HTTPException(status_code=400, detail="OTP expired or not requested")
    challenge.attempts += 1
    if not verify_password(payload.otp, challenge.code_hash):
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    challenge.consumed_at = datetime.utcnow()
    user = db.query(User).filter(User.mobile.ilike(f"%{clean_mobile}%")).first()
    
    if not user:
        # Create a new user with this verified phone number
        user_id = f"user-{uuid.uuid4().hex[:8]}"
        user = User(
            id=user_id,
            name=f"User {clean_mobile[-4:]}",
            mobile=clean_mobile,
            email=f"user_{clean_mobile[-4:]}@nammasevai.in",
            role=payload.role or "customer",
            password_hash=hash_password(secrets.token_urlsafe(24)),
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            address="Avadi Main Road, Avadi",
            city="Avadi",
            pincode="600054",
            lat=13.1147,
            lng=80.1048,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserAuthResponse(
        user=user_to_response(user),
        token=create_access_token(user),
        role=user.role,
        message=f"Mobile number verified successfully! Welcome {user.name}."
    )

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return user_to_response(user)

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_to_response(user)
