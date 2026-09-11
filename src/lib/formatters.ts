export function formatWorker(p: any) {
  let parsedSkills: string[] = [];
  try {
    parsedSkills = p.skills ? JSON.parse(p.skills) : [];
  } catch {
    parsedSkills = [p.primaryCategory || 'General'];
  }

  let parsedDocs: any[] = [];
  try {
    parsedDocs = p.documents ? JSON.parse(p.documents) : [];
  } catch {
    parsedDocs = [];
  }

  let parsedVerifications: any = {
    identity: 'pending',
    skill: 'pending',
    shop: 'pending',
    mobile: 'verified',
  };
  try {
    if (p.verifications) parsedVerifications = JSON.parse(p.verifications);
  } catch {}

  return {
    id: p.id,
    userId: p.userId,
    name: p.user?.name || 'Skilled Artisan',
    mobile: p.user?.mobile ? `+91 ${p.user.mobile}` : '+91 98765 43210',
    email: p.user?.email || '',
    avatar: p.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    headline: p.headline || `Certified ${p.primaryCategory || 'Trade'} Specialist`,
    bio: p.bio || 'Experienced skilled local artisan in Avadi.',
    primaryCategory: p.primaryCategory || 'Plumbing',
    skills: parsedSkills,
    experienceYears: p.experienceYears || 3,
    rating: p.rating || 5.0,
    completedJobsCount: p.completedJobs || 0,
    availability: p.availability || (p.isAvailable ? 'available' : 'busy'),
    location: {
      lat: p.user?.lat || 13.1147,
      lng: p.user?.lng || 80.1048,
      address: p.user?.address || 'Avadi Main Road, Avadi',
      city: p.user?.city || 'Avadi',
      pincode: p.user?.pincode || '600054',
      landmark: p.user?.landmark || 'Avadi',
    },
    serviceRadiusKm: p.serviceRadiusKm || 8,
    baseChargePerHour: p.baseChargePerHour || 350,
    cooperativeId: p.cooperativeId || 'coop-1',
    cooperativeName: p.cooperative?.name || 'Chennai Central Service Cooperative Society',
    documents: parsedDocs,
    verifications: parsedVerifications,
    isOverallVerified: p.isOverallVerified ?? p.verified,
    isVerified: p.isOverallVerified ?? p.verified,
    joinedDate: p.createdAt ? p.createdAt.toISOString().split('T')[0] : '2023-01-01',
    registeredAt: p.user?.registeredAt ? p.user.registeredAt.toISOString() : (p.user?.createdAt ? p.user.createdAt.toISOString() : new Date().toISOString()),
    lastLoginAt: p.user?.lastLoginAt ? p.user.lastLoginAt.toISOString() : undefined,
    responseTimeMinutes: p.responseTimeMinutes || 7,
  };
}

export function formatServiceRequest(r: any) {
  let reasons: string[] = [];
  try {
    reasons = r.matchReasons ? JSON.parse(r.matchReasons) : [];
  } catch {
    reasons = ['Optimal match'];
  }

  const amount = r.amount || 450;
  const workerEarnings = r.workerEarnings || Math.round(amount * 0.85);
  const cooperativeContribution = r.cooperativeFee || Math.round(amount * 0.10);
  const platformFee = r.platformFee || (amount - workerEarnings - cooperativeContribution);

  return {
    id: r.id,
    customerId: r.customerId,
    customerName: r.customer?.name || 'Customer',
    customerMobile: r.customer?.mobile ? `+91 ${r.customer.mobile}` : '+91 98421 77312',
    serviceCategory: r.categoryName || r.serviceCategory?.name || 'Home Service',
    category: r.categoryName || r.serviceCategory?.name || 'Home Service',
    requiredSkill: r.requiredSkill || 'General Repair',
    problemDescription: r.problemDescription,
    problem: r.problemDescription,
    urgency: r.urgency || 'medium',
    isEmergency: r.isEmergency || false,
    location: {
      lat: r.locationLat || 13.1147,
      lng: r.locationLng || 80.1048,
      address: r.address || 'Avadi Main Road, Avadi',
      city: r.city || 'Avadi',
      pincode: r.pincode || '600054',
    },
    status: r.status,
    assignedWorkerId: r.assignedWorkerId,
    assignedWorker: r.assignedWorker ? formatWorker(r.assignedWorker) : undefined,
    workerName: r.assignedWorker?.user?.name,
    matchScore: r.matchScore || 90,
    matchReasons: reasons,
    createdAt: r.createdAt.toISOString(),
    acceptedAt: r.acceptedAt?.toISOString(),
    arrivedAt: r.arrivedAt?.toISOString(),
    startedAt: r.startedAt?.toISOString(),
    completedAt: r.completedAt?.toISOString(),
    paidAt: r.paidAt?.toISOString(),
    amount,
    paymentBreakdown: {
      totalAmount: amount,
      workerEarnings,
      cooperativeContribution,
      platformFee,
      workerPercentage: 85,
      cooperativePercentage: 10,
      platformPercentage: 5,
    },
    paymentMethod: r.paymentMethod || 'UPI',
    paymentStatus: r.paymentStatus || 'pending',
    paymentUpiId: 'avadi.connect@upi',
    paymentQrData: `upi://pay?pa=avadi.connect@upi&pn=Avadi%20Connect&am=${amount.toFixed(2)}&cu=INR`,
    rating: r.rating,
    reviewText: r.reviewText,
    verificationOtp: r.verificationOtp || '4821',
  };
}
