from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Cooperative, Worker
from app.schemas import CooperativeResponse, WorkerResponse
from app.routers.workers import worker_model_to_schema

router = APIRouter(prefix="/cooperatives", tags=["Cooperatives"])

def coop_model_to_schema(c: Cooperative) -> CooperativeResponse:
    return CooperativeResponse(
        id=c.id,
        name=c.name,
        registrationNumber=c.registration_number,
        district=c.district,
        state=c.state,
        membersCount=c.members_count,
        activeWorkersCount=c.active_workers_count,
        monthlyJobsCount=c.monthly_jobs_count,
        monthlyEarningsTotal=c.monthly_earnings_total,
        welfareFundBalance=c.welfare_fund_balance,
        contactPerson=c.contact_person,
        contactMobile=c.contact_mobile,
        address=c.address,
        establishedYear=c.established_year
    )

@router.get("", response_model=List[CooperativeResponse])
def get_cooperatives(db: Session = Depends(get_db)):
    coops = db.query(Cooperative).all()
    return [coop_model_to_schema(c) for c in coops]

@router.get("/{coop_id}", response_model=CooperativeResponse)
def get_cooperative(coop_id: str, db: Session = Depends(get_db)):
    coop = db.query(Cooperative).filter(Cooperative.id == coop_id).first()
    if not coop:
        raise HTTPException(status_code=404, detail="Cooperative not found")
    return coop_model_to_schema(coop)

@router.get("/{coop_id}/workers", response_model=List[WorkerResponse])
def get_cooperative_workers(coop_id: str, db: Session = Depends(get_db)):
    workers = db.query(Worker).filter(Worker.cooperative_id == coop_id).all()
    return [worker_model_to_schema(w) for w in workers]

@router.get("/{coop_id}/welfare-fund")
def get_welfare_fund_details(coop_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    coop = db.query(Cooperative).filter(Cooperative.id == coop_id).first()
    if not coop:
        raise HTTPException(status_code=404, detail="Cooperative not found")

    return {
        "cooperativeId": coop.id,
        "cooperativeName": coop.name,
        "welfareFundBalance": coop.welfare_fund_balance,
        "monthlyContributionTotal": round(coop.monthly_earnings_total * 0.10, 2),
        "cooperativeContributionRate": "10%",
        "eligibleMembersCount": coop.active_workers_count,
        "schemesAvailable": [
            "Emergency Medical Accident Cover (up to ₹50,000)",
            "Children Skill Education Scholarship Grant",
            "Zero-Interest Tool Modernization Loan",
            "Tool Insurance & Monsoon Loss Relief"
        ]
    }
