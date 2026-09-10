from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LocationCoordinates(BaseModel):
    lat: float
    lng: float
    address: str
    city: str = "Avadi"
    pincode: str = "600054"
    landmark: Optional[str] = None

class UserBase(BaseModel):
    id: str
    name: str
    mobile: str
    email: str
    role: str
    avatar: Optional[str] = None
    location: LocationCoordinates
    createdAt: Optional[str] = None

class UserResponse(UserBase):
    pass

class CooperativeBase(BaseModel):
    id: str
    name: str
    registrationNumber: str
    district: str
    state: str = "Tamil Nadu"
    membersCount: int = 0
    activeWorkersCount: int = 0
    monthlyJobsCount: int = 0
    monthlyEarningsTotal: float = 0.0
    welfareFundBalance: float = 0.0
    contactPerson: str
    contactMobile: str
    address: str
    establishedYear: int = 2020

class CooperativeResponse(CooperativeBase):
    pass

class ServiceCategoryResponse(BaseModel):
    id: str
    name: str
    group: str
    description: str
    iconName: str
    skills: List[str] = []
    basePrice: float = 350.0
    urgencyDefault: str = "medium"

class ShopDetails(BaseModel):
    id: str
    name: str
    address: str
    photoUrl: str
    lat: float
    lng: float
    establishedYear: int
    isShopVerified: bool = False

class WorkerDocumentResponse(BaseModel):
    id: str
    type: str  # identity, skill_certificate, shop_proof, police_clearance
    name: str
    fileUrl: str
    status: str  # pending, verified, rejected, needs_info
    uploadedAt: str
    verifiedAt: Optional[str] = None
    verifiedBy: Optional[str] = None
    notes: Optional[str] = None

class WorkerVerifications(BaseModel):
    identity: str = "pending"
    skill: str = "pending"
    shop: str = "pending"
    mobile: str = "verified"

class WorkerResponse(BaseModel):
    id: str
    userId: Optional[str] = None
    name: str
    mobile: str
    email: str
    avatar: Optional[str] = None
    headline: str
    bio: str
    primaryCategory: str
    skills: List[str] = []
    experienceYears: int = 1
    rating: float = 5.0
    completedJobsCount: int = 0
    availability: str = "available"  # available, busy, offline
    location: LocationCoordinates
    serviceRadiusKm: float = 8.0
    baseChargePerHour: float = 350.0
    cooperativeId: Optional[str] = None
    cooperativeName: str
    shop: Optional[ShopDetails] = None
    documents: List[WorkerDocumentResponse] = []
    verifications: WorkerVerifications
    isOverallVerified: bool = False
    joinedDate: str
    responseTimeMinutes: int = 10

class WorkerRegisterRequest(BaseModel):
    name: str
    mobile: str
    email: str
    avatar: Optional[str] = None
    headline: Optional[str] = "Independent Skilled Tradesperson"
    bio: Optional[str] = "Recently registered skilled worker with certified trade experience."
    primaryCategory: str
    skills: List[str] = []
    experienceYears: int = 2
    location: Optional[LocationCoordinates] = None
    serviceRadiusKm: float = 8.0
    baseChargePerHour: float = 350.0
    cooperativeId: Optional[str] = "coop-1"
    cooperativeName: Optional[str] = "Avadi Skilled Workers Cooperative Society"
    shop: Optional[ShopDetails] = None
    documents: List[WorkerDocumentResponse] = []

class WorkerAvailabilityUpdate(BaseModel):
    availability: str  # available, busy, offline

class DocumentVerificationUpdate(BaseModel):
    status: str  # verified, rejected, needs_info
    notes: Optional[str] = None
    verifiedBy: Optional[str] = "Platform Admin"

class PaymentBreakdown(BaseModel):
    totalAmount: float
    workerEarnings: float
    cooperativeContribution: float
    platformFee: float
    workerPercentage: int = 85
    cooperativePercentage: int = 10
    platformPercentage: int = 5

class ServiceRequestCreate(BaseModel):
    category: str
    skill: str
    problem: str
    urgency: str = "medium"  # low, medium, high, emergency
    isEmergency: bool = False
    workerId: Optional[str] = None
    amount: Optional[float] = None
    matchScore: Optional[float] = None
    matchReasons: Optional[List[str]] = None
    location: Optional[LocationCoordinates] = None
    customerId: Optional[str] = "cust-101"
    customerName: Optional[str] = "Priya Sharma"
    customerMobile: Optional[str] = "+91 98421 77312"

class ServiceRequestStatusUpdate(BaseModel):
    status: str  # accepted, navigating, arrived, in_progress, completed, paid, cancelled
    paymentMethod: Optional[str] = "UPI"  # UPI, Cash, CoopWallet
    amount: Optional[float] = None
    verificationOtp: Optional[str] = None

