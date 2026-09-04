from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DemandForecast
from app.schemas import AIAnalysisRequest, AIServiceAnalysis, DemandForecastItem
from app.services.ai_parser import analyze_service_request
from app.services.demand_forecast import get_demand_forecasts

router = APIRouter(prefix="/ai", tags=["AI & Demand Intelligence"])

@router.post("/parse-request", response_model=AIServiceAnalysis)
def parse_service_request(payload: AIAnalysisRequest):
    return analyze_service_request(payload.input)

@router.get("/demand-forecast", response_model=List[DemandForecastItem])
def get_ai_demand_forecast(db: Session = Depends(get_db)):
    forecasts = db.query(DemandForecast).all()
    if forecasts:
        return [
            DemandForecastItem(
                category=f.category,
                predictedDemandChange=f.predicted_demand_change,
                urgencyNotice=f.urgency_notice,
                reason=f.reason,
                affectedZones=f.affected_zones or [],
                recommendedAction=f.recommended_action
            )
            for f in forecasts
        ]
    return get_demand_forecasts()
