import re
from typing import List, Dict, Any, Optional
from app.schemas import AIServiceAnalysis
from app.config import settings

SERVICE_PATTERNS = [
    {
        "category": "Plumbing",
        "skills": ["Pipe Repair", "Tap Repair", "Water Tank Repair", "Drain Cleaning", "Bathroom Fitting"],
        "keywords": ["tap", "pipe", "leak", "water", "plumber", "drain", "toilet", "flush", "sink", "faucet", "tank", "basin", "geyser leak", "plumbing", "shower"],
        "emergencyKeywords": ["pipe burst", "flooding", "overflowing", "urgent leak", "burst"],
        "defaultProblem": "Water Leakage & Sanitary Fixture Issue",
        "defaultSkill": "Pipe/Tap Repair",
        "costRange": "₹250 - ₹500",
        "defaultUrgency": "medium",
    },
    {
        "category": "Electrical",
        "skills": ["Wiring Repair", "Switchboard Repair", "Fan Installation", "MCB Tripping Fault", "Earthing Test"],
        "keywords": ["electric", "spark", "current", "shock", "switch", "light", "fan", "mcb", "fuse", "tripping", "power cut", "wire", "short circuit", "plug"],
        "emergencyKeywords": ["sparking", "smoke", "burning smell", "electric shock", "fire risk", "power down"],
        "defaultProblem": "Electrical Circuit or Appliance Fault",
        "defaultSkill": "Wiring Repair / MCB Check",
        "costRange": "₹300 - ₹600",
        "defaultUrgency": "high",
    },
    {
        "category": "Puncture & Tyres",
        "skills": ["Tubeless Puncture Fix", "Tube Patching", "Mobile Tyre Assistance", "Wheel Balancing"],
        "keywords": ["puncture", "tyre", "tire", "flat tyre", "air leak", "wheel", "stepney", "deflated"],
        "emergencyKeywords": ["stranded", "highway", "flat tire", "roadside", "puncture now"],
        "defaultProblem": "Deflated Tyre / Puncture on Road",
        "defaultSkill": "Tubeless Puncture Fix",
        "costRange": "₹150 - ₹350",
        "defaultUrgency": "emergency",
    },
    {
        "category": "Mechanic & Vehicle Repair",
        "skills": ["Bike Breakdown Help", "Car Engine Diagnostics", "Brake Pad Replacement", "Chain Lubrication"],
        "keywords": ["mechanic", "bike", "car", "scooter", "engine", "breakdown", "not starting", "clutch", "brake", "chain", "battery dead", "jumpstart", "two wheeler", "vehicle"],
        "emergencyKeywords": ["breakdown", "wont start", "engine stopped", "stuck on road", "roadside breakdown"],
        "defaultProblem": "Vehicle Breakdown & Engine/Brake Issue",
        "defaultSkill": "Bike/Car Breakdown Help",
        "costRange": "₹350 - ₹800",
        "defaultUrgency": "high",
    },
    {
        "category": "Deep Cleaning",
        "skills": ["Deep Home Cleaning", "Bathroom Sanitization", "Kitchen Degreasing", "Sofa Shampooing"],
        "keywords": ["clean", "cleaning", "dust", "wash", "bathroom clean", "kitchen clean", "deep clean", "sanitize", "sofa", "house clean", "maid", "mop"],
        "emergencyKeywords": [],
        "defaultProblem": "Intensive Space Deep Cleaning & Degreasing",
        "defaultSkill": "Deep Home Cleaning",
        "costRange": "₹500 - ₹1,200",
        "defaultUrgency": "low",
    },
    {
        "category": "Appliance Repair",
        "skills": ["AC Servicing", "Refrigerator Repair", "Washing Machine Repair", "Geyser Installation"],
        "keywords": ["ac", "air conditioner", "fridge", "refrigerator", "washing machine", "geyser", "cooler", "oven", "appliance", "cooling", "water heater"],
        "emergencyKeywords": ["gas leakage", "geyser spark", "refrigerator stopped"],
        "defaultProblem": "Appliance Malfunction or Cooling Loss",
        "defaultSkill": "AC Servicing / Appliance Diagnosis",
        "costRange": "₹400 - ₹850",
        "defaultUrgency": "medium",
    },
    {
        "category": "Carpenter",
        "skills": ["Door Alignment", "Lock Fitting", "Furniture Assembly", "Cupboard Repair", "Wood Polishing"],
        "keywords": ["carpenter", "door", "lock", "wood", "furniture", "cupboard", "table", "chair", "drawer", "hinge", "latch", "key stuck"],
        "emergencyKeywords": ["lock jammed", "locked out", "door stuck"],
        "defaultProblem": "Door, Lock or Wooden Furniture Fault",
        "defaultSkill": "Lock Fitting / Door Alignment",
        "costRange": "₹300 - ₹650",
        "defaultUrgency": "medium",
    },
    {
        "category": "Painting",
        "skills": ["Wall Touchup", "Waterproofing", "Emulsion Painting", "Enamel Paint", "Distemper"],
        "keywords": ["paint", "painter", "wall", "damp", "waterproof", "varnish", "colour", "color", "whitewash"],
        "emergencyKeywords": ["severe dampness", "ceiling peeling"],
        "defaultProblem": "Wall Surface Repair & Painting",
        "defaultSkill": "Wall Touchup & Waterproofing",
        "costRange": "₹500 - ₹1,500",
        "defaultUrgency": "low",
    },
    {
        "category": "Cook & Kitchen Help",
        "skills": ["Vegetarian Cooking", "South Indian Tiffin", "Meal Prep Helper", "Festival Sweets"],
        "keywords": ["cook", "cooking", "chef", "food", "meals", "kitchen help", "tiffin", "dinner", "lunch"],
        "emergencyKeywords": [],
        "defaultProblem": "Household Meal Preparation & Kitchen Assistance",
        "defaultSkill": "Vegetarian Cooking / Tiffin Prep",
        "costRange": "₹400 - ₹800",
        "defaultUrgency": "low",
    },
    {
        "category": "Gardening & Lawn",
        "skills": ["Tree Pruning", "Lawn Mowing", "Soil Fertilization", "Terrace Garden Care"],
        "keywords": ["garden", "gardener", "plant", "lawn", "grass", "tree", "pruning", "pot", "watering"],
        "emergencyKeywords": ["fallen tree branch"],
        "defaultProblem": "Garden Maintenance & Tree Trimming",
        "defaultSkill": "Terrace Garden Care & Pruning",
        "costRange": "₹300 - ₹600",
        "defaultUrgency": "low",
    }
]

