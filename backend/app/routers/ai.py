from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DemandForecast
from app.schemas import AIAnalysisRequest, AIServiceAnalysis, DemandForecastItem, AIChatRequest, AIChatResponse
from app.services.ai_parser import analyze_service_request
from app.services.demand_forecast import get_demand_forecasts

router = APIRouter(prefix="/ai", tags=["AI & Demand Intelligence"])

@router.post("/parse-request", response_model=AIServiceAnalysis)
def parse_service_request(payload: AIAnalysisRequest):
    return analyze_service_request(payload.input)

@router.post("/chat", response_model=AIChatResponse)
def chat_with_assistant(payload: AIChatRequest):
    message = payload.message.strip()
    lowered = message.lower()
    analysis = analyze_service_request(message)

    if any(word in lowered for word in ["emergency", "urgent", "danger", "stuck", "sparking", "burst"]):
        return AIChatResponse(
            reply=(
                "This sounds urgent. Move away from electrical sparks, flooding, or traffic danger and call local emergency services if anyone is at risk. "
                f"For Avadi Connect, open Emergency Help to book a nearby {analysis.detectedService} worker now."
            ),
            intent="emergency",
            detectedService=analysis.detectedService,
            urgency="emergency",
            estimatedCostRange=analysis.estimatedCostRange,
            suggestedAction="/customer/request-service?emergency=true",
        )

    if any(word in lowered for word in ["price", "cost", "fee", "charge", "how much", "amount"]):
        return AIChatResponse(
            reply=(
                f"{analysis.detectedService} jobs in Avadi are usually {analysis.estimatedCostRange}. "
                "The final quote is shown before payment, with 85% to the worker, 10% to the cooperative welfare fund, and 5% for platform operations."
            ),
            intent="pricing",
            detectedService=analysis.detectedService,
            urgency=analysis.urgency,
            estimatedCostRange=analysis.estimatedCostRange,
            suggestedAction="/services",
        )

    if any(word in lowered for word in ["track", "where", "worker", "booking", "job status"]):
        return AIChatResponse(
            reply="You can follow the worker timeline, arrival OTP, completed invoice, and payment status from My Bookings. I can also help you start a new Avadi service request.",
            intent="tracking",
            suggestedAction="/customer/bookings",
        )

    if any(word in lowered for word in ["hello", "hi", "vanakkam", "help"]):
        return AIChatResponse(
            reply="Vanakkam! I can identify the right service, estimate its cost, explain the cooperative fee split, track a booking, or help with an emergency in Avadi.",
            intent="greeting",
            suggestedAction="/customer/request-service",
        )

    return AIChatResponse(
        reply=(
            f"It sounds like you may need {analysis.detectedService} ({analysis.requiredSkill}). "
            f"Typical cost: {analysis.estimatedCostRange}. Describe the problem in a little more detail, or tap Book Service to find an available Avadi worker."
        ),
        intent="service_help",
        detectedService=analysis.detectedService,
        urgency=analysis.urgency,
        estimatedCostRange=analysis.estimatedCostRange,
        suggestedAction="/customer/request-service",
    )

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
