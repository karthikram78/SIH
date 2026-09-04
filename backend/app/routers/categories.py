from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ServiceCategory
from app.schemas import ServiceCategoryResponse

router = APIRouter(prefix="/categories", tags=["Service Categories"])

@router.get("", response_model=List[ServiceCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(ServiceCategory).all()
    return [
        ServiceCategoryResponse(
            id=cat.id,
            name=cat.name,
            group=cat.group,
            description=cat.description,
            iconName=cat.icon_name,
            skills=cat.skills or [],
            basePrice=cat.base_price,
            urgencyDefault=cat.urgency_default
        )
        for cat in categories
    ]
