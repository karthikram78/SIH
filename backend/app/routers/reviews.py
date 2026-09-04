import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import RatingReview, Worker, ServiceRequest
from app.schemas import RatingReviewCreate, RatingReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews & Ratings"])

def review_model_to_schema(r: RatingReview) -> RatingReviewResponse:
    return RatingReviewResponse(
        id=r.id,
        serviceRequestId=r.service_request_id,
        workerId=r.worker_id,
        customerId=r.customer_id,
        customerName=r.customer_name,
        rating=r.rating,
        reviewText=r.review_text,
        createdAt=r.created_at,
        serviceCategory=r.service_category
    )

@router.get("", response_model=List[RatingReviewResponse])
def get_reviews(
    worker_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(RatingReview).order_by(RatingReview.created_at.desc())
    if worker_id:
        query = query.filter(RatingReview.worker_id == worker_id)
    if customer_id:
        query = query.filter(RatingReview.customer_id == customer_id)

    reviews = query.all()
    return [review_model_to_schema(r) for r in reviews]

@router.post("", response_model=RatingReviewResponse, status_code=201)
def submit_review(
    payload: RatingReviewCreate,
    db: Session = Depends(get_db)
):
    worker = db.query(Worker).filter(Worker.id == payload.workerId).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    # If service request exists, update rating and reviewText on it
    category = payload.serviceCategory or worker.primary_category
    req = db.query(ServiceRequest).filter(ServiceRequest.id == payload.serviceRequestId).first()
    if req:
        req.rating = payload.rating
        req.review_text = payload.reviewText
        category = req.service_category

    rev_id = f"rev-{uuid.uuid4().hex[:6]}"
    now = datetime.utcnow().isoformat()

    new_rev = RatingReview(
        id=rev_id,
        service_request_id=payload.serviceRequestId,
        worker_id=payload.workerId,
        customer_id=payload.customerId or "cust-101",
        customer_name=payload.customerName or "Priya Sharma",
        rating=payload.rating,
        review_text=payload.reviewText,
        created_at=now,
        service_category=category
    )
    db.add(new_rev)

    # Recompute worker rating average
    total_jobs = worker.completed_jobs_count or 1
    new_avg = (worker.rating * total_jobs + payload.rating) / (total_jobs + 1)
    worker.rating = round(new_avg, 2)

    db.commit()
    db.refresh(new_rev)
    return review_model_to_schema(new_rev)