class ServiceRequestResponse(BaseModel):
    id: str
    customerId: str
    customerName: str
    customerMobile: str
    serviceCategory: str
    requiredSkill: str
    problemDescription: str
    urgency: str
    isEmergency: bool
    location: LocationCoordinates
    status: str
    assignedWorkerId: Optional[str] = None
    assignedWorker: Optional[WorkerResponse] = None
    matchScore: Optional[float] = None
    matchReasons: Optional[List[str]] = []
    createdAt: str
    acceptedAt: Optional[str] = None
    arrivedAt: Optional[str] = None
    startedAt: Optional[str] = None
    completedAt: Optional[str] = None
    paidAt: Optional[str] = None
    notes: Optional[str] = None
    amount: float
    paymentBreakdown: Optional[PaymentBreakdown] = None
    paymentMethod: Optional[str] = None
    paymentStatus: Optional[str] = "pending"
    paymentUpiId: Optional[str] = None
    paymentQrData: Optional[str] = None
    rating: Optional[float] = None
    reviewText: Optional[str] = None
    verificationOtp: str

class MatchWeights(BaseModel):
    skill: float = 30.0
    distance: float = 25.0
    availability: float = 15.0
    rating: float = 10.0
    verification: float = 10.0
    experience: float = 10.0

class SmartMatchRequest(BaseModel):
    userLocation: LocationCoordinates
    targetCategory: str
    targetSkill: Optional[str] = None
    customWeights: Optional[MatchWeights] = None

class ScoreBreakdown(BaseModel):
    skillMatch: int
    distanceMatch: int
    availabilityMatch: int
    ratingMatch: int
    verificationMatch: int
    experienceMatch: int

class SmartMatchScore(BaseModel):
    workerId: str
    worker: WorkerResponse
    overallScore: int
    distanceKm: float
    breakdown: ScoreBreakdown
    reasons: List[str]

class AIServiceAnalysis(BaseModel):
    detectedService: str
    problem: str
    urgency: str
    requiredSkill: str
    estimatedCostRange: str
    recommendedKeywords: List[str]

class AIAnalysisRequest(BaseModel):
    input: str

class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    history: List[Dict[str, str]] = []

class AIChatResponse(BaseModel):
    reply: str
    intent: str
    detectedService: Optional[str] = None
    urgency: Optional[str] = None
    estimatedCostRange: Optional[str] = None
    suggestedAction: Optional[str] = None

class RatingReviewCreate(BaseModel):
    serviceRequestId: str
    workerId: str
    customerId: Optional[str] = "cust-101"
    customerName: Optional[str] = "Priya Sharma"
    rating: float = Field(..., ge=1, le=5)
    reviewText: str
    serviceCategory: Optional[str] = None

class RatingReviewResponse(BaseModel):
    id: str
    serviceRequestId: str
    workerId: str
    customerId: str
    customerName: str
    rating: float
    reviewText: str
    createdAt: str
    serviceCategory: str

class NotificationCreate(BaseModel):
    targetRole: str
    targetUserId: Optional[str] = None
    title: str
    message: str
    type: str = "job"
    actionUrl: Optional[str] = None

class NotificationResponse(BaseModel):
    id: str
    targetRole: str
    targetUserId: Optional[str] = None
    title: str
    message: str
    timestamp: str
    read: bool
    type: str
    actionUrl: Optional[str] = None

class VerificationAuditRecord(BaseModel):
    id: str
    workerId: str
    workerName: str
    documentType: str
    action: str
    decidedBy: str
    decidedAt: str
    notes: str

class DemandForecastItem(BaseModel):
    category: str
    predictedDemandChange: str
    urgencyNotice: str
    reason: str
    affectedZones: List[str]
    recommendedAction: str

class PlatformMetricsResponse(BaseModel):
    totalWorkers: int
    activeWorkers: int
    totalCooperatives: int
    totalJobsCompleted: int
    totalVolumeGmv: float
    platformRevenue5Percent: float
    cooperativeWelfarePool10Percent: float
    workerNetDisbursement85Percent: float
    averageWorkerRating: float
    verifiedWorkersCount: int

# Auth & Upload schemas
class UserLoginRequest(BaseModel):
    identifier: str  # email or mobile
    password: Optional[str] = "password123"
    role: Optional[str] = None

class UserRegisterRequest(BaseModel):
    name: str
    mobile: str
    email: str
    password: Optional[str] = "password123"
    role: str = "customer"  # customer, worker, cooperative_admin, platform_admin
    avatar: Optional[str] = None
    address: Optional[str] = "Avadi Main Road, Avadi"
    city: Optional[str] = "Avadi"
    pincode: Optional[str] = "600054"
    lat: Optional[float] = 13.1147
    lng: Optional[float] = 80.1048
    landmark: Optional[str] = None
    # Optional worker fields if registering as worker
    primaryCategory: Optional[str] = None
    skills: Optional[List[str]] = None
    experienceYears: Optional[int] = 1
    baseChargePerHour: Optional[float] = 350.0
    cooperativeId: Optional[str] = "coop-1"

class UserAuthResponse(BaseModel):
    user: UserResponse
    token: str = "mock-jwt-token-sih-2024"
    role: str
    message: str = "Authentication successful"

class OtpRequest(BaseModel):
    mobile: str

class OtpVerifyRequest(BaseModel):
    mobile: str
    otp: str
    role: Optional[str] = "customer"

class FileUploadResponse(BaseModel):
    url: str
    filename: str
    size: int
    mimeType: str
    message: str = "File uploaded successfully"

