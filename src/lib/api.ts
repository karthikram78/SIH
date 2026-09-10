import {
  Worker,
  Cooperative,
  ServiceCategory,
  ServiceRequest,
  RatingReview,
  NotificationItem,
  SmartMatchScore,
  MatchWeights,
  LocationCoordinates,
  AIServiceAnalysis,
  DemandForecastItem,
  JobStatus,
  AvailabilityStatus,
  VerificationStatus,
} from '@/types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error [${response.status}] ${endpoint}: ${errorBody}`);
  }
  return response.json();
}

/** Check if the FastAPI backend is running and healthy */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}

// ================= WORKERS API =================
export async function fetchWorkers(params?: {
  category?: string;
  availability?: string;
  cooperativeId?: string;
  search?: string;
}): Promise<Worker[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.availability) query.append('availability', params.availability);
  if (params?.cooperativeId) query.append('cooperative_id', params.cooperativeId);
  if (params?.search) query.append('search', params.search);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<Worker[]>(`/workers${qs}`);
}

export async function fetchWorkerById(workerId: string): Promise<Worker> {
  return request<Worker>(`/workers/${workerId}`);
}

export async function registerWorkerApi(payload: Partial<Worker>): Promise<Worker> {
  return request<Worker>('/workers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateWorkerAvailabilityApi(
  workerId: string,
  availability: AvailabilityStatus
): Promise<Worker> {
  return request<Worker>(`/workers/${workerId}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ availability }),
  });
}

export async function verifyWorkerDocumentApi(
  workerId: string,
  docId: string,
  status: VerificationStatus,
  notes?: string
): Promise<Worker> {
  return request<Worker>(`/workers/${workerId}/documents/${docId}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes, verifiedBy: 'Platform Admin' }),
  });
}

// ================= COOPERATIVES API =================
export async function fetchCooperatives(): Promise<Cooperative[]> {
  return request<Cooperative[]>('/cooperatives');
}

export async function fetchCooperativeById(coopId: string): Promise<Cooperative> {
  return request<Cooperative>(`/cooperatives/${coopId}`);
}

export async function fetchCooperativeWorkers(coopId: string): Promise<Worker[]> {
  return request<Worker[]>(`/cooperatives/${coopId}/workers`);
}

export async function fetchCooperativeWelfareFund(coopId: string): Promise<any> {
  return request<any>(`/cooperatives/${coopId}/welfare-fund`);
}

// ================= CATEGORIES API =================
export async function fetchCategories(): Promise<ServiceCategory[]> {
  return request<ServiceCategory[]>('/categories');
}

// ================= SERVICE REQUESTS (JOBS) API =================
export async function fetchServiceRequests(params?: {
  customerId?: string;
  workerId?: string;
  status?: string;
}): Promise<ServiceRequest[]> {
  const query = new URLSearchParams();
  if (params?.customerId) query.append('customer_id', params.customerId);
  if (params?.workerId) query.append('worker_id', params.workerId);
  if (params?.status) query.append('status', params.status);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<ServiceRequest[]>(`/requests${qs}`);
}

export async function fetchServiceRequestById(requestId: string): Promise<ServiceRequest> {
  return request<ServiceRequest>(`/requests/${requestId}`);
}

