from typing import List
from app.schemas import DemandForecastItem

AI_DEMAND_FORECASTS = [
    DemandForecastItem(
        category="Electrical & AC Servicing",
        predictedDemandChange="+48% surge",
        urgencyNotice="Peak Load Expected Next 7 Days",
        reason="Local weather station reports 38°C average daytime temperature triggering widespread inverter tripping and AC refrigerant servicing calls.",
        affectedZones=["Thillai Nagar", "Tennur", "Cantonment", "Woraiyur"],
        recommendedAction="Alert 14 currently inactive or busy electrical members in Ward 12 & 18 to enable availability."
    ),
    DemandForecastItem(
        category="Deep Cleaning & Sanitization",
        predictedDemandChange="+35% surge",
        urgencyNotice="Upcoming Festival Season Prep",
        reason="Pre-festival household cleanup trends indicate 3x bookings for kitchen degreasing and sofa shampooing over the coming fortnight.",
        affectedZones=["K.K. Nagar", "Srirangam", "Palakkarai"],
        recommendedAction="Form cooperative multi-member cleaning clusters to handle larger residential apartments efficiently."
    ),
    DemandForecastItem(
        category="Emergency Tyre & Puncture",
        predictedDemandChange="+22% rise",
        urgencyNotice="High Arterial Road Traffic",
        reason="National Highway NH-45 bypass expansion work has caused sudden debris and sharp gravel, spiking two-wheeler tyre puncture requests.",
        affectedZones=["Karumandapam Bypass", "Central Bus Stand Perimeter"],
        recommendedAction="Position mobile puncture assistance units near Karumandapam intersection during 5 PM - 9 PM."
    )
]

def get_demand_forecasts() -> List[DemandForecastItem]:
    return AI_DEMAND_FORECASTS