def analyze_service_request(input_text: str) -> AIServiceAnalysis:
    query = (input_text or "").lower().strip()

    if not query:
        return AIServiceAnalysis(
            detectedService="Plumbing",
            problem="General Household Maintenance",
            urgency="medium",
            requiredSkill="Pipe/Tap Repair",
            estimatedCostRange="₹300 - ₹500",
            recommendedKeywords=["plumbing", "repair", "local worker"]
        )

    # Check emergency keywords
    is_emergency = bool(re.search(
        r"emergency|urgent|now|danger|broken down|highway|stuck|sparking|fire|burst|jammed|flooding",
        query,
        re.IGNORECASE
    ))

    best_match = SERVICE_PATTERNS[0]
    highest_score = -1
    matched_skill = ""

    for pattern in SERVICE_PATTERNS:
        score = 0
        if pattern["category"].lower() in query:
            score += 15

        for kw in pattern["keywords"]:
            if kw in query:
                score += 5

        for skill in pattern["skills"]:
            if skill.lower() in query:
                score += 10
                matched_skill = skill

        for em in pattern.get("emergencyKeywords", []):
            if em in query:
                score += 20

        if score > highest_score:
            highest_score = score
            best_match = pattern

    # Determine problem statement
    problem = best_match["defaultProblem"]
    if re.search(r"leak|drip", query, re.IGNORECASE):
        problem = "Water Leakage / Pipe Dripping"
    elif re.search(r"spark|short circuit", query, re.IGNORECASE):
        problem = "Sparking Circuit / Fuse Issue"
    elif re.search(r"flat|puncture|air", query, re.IGNORECASE):
        problem = "Flat Tyre / Roadside Puncture"
    elif re.search(r"not starting|breakdown", query, re.IGNORECASE):
        problem = "Engine Breakdown / Vehicle Stalled"
    elif re.search(r"lock|jammed", query, re.IGNORECASE):
        problem = "Door Lock Jammed / Key Issue"
    elif re.search(r"ac.*cool|cooling", query, re.IGNORECASE):
        problem = "AC Not Cooling / Gas Refill Required"
    elif re.search(r"deep clean|cleaning", query, re.IGNORECASE):
        problem = "Deep Sanitization & Degreasing Request"

    urgency = "medium"
    if is_emergency:
        urgency = "emergency"
    elif re.search(r"urgent|immediately|today|fast", query, re.IGNORECASE):
        urgency = "high"
    else:
        urgency = best_match["defaultUrgency"]

    return AIServiceAnalysis(
        detectedService=best_match["category"],
        problem=problem,
        urgency=urgency,
        requiredSkill=matched_skill or best_match["defaultSkill"],
        estimatedCostRange=best_match["costRange"],
        recommendedKeywords=best_match["keywords"][:4]
    )
