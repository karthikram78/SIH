from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine
from app.models import (
    Worker,
    Cooperative,
    ServiceRequest,
    VerificationAudit,
    User,
    WorkerDocument,
    RatingReview,
    Notification,
    DemandForecast
)
from app.schemas import PlatformMetricsResponse, VerificationAuditRecord
from app.seed import seed_database
from app.security import require_roles

router = APIRouter(prefix="/admin", tags=["Platform Admin & Metrics"])

@router.get("/metrics", response_model=PlatformMetricsResponse)
def get_platform_metrics(db: Session = Depends(get_db)):
    workers = db.query(Worker).all()
    coops = db.query(Cooperative).all()
    requests = db.query(ServiceRequest).all()

    total_workers = len(workers)
    active_workers = len([w for w in workers if w.availability == "available"])
    verified_workers = len([w for w in workers if w.is_overall_verified])
    total_coops = len(coops)

    completed_requests = [r for r in requests if r.status in ["completed", "paid"]]
    total_jobs = sum(w.completed_jobs_count for w in workers) + len(completed_requests)

    # Calculate financial totals from cooperatives and completed requests
    coop_monthly_gmv = sum(c.monthly_earnings_total for c in coops)
    total_gmv = coop_monthly_gmv + sum(r.amount for r in completed_requests)
    platform_revenue = round(total_gmv * 0.05, 2)
    coop_welfare_pool = round(total_gmv * 0.10, 2)
    worker_disbursement = round(total_gmv * 0.85, 2)

    avg_rating = 4.8
    if workers:
        avg_rating = round(sum(w.rating for w in workers) / len(workers), 2)

    return PlatformMetricsResponse(
        totalWorkers=total_workers,
        activeWorkers=active_workers,
        totalCooperatives=total_coops,
        totalJobsCompleted=total_jobs,
        totalVolumeGmv=total_gmv,
        platformRevenue5Percent=platform_revenue,
        cooperativeWelfarePool10Percent=coop_welfare_pool,
        workerNetDisbursement85Percent=worker_disbursement,
        averageWorkerRating=avg_rating,
        verifiedWorkersCount=verified_workers
    )

@router.get("/verifications", response_model=List[VerificationAuditRecord])
def get_verification_audits(db: Session = Depends(get_db)):
    audits = db.query(VerificationAudit).order_by(VerificationAudit.decided_at.desc()).all()
    return [
        VerificationAuditRecord(
            id=a.id,
            workerId=a.worker_id,
            workerName=a.worker_name,
            documentType=a.document_type,
            action=a.action,
            decidedBy=a.decided_by,
            decidedAt=a.decided_at,
            notes=a.notes
        )
        for a in audits
    ]

@router.post("/reset-demo")
def reset_demo_database(
    db: Session = Depends(get_db),
    _admin=Depends(require_roles("platform_admin")),
):
    # Drop all records and reseed
    db.query(VerificationAudit).delete()
    db.query(Notification).delete()
    db.query(RatingReview).delete()
    db.query(ServiceRequest).delete()
    db.query(WorkerDocument).delete()
    db.query(Worker).delete()
    db.query(Cooperative).delete()
    db.query(User).delete()
    db.query(DemandForecast).delete()
    db.commit()

    seed_database(db)
    return {"status": "success", "message": "Namma Sevai database reset and re-seeded successfully."}
