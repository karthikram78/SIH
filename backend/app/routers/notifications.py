from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Notification
from app.schemas import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

def notif_model_to_schema(n: Notification) -> NotificationResponse:
    return NotificationResponse(
        id=n.id,
        targetRole=n.target_role,
        targetUserId=n.target_user_id,
        title=n.title,
        message=n.message,
        timestamp=n.timestamp,
        read=n.is_read,
        type=n.type,
        actionUrl=n.action_url
    )

@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    role: Optional[str] = None,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Notification).order_by(Notification.id.desc())

    if role:
        query = query.filter(Notification.target_role == role)
    if user_id:
        query = query.filter(Notification.target_user_id == user_id)

    notifications = query.all()
    return [notif_model_to_schema(n) for n in notifications]

@router.patch("/{notif_id}/read", response_model=NotificationResponse)
def mark_notification_read(notif_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif_model_to_schema(notif)
