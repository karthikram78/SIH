import math
from typing import List, Optional
from app.schemas import (
    LocationCoordinates,
    MatchWeights,
    SmartMatchScore,
    ScoreBreakdown,
    WorkerResponse
)

DEFAULT_WEIGHTS = MatchWeights(
    skill=30.0,
    distance=25.0,
    availability=15.0,
    rating=10.0,
    verification=10.0,
    experience=10.0
)

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Haversine formula to compute great-circle distance between two GPS coordinates in km.
    """
    r = 6371.0  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(d_lat / 2.0) ** 2 +
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 1)

def rank_workers(
    workers: List[WorkerResponse],
    user_location: LocationCoordinates,
    target_category: str,
    target_skill: Optional[str] = None,
    custom_weights: Optional[MatchWeights] = None
) -> List[SmartMatchScore]:
    weights = custom_weights or DEFAULT_WEIGHTS
    total_weight = (
        weights.skill +
        weights.distance +
        weights.availability +
        weights.rating +
        weights.verification +
        weights.experience
    )
    if total_weight <= 0:
        total_weight = 100.0

    results: List[SmartMatchScore] = []

    for worker in workers:
        reasons: List[str] = []
        distance_km = calculate_distance_km(
            user_location.lat,
            user_location.lng,
            worker.location.lat,
            worker.location.lng
        )

        # 1. Skill Match Score (0 - 100)
        skill_raw = 20
        cat_match = worker.primaryCategory.lower() == target_category.lower()
        has_exact_skill = False
        if target_skill:
            has_exact_skill = any(
                target_skill.lower() in s.lower() or s.lower() in target_skill.lower()
                for s in worker.skills
            )

        if has_exact_skill:
            skill_raw = 100
            reasons.append(f"Required skill '{target_skill}' verified & available")
        elif cat_match:
            skill_raw = 75
            reasons.append(f"Experienced in {worker.primaryCategory} services")

        # 2. Distance Match Score (0 - 100)
        distance_raw = 15
        if distance_km <= 1.5:
            distance_raw = 100
            reasons.append(f"Very close: only {distance_km} km away")
        elif distance_km <= 3.5:
            distance_raw = 85
            reasons.append(f"Nearby worker ({distance_km} km away)")
        elif distance_km <= 6.0:
            distance_raw = 65
        elif distance_km <= worker.serviceRadiusKm:
            distance_raw = 40

        # 3. Availability Match Score (0 - 100)
        availability_raw = 0
        if worker.availability == "available":
            availability_raw = 100
            reasons.append("🟢 Available right now for immediate booking")
        elif worker.availability == "busy":
            availability_raw = 35
            reasons.append("🟡 Currently finishing another task")

        # 4. Rating Match Score (0 - 100)
        rating_raw = min(100, int((worker.rating / 5.0) * 100))
        if worker.rating >= 4.8:
            reasons.append(f"Top rated ({worker.rating:.1f} ⭐ with {worker.completedJobsCount} jobs)")
        elif worker.rating >= 4.5:
            reasons.append(f"Highly rated ({worker.rating:.1f} ⭐)")

        # 5. Verification Match Score (0 - 100)
        verified_count = 0
        if worker.verifications.identity == "verified":
            verified_count += 1
        if worker.verifications.skill == "verified":
            verified_count += 1
        if worker.verifications.shop == "verified":
            verified_count += 1
        if worker.verifications.mobile == "verified":
            verified_count += 1

        verification_raw = int((verified_count / 4.0) * 100)
        if worker.isOverallVerified:
            reasons.append(f"Verified member of {worker.cooperativeName}")

        # 6. Experience Match Score (0 - 100)
        experience_raw = 40
        if worker.experienceYears >= 10:
            experience_raw = 100
            reasons.append(f"{worker.experienceYears}+ years proven field experience")
        elif worker.experienceYears >= 5:
            experience_raw = 80
            reasons.append(f"{worker.experienceYears} years trade experience")
        elif worker.experienceYears >= 2:
            experience_raw = 60

        # Weighted Component Scores
        skill_match = int(round((skill_raw * weights.skill) / total_weight))
        distance_match = int(round((distance_raw * weights.distance) / total_weight))
        availability_match = int(round((availability_raw * weights.availability) / total_weight))
        rating_match = int(round((rating_raw * weights.rating) / total_weight))
        verification_match = int(round((verification_raw * weights.verification) / total_weight))
        experience_match = int(round((experience_raw * weights.experience) / total_weight))

        overall_score = min(99, skill_match + distance_match + availability_match + rating_match + verification_match + experience_match)

        breakdown = ScoreBreakdown(
            skillMatch=skill_match,
            distanceMatch=distance_match,
            availabilityMatch=availability_match,
            ratingMatch=rating_match,
            verificationMatch=verification_match,
            experienceMatch=experience_match
        )

        results.append(SmartMatchScore(
            workerId=worker.id,
            worker=worker,
            overallScore=overall_score,
            distanceKm=distance_km,
            breakdown=breakdown,
            reasons=reasons[:4]
        ))

    # Sort descending by overallScore
    results.sort(key=lambda x: x.overallScore, reverse=True)
    return results
