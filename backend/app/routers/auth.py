from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserResponse, LocationCoordinates

router = APIRouter(prefix="/auth", tags=["Authentication & Users"])

@router.get("/me", response_model=UserResponse)
def get_current_user(role: str = "customer", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.role == role).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        name=user.name,
        mobile=user.mobile,
        email=user.email,
        role=user.role,
        avatar=user.avatar,
        location=LocationCoordinates(
            lat=user.lat,
            lng=user.lng,
            address=user.address,
            city=user.city,
            pincode=user.pincode,
            landmark=user.landmark
        ),
        createdAt=user.created_at
    )

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        name=user.name,
        mobile=user.mobile,
        email=user.email,
        role=user.role,
        avatar=user.avatar,
        location=LocationCoordinates(
            lat=user.lat,
            lng=user.lng,
            address=user.address,
            city=user.city,
            pincode=user.pincode,
            landmark=user.landmark
        ),
        createdAt=user.created_at
    )
