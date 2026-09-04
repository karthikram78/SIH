import { Worker, SmartMatchScore, MatchWeights, LocationCoordinates } from '@/types';

export const DEFAULT_WEIGHTS: MatchWeights = {
  skill: 30,
  distance: 25,
  availability: 15,
  rating: 10,
  verification: 10,
  experience: 10,
};

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

export function rankWorkers(
  workers: Worker[],
  userLocation: LocationCoordinates,
  targetCategory: string,
  targetSkill?: string,
  customWeights: MatchWeights = DEFAULT_WEIGHTS
): SmartMatchScore[] {
  const totalWeight =
    customWeights.skill +
    customWeights.distance +
    customWeights.availability +
    customWeights.rating +
    customWeights.verification +
    customWeights.experience;

  const results: SmartMatchScore[] = workers.map((worker) => {
    const reasons: string[] = [];
    const distanceKm = calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      worker.location.lat,
      worker.location.lng
    );

    // 1. Skill Match Score (0 - 100)
    let skillRaw = 0;
    const categoryMatch = worker.primaryCategory.toLowerCase() === targetCategory.toLowerCase();
    const hasExactSkill = targetSkill && worker.skills.some(
      (s) => s.toLowerCase().includes(targetSkill.toLowerCase()) || targetSkill.toLowerCase().includes(s.toLowerCase())
    );

    if (hasExactSkill) {
      skillRaw = 100;
      reasons.push(`Required skill '${targetSkill}' verified & available`);
    } else if (categoryMatch) {
      skillRaw = 75;
      reasons.push(`Experienced in ${worker.primaryCategory} services`);
    } else {
      skillRaw = 20;
    }

    // 2. Distance Match Score (0 - 100)
    // Distance within 2 km = 100, 2-5 km = 80, 5-10 km = 50, >10 km degrades
    let distanceRaw = 0;
    if (distanceKm <= 1.5) {
      distanceRaw = 100;
      reasons.push(`Very close: only ${distanceKm} km away`);
    } else if (distanceKm <= 3.5) {
      distanceRaw = 85;
      reasons.push(`Nearby worker (${distanceKm} km away)`);
    } else if (distanceKm <= 6.0) {
      distanceRaw = 65;
    } else if (distanceKm <= worker.serviceRadiusKm) {
      distanceRaw = 40;
    } else {
      distanceRaw = 15;
    }

    // 3. Availability Match Score (0 - 100)
    let availabilityRaw = 0;
    if (worker.availability === 'available') {
      availabilityRaw = 100;
      reasons.push('🟢 Available right now for immediate booking');
    } else if (worker.availability === 'busy') {
      availabilityRaw = 35;
      reasons.push('🟡 Currently finishing another task');
    } else {
      availabilityRaw = 0;
    }

    // 4. Rating Match Score (0 - 100)
    const ratingRaw = Math.min(100, Math.round((worker.rating / 5.0) * 100));
    if (worker.rating >= 4.8) {
      reasons.push(`Top rated (${worker.rating.toFixed(1)} ⭐ with ${worker.completedJobsCount} jobs)`);
    } else if (worker.rating >= 4.5) {
      reasons.push(`Highly rated (${worker.rating.toFixed(1)} ⭐)`);
    }

    // 5. Verification Match Score (0 - 100)
    let verifiedCount = 0;
    if (worker.verifications.identity === 'verified') verifiedCount++;
    if (worker.verifications.skill === 'verified') verifiedCount++;
    if (worker.verifications.shop === 'verified') verifiedCount++;
    if (worker.verifications.mobile === 'verified') verifiedCount++;

    const verificationRaw = Math.round((verifiedCount / 4) * 100);
    if (worker.isOverallVerified) {
      reasons.push(`Verified member of ${worker.cooperativeName}`);
    }

    // 6. Experience Match Score (0 - 100)
    // 10+ years = 100, 5-9 years = 80, 2-4 years = 60, <2 years = 40
    let experienceRaw = 40;
    if (worker.experienceYears >= 10) {
      experienceRaw = 100;
      reasons.push(`${worker.experienceYears}+ years proven field experience`);
    } else if (worker.experienceYears >= 5) {
      experienceRaw = 80;
      reasons.push(`${worker.experienceYears} years trade experience`);
    } else if (worker.experienceYears >= 2) {
      experienceRaw = 60;
    }

    // Weighted Component Scores
    const skillMatch = Math.round((skillRaw * customWeights.skill) / totalWeight);
    const distanceMatch = Math.round((distanceRaw * customWeights.distance) / totalWeight);
    const availabilityMatch = Math.round((availabilityRaw * customWeights.availability) / totalWeight);
    const ratingMatch = Math.round((ratingRaw * customWeights.rating) / totalWeight);
    const verificationMatch = Math.round((verificationRaw * customWeights.verification) / totalWeight);
    const experienceMatch = Math.round((experienceRaw * customWeights.experience) / totalWeight);

    const overallScore = Math.min(99, skillMatch + distanceMatch + availabilityMatch + ratingMatch + verificationMatch + experienceMatch);

    return {
      workerId: worker.id,
      worker,
      overallScore,
      distanceKm,
      breakdown: {
        skillMatch,
        distanceMatch,
        availabilityMatch,
        ratingMatch,
        verificationMatch,
        experienceMatch,
      },
      reasons: reasons.slice(0, 4),
    };
  });

  // Sort descending by overall score
  return results.sort((a, b) => b.overallScore - a.overallScore);
}
