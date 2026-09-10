import uuid
import hashlib
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Worker
from app.schemas import (
    UserResponse,
    LocationCoordinates,
    UserLoginRequest,
    UserRegisterRequest,
    UserAuthResponse,
    OtpRequest,
    OtpVerifyRequest
)

router = APIRouter(prefix="/auth", tags=["Authentication & Users"])

PASSWORD_SALT = "kaushalsetu_sec_v1_"

def hash_password(password: str) -> str:
    """Cryptographically hash password using salted SHA-256."""
    return hashlib.sha256((PASSWORD_SALT + password).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, stored_hash: Optional[str]) -> bool:
    """Verify input password against stored hash with backward compatibility for demo passwords."""
    if not stored_hash:
        return True
    if stored_hash == "password123":
        return plain_password == "password123"
    return hash_password(plain_password) == stored_hash or plain_password == stored_hash

def user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        name=user.name,
        mobile=user.mobile,
        email=user.email,
        role=user.role,
        avatar=user.avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        location=LocationCoordinates(
            lat=user.lat or 13.0418,
            lng=user.lng or 80.2341,
            address=user.address or "Usman Road, T. Nagar, Chennai",
            city=user.city or "Chennai",
            pincode=user.pincode or "600017",
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
            token=f"jwt-token-{existing.id}",
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
        lat=payload.lat or 13.0418,
        lng=payload.lng or 80.2341,
        address=payload.address or "Usman Road, T. Nagar, Chennai",
        city=payload.city or "Chennai",
        pincode=payload.pincode or "600017",
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
            cooperative_name="Trichy Local Service Cooperative Society",
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
        token=f"jwt-token-{new_user.id}",
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
        token=f"jwt-token-{user.id}",
        role=user.role,
        message=f"Welcome back, {user.name}!"
    )

@router.post("/send-otp")
def send_otp(payload: OtpRequest):
    # In production, this would trigger an SMS gateway (e.g. Fast2SMS / Twilio).
    # For testing and hackathon demonstration, simulate successful dispatch with instant 1234 code.
    return {
        "success": True,
        "mobile": payload.mobile,
        "demoOtp": "1234",
        "message": f"One-Time Password sent to {payload.mobile}. Demo OTP: 1234"
    }

@router.post("/verify-otp", response_model=UserAuthResponse)
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    # Verify OTP (accept "1234" or any 4 digit matching code in demo)
    if payload.otp != "1234" and len(payload.otp) != 4:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Use 1234 for verification.")

    clean_mobile = payload.mobile.strip()
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
            password_hash="password123",
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            address="Usman Road, T. Nagar, Chennai",
            city="Chennai",
            pincode="600017",
            lat=13.0418,
            lng=80.2341,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserAuthResponse(
        user=user_to_response(user),
        token=f"jwt-token-{user.id}",
        role=user.role,
        message=f"Mobile number verified successfully! Welcome {user.name}."
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(role: str = "customer", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.role == role).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_to_response(user)

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_to_response(user)
