'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  User,
  Worker,
  Cooperative,
  ServiceCategory,
  ServiceRequest,
  RatingReview,
  NotificationItem,
  MatchWeights,
  LocationCoordinates,
  AvailabilityStatus,
  VerificationStatus,
  JobStatus,
  PaymentBreakdown,
} from '@/types';
import {
  CURRENT_CUSTOMER,
  INITIAL_COOPERATIVES,
  INITIAL_WORKERS,
  SERVICE_CATEGORIES,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from '@/data/seedData';
import { DEFAULT_WEIGHTS } from '@/lib/matchingEngine';
import {
  checkBackendHealth,
  fetchWorkers,
  fetchCooperatives,
  fetchCategories,
  fetchServiceRequests,
  fetchReviewsApi,
  fetchNotificationsApi,
  createServiceRequestApi,
  updateJobStatusApi,
  submitReviewApi,
  updateWorkerAvailabilityApi,
  verifyWorkerDocumentApi,
  registerWorkerApi,
  markNotificationReadApi,
  resetDemoDataApi,
} from '@/lib/api';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  currentWorker: Worker;
  setCurrentWorkerId: (id: string) => void;
  workers: Worker[];
  cooperatives: Cooperative[];
  serviceCategories: ServiceCategory[];
  serviceRequests: ServiceRequest[];
  reviews: RatingReview[];
  notifications: NotificationItem[];
  weights: MatchWeights;
  setWeights: (weights: MatchWeights) => void;
  userLocation: LocationCoordinates;
  setUserLocation: (loc: LocationCoordinates) => void;
  
  // Backend Connection State
  isBackendConnected: boolean;
  backendLoading: boolean;
  refreshFromBackend: () => Promise<void>;

  // Actions
  createServiceRequest: (params: {
    category: string;
    skill: string;
    problem: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    isEmergency?: boolean;
    workerId?: string;
    amount?: number;
    matchScore?: number;
    matchReasons?: string[];
  }) => Promise<ServiceRequest>;

  updateJobStatus: (requestId: string, status: JobStatus, extra?: {
    paymentMethod?: 'UPI' | 'Cash' | 'CoopWallet';
    amount?: number;
    verificationOtp?: string;
  }) => Promise<void>;

  submitReview: (requestId: string, rating: number, reviewText: string) => Promise<void>;
  setWorkerAvailability: (workerId: string, status: AvailabilityStatus) => Promise<void>;
  verifyDocument: (workerId: string, docId: string, status: VerificationStatus, notes?: string) => Promise<void>;
  registerWorker: (data: Partial<Worker>) => Promise<Worker>;
  markNotificationRead: (id: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'kaushalsetu_state_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentUser] = useState<User>(CURRENT_CUSTOMER);
  const [currentWorkerId, setCurrentWorkerId] = useState<string>('worker-1');
  const [userLocation, setUserLocation] = useState<LocationCoordinates>(CURRENT_CUSTOMER.location);
  const [weights, setWeights] = useState<MatchWeights>(DEFAULT_WEIGHTS);

  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(INITIAL_COOPERATIVES);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [reviews, setReviews] = useState<RatingReview[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [backendLoading, setBackendLoading] = useState<boolean>(false);

  // Sync data from FastAPI backend
  const refreshFromBackend = useCallback(async () => {
    setBackendLoading(true);
    try {
      const isAlive = await checkBackendHealth();
      if (isAlive) {
        setIsBackendConnected(true);
        const [wList, cList, catList, rList, revList, nList] = await Promise.all([
          fetchWorkers(),
          fetchCooperatives(),
          fetchCategories(),
          fetchServiceRequests(),
          fetchReviewsApi(),
          fetchNotificationsApi(),
        ]);

        if (wList && wList.length > 0) setWorkers(wList);
        if (cList && cList.length > 0) setCooperatives(cList);
        if (catList && catList.length > 0) setServiceCategories(catList);
        if (rList && rList.length > 0) setServiceRequests(rList);
        if (revList && revList.length > 0) setReviews(revList);
        if (nList && nList.length > 0) setNotifications(nList);
      } else {
        setIsBackendConnected(false);
      }
    } catch {
      setIsBackendConnected(false);
    } finally {
      setBackendLoading(false);
    }
  }, []);

  // Initial mount: load from backend or localStorage fallback
  useEffect(() => {
    // 1. First load local state
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workers) setWorkers(parsed.workers);
        if (parsed.cooperatives) setCooperatives(parsed.cooperatives);
        if (parsed.serviceCategories) setServiceCategories(parsed.serviceCategories);
        if (parsed.serviceRequests) setServiceRequests(parsed.serviceRequests);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.weights) setWeights(parsed.weights);
      }
    } catch {
      // ignore
    }

    // 2. Then attempt live sync from FastAPI backend
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Save to localStorage when critical state changes
  useEffect(() => {
    try {
      const dataToSave = {
        workers,
        cooperatives,
        serviceCategories,
        serviceRequests,
        reviews,
        notifications,
        weights,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [workers, cooperatives, serviceCategories, serviceRequests, reviews, notifications, weights]);

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0];

  const calculatePaymentSplit = (total: number): PaymentBreakdown => {
    const workerEarnings = Math.round(total * 0.85);
    const cooperativeContribution = Math.round(total * 0.10);
    const platformFee = total - workerEarnings - cooperativeContribution; // exactly 5%
    return {
      totalAmount: total,
      workerEarnings,
      cooperativeContribution,
      platformFee,
      workerPercentage: 85,
      cooperativePercentage: 10,
      platformPercentage: 5,
    };
  };

  const createServiceRequest = async ({
    category,
    skill,
    problem,
    urgency,
    isEmergency = false,
    workerId,
    amount = 450,
    matchScore,
    matchReasons,
  }: {
    category: string;
    skill: string;
    problem: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    isEmergency?: boolean;
    workerId?: string;
    amount?: number;
    matchScore?: number;
    matchReasons?: string[];
  }): Promise<ServiceRequest> => {
    // Try FastAPI Backend
    if (isBackendConnected) {
      try {
        const createdReq = await createServiceRequestApi({
          category,
          skill,
          problem,
          urgency,
          isEmergency,
          workerId,
          amount,
          matchScore,
          matchReasons,
          location: userLocation,
          customerId: currentUser.id,
          customerName: currentUser.name,
          customerMobile: currentUser.mobile,
        });
        setServiceRequests((prev) => [createdReq, ...prev]);

        // Add local notification
        if (workerId) {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            targetRole: 'worker',
            targetUserId: workerId,
            title: isEmergency ? '🚨 URGENT EMERGENCY REQUEST' : 'New Service Request Nearby',
            message: `${currentUser.name} requested ${category} (${skill}) at ${userLocation.address.split(',')[0]} (Est: ₹${amount})`,
            timestamp: 'Just now',
            read: false,
            type: 'job',
          };
          setNotifications((prev) => [newNotif, ...prev]);
        }
        return createdReq;
      } catch (err) {
        console.warn('Backend create request failed, falling back to local:', err);
      }
    }

    // Fallback local logic
    const assignedWorker = workerId ? workers.find((w) => w.id === workerId) : undefined;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const newReq: ServiceRequest = {
      id: `req-${Date.now().toString().slice(-4)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerMobile: currentUser.mobile,
      serviceCategory: category,
      requiredSkill: skill,
      problemDescription: problem,
      urgency,
      isEmergency,
      location: userLocation,
      status: 'requested',
      assignedWorkerId: workerId,
      assignedWorker,
      matchScore: matchScore || 90,
      matchReasons: matchReasons || ['Optimal nearby worker match'],
      createdAt: new Date().toISOString(),
      amount,
      paymentBreakdown: calculatePaymentSplit(amount),
      paymentStatus: 'pending',
      verificationOtp: otp,
    };

    setServiceRequests((prev) => [newReq, ...prev]);

    if (workerId) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        targetRole: 'worker',
        targetUserId: workerId,
        title: isEmergency ? '🚨 URGENT EMERGENCY REQUEST' : 'New Service Request Nearby',
        message: `${currentUser.name} requested ${category} (${skill}) at ${userLocation.address.split(',')[0]} (Est: ₹${amount})`,
        timestamp: 'Just now',
        read: false,
        type: 'job',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    return newReq;
  };

  const updateJobStatus = async (
    requestId: string,
    status: JobStatus,
    extra?: {
      paymentMethod?: 'UPI' | 'Cash' | 'CoopWallet';
      amount?: number;
      verificationOtp?: string;
    }
  ) => {
    // Try FastAPI Backend
    if (isBackendConnected) {
      try {
        const updated = await updateJobStatusApi(requestId, status, extra);
        setServiceRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
        // Re-fetch workers & cooperatives to sync ledger balances
        if (status === 'paid') {
          const [updatedWorkers, updatedCoops] = await Promise.all([
            fetchWorkers(),
            fetchCooperatives(),
          ]);
          setWorkers(updatedWorkers);
          setCooperatives(updatedCoops);
        }
        return;
      } catch (err) {
        console.warn('Backend update status failed, falling back to local:', err);
      }
    }

    // Local fallback
    setServiceRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const now = new Date().toISOString();
        const finalAmount = extra?.amount || req.amount;
        const updatedReq: ServiceRequest = {
          ...req,
          status,
          amount: finalAmount,
          paymentBreakdown: calculatePaymentSplit(finalAmount),
        };

        if (status === 'accepted') updatedReq.acceptedAt = now;
        if (status === 'arrived') updatedReq.arrivedAt = now;
        if (status === 'in_progress') updatedReq.startedAt = now;
        if (status === 'completed') updatedReq.completedAt = now;
        if (status === 'paid') {
          updatedReq.paidAt = now;
          updatedReq.paymentStatus = 'completed';
          if (extra?.paymentMethod) updatedReq.paymentMethod = extra.paymentMethod;

          // Increment worker completed jobs and cooperative earnings
          if (req.assignedWorkerId) {
            setWorkers((wList) =>
              wList.map((w) => {
                if (w.id === req.assignedWorkerId) {
                  return {
                    ...w,
                    completedJobsCount: w.completedJobsCount + 1,
                  };
                }
                return w;
              })
            );

            // Increment cooperative earnings
            const worker = workers.find((w) => w.id === req.assignedWorkerId);
            if (worker?.cooperativeId) {
              const coopShare = Math.round(finalAmount * 0.10);
              setCooperatives((cList) =>
                cList.map((c) => {
                  if (c.id === worker.cooperativeId) {
                    return {
                      ...c,
                      monthlyJobsCount: c.monthlyJobsCount + 1,
                      monthlyEarningsTotal: c.monthlyEarningsTotal + finalAmount,
                      welfareFundBalance: c.welfareFundBalance + coopShare,
                    };
                  }
                  return c;
                })
              );
            }
          }
        }

        return updatedReq;
      })
    );

    // Add notification
    const targetReq = serviceRequests.find((r) => r.id === requestId);
    if (targetReq) {
      let msg = `Job status updated to ${status}`;
      if (status === 'accepted') msg = `${targetReq.assignedWorker?.name || 'Worker'} accepted your request and is preparing.`;
      if (status === 'navigating') msg = `${targetReq.assignedWorker?.name || 'Worker'} is on the way to your location.`;
      if (status === 'arrived') msg = `Worker has arrived at your address! Share OTP ${targetReq.verificationOtp} to begin.`;
      if (status === 'completed') msg = `Work marked complete! Please inspect and proceed to transparent payment.`;
      if (status === 'paid') msg = `Payment of ₹${targetReq.amount} confirmed via ${extra?.paymentMethod || 'UPI'}. Thank you!`;

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'customer',
          title: `Job Update: ${status.replace('_', ' ').toUpperCase()}`,
          message: msg,
          timestamp: 'Just now',
          read: false,
          type: 'job',
        },
        ...prev,
      ]);
    }
  };

  const submitReview = async (requestId: string, rating: number, reviewText: string) => {
    const targetReq = serviceRequests.find((r) => r.id === requestId);
    if (!targetReq || !targetReq.assignedWorkerId) return;

    if (isBackendConnected) {
      try {
        const rev = await submitReviewApi({
          serviceRequestId: requestId,
          workerId: targetReq.assignedWorkerId,
          customerId: currentUser.id,
          customerName: currentUser.name,
          rating,
          reviewText,
          serviceCategory: targetReq.serviceCategory,
        });
        setReviews((prev) => [rev, ...prev]);
        const updatedWorkers = await fetchWorkers();
        setWorkers(updatedWorkers);
        return;
      } catch (err) {
        console.warn('Backend submit review failed, falling back:', err);
      }
    }

    const newReview: RatingReview = {
      id: `rev-${Date.now()}`,
      serviceRequestId: requestId,
      workerId: targetReq.assignedWorkerId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating,
      reviewText,
      createdAt: new Date().toISOString(),
      serviceCategory: targetReq.serviceCategory,
    };

    setReviews((prev) => [newReview, ...prev]);

    setWorkers((wList) =>
      wList.map((w) => {
        if (w.id === targetReq.assignedWorkerId) {
          const newAvg = (w.rating * w.completedJobsCount + rating) / (w.completedJobsCount + 1);
          return {
            ...w,
            rating: Math.round(newAvg * 100) / 100,
          };
        }
        return w;
      })
    );

    setServiceRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return { ...r, rating, reviewText };
        }
        return r;
      })
    );
  };

  const setWorkerAvailability = async (workerId: string, status: AvailabilityStatus) => {
    if (isBackendConnected) {
      try {
        const updated = await updateWorkerAvailabilityApi(workerId, status);
        setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
        return;
      } catch (err) {
        console.warn('Backend set availability failed, falling back:', err);
      }
    }

    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, availability: status } : w))
    );
  };

  const verifyDocument = async (
    workerId: string,
    docId: string,
    status: VerificationStatus,
    notes?: string
  ) => {
    if (isBackendConnected) {
      try {
        const updated = await verifyWorkerDocumentApi(workerId, docId, status, notes);
        setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
        return;
      } catch (err) {
        console.warn('Backend verify doc failed, falling back:', err);
      }
    }

    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;

        const updatedDocs = w.documents.map((d) => {
          if (d.id === docId) {
            return {
              ...d,
              status,
              verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
              verifiedBy: 'Platform Admin / Verification Committee',
              notes: notes || d.notes,
            };
          }
          return d;
        });

        const identityDoc = updatedDocs.find((d) => d.type === 'identity');
        const skillDoc = updatedDocs.find((d) => d.type === 'skill_certificate');
        const shopDoc = updatedDocs.find((d) => d.type === 'shop_proof');

        const newVerifications = {
          identity: identityDoc ? identityDoc.status : w.verifications.identity,
          skill: skillDoc ? skillDoc.status : w.verifications.skill,
          shop: shopDoc ? shopDoc.status : w.verifications.shop,
          mobile: 'verified' as VerificationStatus,
        };

        const isOverallVerified =
          newVerifications.identity === 'verified' &&
          newVerifications.skill === 'verified' &&
          newVerifications.mobile === 'verified';

        return {
          ...w,
          documents: updatedDocs,
          verifications: newVerifications,
          isOverallVerified,
        };
      })
    );
  };

  const registerWorker = async (data: Partial<Worker>): Promise<Worker> => {
    if (isBackendConnected) {
      try {
        const created = await registerWorkerApi(data);
        setWorkers((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        console.warn('Backend register worker failed, falling back:', err);
      }
    }

    const newWorkerId = `worker-${Date.now().toString().slice(-4)}`;
    const newWorker: Worker = {
      id: newWorkerId,
      userId: `user-w-${Date.now()}`,
      name: data.name || 'New Worker',
      mobile: data.mobile || '+91 99000 11223',
      email: data.email || 'worker@example.com',
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      headline: data.headline || 'Independent Skilled Tradesperson',
      bio: data.bio || 'Recently registered independent local skilled worker with verified training.',
      primaryCategory: data.primaryCategory || 'Plumbing',
      skills: data.skills || ['General Repair'],
      experienceYears: data.experienceYears || 3,
      rating: 5.0,
      completedJobsCount: 0,
      availability: 'available',
      location: data.location || userLocation,
      serviceRadiusKm: data.serviceRadiusKm || 8,
      baseChargePerHour: data.baseChargePerHour || 350,
      cooperativeId: data.cooperativeId || 'coop-1',
      cooperativeName:
        data.cooperativeName || 'Trichy Local Service Cooperative Society',
      documents: data.documents || [],
      verifications: {
        identity: 'pending',
        skill: 'pending',
        shop: 'pending',
        mobile: 'verified',
      },
      isOverallVerified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      responseTimeMinutes: 10,
    };

    setWorkers((prev) => [newWorker, ...prev]);
    return newWorker;
  };

  const markNotificationRead = async (id: string) => {
    if (isBackendConnected) {
      try {
        await markNotificationReadApi(id);
      } catch {
        // ignore
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetDemoData = async () => {
    localStorage.removeItem(STORAGE_KEY);
    if (isBackendConnected) {
      try {
        await resetDemoDataApi();
        await refreshFromBackend();
        return;
      } catch {
        // fallback
      }
    }
    setWorkers(INITIAL_WORKERS);
    setCooperatives(INITIAL_COOPERATIVES);
    setServiceCategories(SERVICE_CATEGORIES);
    setServiceRequests(INITIAL_SERVICE_REQUESTS);
    setReviews(INITIAL_REVIEWS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setWeights(DEFAULT_WEIGHTS);
    setCurrentWorkerId('worker-1');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        currentWorker,
        setCurrentWorkerId,
        workers,
        cooperatives,
        serviceCategories,
        serviceRequests,
        reviews,
        notifications,
        weights,
        setWeights,
        userLocation,
        setUserLocation,
        isBackendConnected,
        backendLoading,
        refreshFromBackend,
        createServiceRequest,
        updateJobStatus,
        submitReview,
        setWorkerAvailability,
        verifyDocument,
        registerWorker,
        markNotificationRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
