import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Worker, WorkerDocument, VerificationAudit, Notification
from app.schemas import (
    WorkerResponse,
    WorkerRegisterRequest,
    WorkerAvailabilityUpdate,
    DocumentVerificationUpdate,
    LocationCoordinates,
    ShopDetails,
    WorkerDocumentResponse,
    WorkerVerifications
)

router = APIRouter(prefix="/workers", tags=["Workers"])

def worker_model_to_schema(w: Worker) -> WorkerResponse:
    shop_data = None
    if w.shop and isinstance(w.shop, dict):
        shop_data = ShopDetails(
            id=w.shop.get("id", f"shop-{w.id}"),
            name=w.shop.get("name", ""),
            address=w.shop.get("address", ""),
            photoUrl=w.shop.get("photoUrl", ""),
            lat=w.shop.get("lat", w.lat),
            lng=w.shop.get("lng", w.lng),
            establishedYear=w.shop.get("establishedYear", 2020),
            isShopVerified=w.shop.get("isShopVerified", False)
        )

    verifications_dict = w.verifications or {}
    verifications = WorkerVerifications(
        identity=verifications_dict.get("identity", "pending"),
        skill=verifications_dict.get("skill", "pending"),
        shop=verifications_dict.get("shop", "pending"),
        mobile=verifications_dict.get("mobile", "verified")
    )

    doc_list: List[WorkerDocumentResponse] = []
    if w.documents:
        for d in w.documents:
            doc_list.append(WorkerDocumentResponse(
                id=d.id,
                type=d.type,
                name=d.name,
                fileUrl=d.file_url,
                status=d.status,
                uploadedAt=d.uploaded_at,
                verifiedAt=d.verified_at,
                verifiedBy=d.verified_by,
                notes=d.notes
            ))

    return WorkerResponse(
        id=w.id,
        userId=w.user_id,
        name=w.name,
        mobile=w.mobile,
        email=w.email,
        avatar=w.avatar,
        headline=w.headline,
        bio=w.bio,
        primaryCategory=w.primary_category,
        skills=w.skills or [],
        experienceYears=w.experience_years,
        rating=w.rating,
        completedJobsCount=w.completed_jobs_count,
        availability=w.availability,
        location=LocationCoordinates(
            lat=w.lat,
            lng=w.lng,
            address=w.address,
            city=w.city,
            pincode=w.pincode,
            landmark=w.landmark
        ),
        serviceRadiusKm=w.service_radius_km,
        baseChargePerHour=w.base_charge_per_hour,
        cooperativeId=w.cooperative_id,
        cooperativeName=w.cooperative_name,
        shop=shop_data,
        documents=doc_list,
        verifications=verifications,
        isOverallVerified=w.is_overall_verified,
        joinedDate=w.joined_date,
        responseTimeMinutes=w.response_time_minutes
    )

@router.get("", response_model=List[WorkerResponse])
def get_workers(
    category: Optional[str] = None,
    availability: Optional[str] = None,
    cooperative_id: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Worker)

    if category:
        query = query.filter(Worker.primary_category.ilike(f"%{category}%"))
    if availability:
        query = query.filter(Worker.availability == availability)
    if cooperative_id:
        query = query.filter(Worker.cooperative_id == cooperative_id)
    if search:
        query = query.filter(
            (Worker.name.ilike(f"%{search}%")) |
            (Worker.headline.ilike(f"%{search}%")) |
            (Worker.primary_category.ilike(f"%{search}%"))
        )

    workers = query.all()
    return [worker_model_to_schema(w) for w in workers]

@router.get("/{worker_id}", response_model=WorkerResponse)
def get_worker(worker_id: str, db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail=f"Worker '{worker_id}' not found")
    return worker_model_to_schema(worker)

