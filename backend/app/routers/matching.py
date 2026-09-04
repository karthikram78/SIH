from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Worker
from app.schemas import SmartMatchRequest, SmartMatchScore
from app.services.matching import rank_workers
from app.routers.workers import worker_model_to_schema

router = APIRouter(prefix="/matching", tags=["Smart Matching Engine"])

@router.post("/rank", response_model=List[SmartMatchScore])
def rank_nearby_workers(
    payload: SmartMatchRequest,
    db: Session = Depends(get_db)
):
    # Fetch all workers
    db_workers = db.query(Worker).all()
    worker_schemas = [worker_model_to_schema(w) for w in db_workers]

    # Rank workers based on distance, skills, rating, verification, etc.
    ranked = rank_workers(
        workers=worker_schemas,
        user_location=payload.userLocation,
        target_category=payload.targetCategory,
        target_skill=payload.targetSkill,
        custom_weights=payload.customWeights
    )
    return ranked
