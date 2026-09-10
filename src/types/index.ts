export type UserRole = 'customer' | 'worker' | 'cooperative_admin' | 'platform_admin';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export type JobStatus = 
  | 'requested'
  | 'accepted'
  | 'navigating'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'paid'
  | 'cancelled';

export type AvailabilityStatus = 'available' | 'busy' | 'offline';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'needs_info';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  city: string;
  pincode: string;
  landmark?: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: UserRole;
  avatar: string;
  location: LocationCoordinates;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  group: 'Home Services' | 'Personal Services' | 'Vehicle Services' | 'Community Services';
  description: string;
  iconName: string;
  skills: string[];
  basePrice: number;
  urgencyDefault: UrgencyLevel;
}

export interface WorkerDocument {
  id: string;
  type: 'identity' | 'skill_certificate' | 'shop_proof' | 'police_clearance';
  name: string;
  fileUrl: string;
  status: VerificationStatus;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  photoUrl: string;
  lat: number;
  lng: number;
  establishedYear: number;
  isShopVerified: boolean;
}

export interface Worker {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  avatar: string;
  headline: string;
  bio: string;
  primaryCategory: string;
  skills: string[];
  experienceYears: number;
  rating: number;
  completedJobsCount: number;
  availability: AvailabilityStatus;
  location: LocationCoordinates;
  serviceRadiusKm: number;
  baseChargePerHour: number;
  cooperativeId: string;
  cooperativeName: string;
  shop?: Shop;
  documents: WorkerDocument[];
  verifications: {
    identity: VerificationStatus;
    skill: VerificationStatus;
    shop: VerificationStatus;
    mobile: VerificationStatus;
  };
  isOverallVerified: boolean;
  isVerified?: boolean;
  joinedDate: string;
  responseTimeMinutes: number;
}

export interface Cooperative {
  id: string;
  name: string;
  registrationNumber: string;
  district: string;
  state: string;
  membersCount: number;
  activeWorkersCount: number;
  monthlyJobsCount: number;
  monthlyEarningsTotal: number;
  welfareFundBalance: number;
  contactPerson: string;
  contactMobile: string;
  address: string;
  establishedYear: number;
}

export interface AIServiceAnalysis {
  detectedService: string;
  problem: string;
  urgency: UrgencyLevel;
  requiredSkill: string;
  estimatedCostRange: string;
  recommendedKeywords: string[];
  reasoning?: string;
}

export interface SmartMatchScore {
  workerId: string;
  worker: Worker;
  overallScore: number; // 0 to 100
  matchScore?: number;
  distanceKm: number;
  breakdown: {
    skillMatch: number; // 0 to 30
    distanceMatch: number; // 0 to 25
    availabilityMatch: number; // 0 to 15
    ratingMatch: number; // 0 to 10
    verificationMatch: number; // 0 to 10
    experienceMatch: number; // 0 to 10
  };
  reasons: string[];
}

export interface MatchWeights {
  skill: number; // default 30
  distance: number; // default 25
  availability: number; // default 15
  rating: number; // default 10
  verification: number; // default 10
  experience: number; // default 10
}

export interface PaymentBreakdown {
  totalAmount: number;
  workerEarnings: number; // 85%
  cooperativeContribution: number; // 10%
  platformFee: number; // 5%
  workerPercentage: number;
  cooperativePercentage: number;
  platformPercentage: number;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  serviceCategory: string;
  category?: string;
  requiredSkill: string;
  problemDescription: string;
  problem?: string;
  urgency: UrgencyLevel;
  isEmergency: boolean;
  location: LocationCoordinates;
  status: JobStatus;
  assignedWorkerId?: string;
  assignedWorker?: Worker;
  workerName?: string;
  matchScore?: number;
  matchReasons?: string[];
  createdAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  paidAt?: string;
  notes?: string;
  amount: number;
  paymentBreakdown?: PaymentBreakdown;
  paymentMethod?: 'UPI' | 'Cash' | 'CoopWallet';
  paymentStatus?: 'pending' | 'completed';
  rating?: number;
  reviewText?: string;
  verificationOtp?: string;
}

export interface RatingReview {
  id: string;
  serviceRequestId: string;
  workerId: string;
  customerId: string;
  customerName: string;
  workerName?: string;
  rating: number; // 1 to 5
  reviewText: string;
  comment?: string;
  createdAt: string;
  serviceCategory: string;
  category?: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'job' | 'verification' | 'payment' | 'alert';
  actionUrl?: string;
}

export interface VerificationAuditRecord {
  id: string;
  workerId: string;
  workerName: string;
  documentType: string;
  action: 'approved' | 'rejected' | 'more_info_requested';
  decidedBy: string;
  decidedAt: string;
  notes: string;
}

export interface DemandForecastItem {
  category: string;
  predictedDemandChange: string;
  urgencyNotice: string;
  reason: string;
  affectedZones: string[];
  recommendedAction: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  role: UserRole;
  message: string;
}

export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  message: string;
}