@router.post("", response_model=WorkerResponse, status_code=201)
def register_worker(payload: WorkerRegisterRequest, db: Session = Depends(get_db)):
    worker_id = f"worker-{uuid.uuid4().hex[:6]}"
    user_id = f"user-w-{uuid.uuid4().hex[:6]}"

    loc = payload.location or LocationCoordinates(
        lat=13.0450,
        lng=80.2310,
        address="Chennai Central Cooperative Shared Workbench, T. Nagar",
        city="Chennai",
        pincode="600017"
    )

    shop_dict = None
    if payload.shop:
        shop_dict = payload.shop.dict()

    new_worker = Worker(
        id=worker_id,
        user_id=user_id,
        name=payload.name,
        mobile=payload.mobile,
        email=payload.email,
        avatar=payload.avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        headline=payload.headline or "Independent Skilled Tradesperson",
        bio=payload.bio or "Recently registered skilled worker.",
        primary_category=payload.primaryCategory,
        skills=payload.skills or [payload.primaryCategory],
        experience_years=payload.experienceYears,
        rating=5.0,
        completed_jobs_count=0,
        availability="available",
        lat=loc.lat,
        lng=loc.lng,
        address=loc.address,
        city=loc.city,
        pincode=loc.pincode,
        landmark=loc.landmark,
        service_radius_km=payload.serviceRadiusKm,
        base_charge_per_hour=payload.baseChargePerHour,
        cooperative_id=payload.cooperativeId or "coop-1",
        cooperative_name=payload.cooperativeName or "Avadi Skilled Workers Cooperative Society",
        shop=shop_dict,
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

    # Add documents if submitted
    if payload.documents:
        for doc in payload.documents:
            db_doc = WorkerDocument(
                id=doc.id or f"doc-{uuid.uuid4().hex[:6]}",
                worker_id=worker_id,
                type=doc.type,
                name=doc.name,
                file_url=doc.fileUrl,
                status=doc.status or "pending",
                uploaded_at=doc.uploadedAt or datetime.utcnow().isoformat(),
                notes=doc.notes
            )
            db.add(db_doc)

    # Create admin notification
    notif = Notification(
        id=f"notif-{uuid.uuid4().hex[:6]}",
        target_role="platform_admin",
        title="New Worker Registration Pending Review",
        message=f"{new_worker.name} registered for {new_worker.primary_category} with {new_worker.cooperative_name}.",
        timestamp="Just now",
        is_read=False,
        type="verification"
    )
    db.add(notif)

    db.commit()
    db.refresh(new_worker)
    return worker_model_to_schema(new_worker)

@router.patch("/{worker_id}/availability", response_model=WorkerResponse)
def update_availability(
    worker_id: str,
    payload: WorkerAvailabilityUpdate,
    db: Session = Depends(get_db)
):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    if payload.availability not in ["available", "busy", "offline"]:
        raise HTTPException(status_code=400, detail="Invalid availability status")

    worker.availability = payload.availability
    db.commit()
    db.refresh(worker)
    return worker_model_to_schema(worker)

@router.post("/{worker_id}/documents", response_model=WorkerDocumentResponse, status_code=201)
def upload_worker_document(
    worker_id: str,
    doc: WorkerDocumentResponse,
    db: Session = Depends(get_db)
):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    db_doc = WorkerDocument(
        id=doc.id or f"doc-{uuid.uuid4().hex[:6]}",
        worker_id=worker_id,
        type=doc.type,
        name=doc.name,
        file_url=doc.fileUrl,
        status="pending",
        uploaded_at=datetime.utcnow().isoformat(),
        notes=doc.notes
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)

    return WorkerDocumentResponse(
        id=db_doc.id,
        type=db_doc.type,
        name=db_doc.name,
        fileUrl=db_doc.file_url,
        status=db_doc.status,
        uploadedAt=db_doc.uploaded_at,
        notes=db_doc.notes
    )

@router.patch("/{worker_id}/documents/{doc_id}/verify", response_model=WorkerResponse)
def verify_worker_document(
    worker_id: str,
    doc_id: str,
    payload: DocumentVerificationUpdate,
    db: Session = Depends(get_db)
):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    doc = db.query(WorkerDocument).filter(
        WorkerDocument.id == doc_id,
        WorkerDocument.worker_id == worker_id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.status = payload.status
    if payload.status == "verified":
        doc.verified_at = datetime.utcnow().isoformat()
        doc.verified_by = payload.verifiedBy or "Cooperative Verification Committee"
    if payload.notes:
        doc.notes = payload.notes

    # Update worker's verification badges
    all_docs = db.query(WorkerDocument).filter(WorkerDocument.worker_id == worker_id).all()
    identity_doc = next((d for d in all_docs if d.type == "identity"), None)
    skill_doc = next((d for d in all_docs if d.type == "skill_certificate"), None)
    shop_doc = next((d for d in all_docs if d.type == "shop_proof"), None)

    current_verifs = dict(worker.verifications or {})
    if identity_doc:
        current_verifs["identity"] = identity_doc.status
    if skill_doc:
        current_verifs["skill"] = skill_doc.status
    if shop_doc:
        current_verifs["shop"] = shop_doc.status

    worker.verifications = current_verifs
    worker.is_overall_verified = (
        current_verifs.get("identity") == "verified" and
        current_verifs.get("skill") == "verified" and
        current_verifs.get("mobile") == "verified"
    )

    # Log audit entry
    audit = VerificationAudit(
        id=f"audit-{uuid.uuid4().hex[:6]}",
        worker_id=worker.id,
        worker_name=worker.name,
        document_type=doc.type,
        action="approved" if payload.status == "verified" else "rejected",
        decided_by=payload.verifiedBy or "Cooperative Committee",
        decided_at=datetime.utcnow().isoformat(),
        notes=payload.notes or f"Marked as {payload.status}"
    )
    db.add(audit)

    db.commit()
    db.refresh(worker)
    return worker_model_to_schema(worker)