export async function createServiceRequestApi(payload: {
  category: string;
  skill: string;
  problem: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  isEmergency?: boolean;
  workerId?: string;
  amount?: number;
  matchScore?: number;
  matchReasons?: string[];
  location?: LocationCoordinates;
  customerId?: string;
  customerName?: string;
  customerMobile?: string;
}): Promise<ServiceRequest> {
  return request<ServiceRequest>('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateJobStatusApi(
  requestId: string,
  status: JobStatus,
  extra?: {
    paymentMethod?: 'UPI' | 'Cash' | 'CoopWallet';
    amount?: number;
    verificationOtp?: string;
  }
): Promise<ServiceRequest> {
  return request<ServiceRequest>(`/requests/${requestId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      paymentMethod: extra?.paymentMethod,
      amount: extra?.amount,
      verificationOtp: extra?.verificationOtp,
    }),
  });
}

// ================= SMART MATCHING API =================
export async function smartMatchRankApi(payload: {
  userLocation: LocationCoordinates;
  targetCategory: string;
  targetSkill?: string;
  customWeights?: MatchWeights;
}): Promise<SmartMatchScore[]> {
  return request<SmartMatchScore[]>('/matching/rank', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ================= AI & FORECAST API =================
export async function analyzeServiceRequestApi(input: string): Promise<AIServiceAnalysis> {
  return request<AIServiceAnalysis>('/ai/parse-request', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
}

export async function fetchDemandForecastsApi(): Promise<DemandForecastItem[]> {
  return request<DemandForecastItem[]>('/ai/demand-forecast');
}

// ================= REVIEWS API =================
export async function fetchReviewsApi(params?: {
  workerId?: string;
  customerId?: string;
}): Promise<RatingReview[]> {
  const query = new URLSearchParams();
  if (params?.workerId) query.append('worker_id', params.workerId);
  if (params?.customerId) query.append('customer_id', params.customerId);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<RatingReview[]>(`/reviews${qs}`);
}

export async function submitReviewApi(payload: {
  serviceRequestId: string;
  workerId: string;
  rating: number;
  reviewText: string;
  customerId?: string;
  customerName?: string;
  serviceCategory?: string;
}): Promise<RatingReview> {
  return request<RatingReview>('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ================= NOTIFICATIONS API =================
export async function fetchNotificationsApi(params?: {
  role?: string;
  userId?: string;
}): Promise<NotificationItem[]> {
  const query = new URLSearchParams();
  if (params?.role) query.append('role', params.role);
  if (params?.userId) query.append('user_id', params.userId);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<NotificationItem[]>(`/notifications${qs}`);
}

export async function markNotificationReadApi(notifId: string): Promise<NotificationItem> {
  return request<NotificationItem>(`/notifications/${notifId}/read`, {
    method: 'PATCH',
  });
}

// ================= PLATFORM ADMIN API =================
export async function fetchPlatformMetricsApi(): Promise<any> {
  return request<any>('/admin/metrics');
}

export async function fetchVerificationAuditsApi(): Promise<any[]> {
  return request<any[]>('/admin/verifications');
}

export async function resetDemoDataApi(): Promise<any> {
  return request<any>('/admin/reset-demo', {
    method: 'POST',
  });
}

// ================= AUTHENTICATION API =================
export async function loginUserApi(payload: {
  identifier: string;
  password?: string;
  role?: string;
}): Promise<{ user: any; token: string; role: string; message: string }> {
  return request<{ user: any; token: string; role: string; message: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerUserApi(payload: {
  name: string;
  mobile: string;
  email: string;
  password?: string;
  role?: string;
  address?: string;
  city?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  primaryCategory?: string;
  skills?: string[];
  experienceYears?: number;
  baseChargePerHour?: number;
  cooperativeId?: string;
}): Promise<{ user: any; token: string; role: string; message: string }> {
  return request<{ user: any; token: string; role: string; message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function sendOtpApi(mobile: string): Promise<{ success: boolean; demoOtp: string; message: string }> {
  return request<{ success: boolean; demoOtp: string; message: string }>('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ mobile }),
  });
}

export async function verifyOtpApi(payload: {
  mobile: string;
  otp: string;
  role?: string;
}): Promise<{ user: any; token: string; role: string; message: string }> {
  return request<{ user: any; token: string; role: string; message: string }>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ================= DOCUMENT & FILE UPLOAD API =================
export async function uploadDocumentApi(file: File): Promise<{
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  message: string;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/upload/document`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Upload failed [${response.status}]: ${err}`);
  }

  return response.json();
}

