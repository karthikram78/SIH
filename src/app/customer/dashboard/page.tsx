'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { AIRequestCard } from '@/components/customer/AIRequestCard';
import { WorkerCard } from '@/components/customer/WorkerCard';
import { EmergencyModal } from '@/components/customer/EmergencyModal';
import { WorkerProfileModal } from '@/components/customer/WorkerProfileModal';
import { rankWorkers } from '@/lib/matchingEngine';
import { Worker, AIServiceAnalysis } from '@/types';
import {
  MapPin,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Wrench,
  Search,
  CreditCard,
  Star,
  Users,
  AlertCircle,
  TrendingUp,
  Radio,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    userLocation,
    workers,
    weights,
    serviceRequests,
    serviceCategories,
    createServiceRequest,
    isLiveLocationActive,
    startLiveTracking,
    stopLiveTracking,
    reviews,
  } = useApp();
  const { t } = useLanguage();

  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [profileWorker, setProfileWorker] = useState<Worker | null>(null);

  // Search & Filter State
  const [targetCategory, setTargetCategory] = useState<string>('Plumbing');
  const [targetSkill, setTargetSkill] = useState<string>('Pipe/Tap Repair');
  const [currentProblem, setCurrentProblem] = useState<string>('Kitchen tap leaking water');

  // Active bookings for this customer
  const activeBookings = useMemo(() => {
    return serviceRequests.filter(
      (r) => r.customerId === currentUser.id && r.status !== 'cancelled' && r.status !== 'paid'
    );
  }, [serviceRequests, currentUser.id]);

  const recentBookings = useMemo(() => {
    return serviceRequests
      .filter((r) => r.customerId === currentUser.id)
      .slice(0, 4);
  }, [serviceRequests, currentUser.id]);

  // Ranked nearby workers
  const rankedWorkers = useMemo(() => {
    return rankWorkers(workers, userLocation, targetCategory, targetSkill, weights).slice(0, 4);
  }, [workers, userLocation, targetCategory, targetSkill, weights]);

  const handleAISearch = (analysis: AIServiceAnalysis) => {
    setTargetCategory(analysis.detectedService);
    setTargetSkill(analysis.requiredSkill);
    setCurrentProblem(analysis.problem);
  };

  const handleRequestService = async (worker: Worker, matchScore: number = 92) => {
    const req = await createServiceRequest({
      category: targetCategory,
      skill: targetSkill,
      problem: currentProblem,
      urgency: 'medium',
      workerId: worker.id,
      amount: worker.baseChargePerHour,
      matchScore,
      matchReasons: [
        'Matches requested skill profile',
        `Proximity to ${userLocation.city}`,
        'Cooperative verified status',
      ],
    });
    router.push(`/customer/bookings/${req.id}`);
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar onOpenEmergency={() => setShowEmergencyModal(true)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome & Location Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customer Service Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">
                Vanakkam, {currentUser.name || 'Priya Sharma'}!
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Current Location: <strong>{userLocation.address}</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={isLiveLocationActive ? stopLiveTracking : startLiveTracking}
                className={`flex-1 md:flex-initial px-4 py-3 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  isLiveLocationActive
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                <Radio className={`w-4 h-4 ${isLiveLocationActive ? 'animate-ping text-white' : 'text-emerald-400'}`} />
                <span>{isLiveLocationActive ? 'Live GPS Active' : 'Enable Live GPS'}</span>
              </button>

              <button
                onClick={() => setShowEmergencyModal(true)}
                className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>🚨 Need Help Now</span>
              </button>

              <Link
                href="/customer/nearby-workers"
                className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Nearby Workers Map</span>
              </Link>
            </div>
          </div>

          {/* Active Bookings Alert (If Any) */}
          {activeBookings.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Active Service in Progress ({activeBookings.length})</span>
                </div>
                <Link
                  href="/customer/bookings"
                  className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
                >
                  <span>View All Bookings</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{b.category}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{b.problem}</p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Assigned Worker: <strong>{b.workerName}</strong> • OTP: <strong className="text-emerald-700">{b.verificationOtp}</strong>
                      </div>
                    </div>

                    <Link
                      href={`/customer/bookings/${b.id}`}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shrink-0"
                    >
                      Track Job
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI NLP Natural Language Search Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">What service do you need?</h2>
                <p className="text-xs text-slate-500">Ask in plain English or Tamil. Our AI maps your problem to verified skills.</p>
              </div>
              <Link
                href="/customer/request-service"
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
              >
                <span>Full Request Wizard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <AIRequestCard
              onSearch={handleAISearch}
            />
          </div>

          {/* Popular Services Quick Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Popular Community Services</h2>
              <Link href="/services" className="text-xs font-bold text-amber-700 hover:underline">
                View All Categories →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {serviceCategories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setTargetCategory(cat.name);
                    setTargetSkill(cat.skills[0] || cat.name);
                    setCurrentProblem(`Service needed for ${cat.name}`);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 group ${
                    targetCategory === cat.name
                      ? 'bg-amber-50 border-amber-400 shadow-md'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium">₹{cat.basePrice} base</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nearby Ranked Workers Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Recommended {targetCategory} Artisans Near You
                </h2>
                <p className="text-xs text-slate-500">
                  Ranked by 6-factor Smart Matching (Skill, Proximity, Availability, Rating, Verification, Experience)
                </p>
              </div>

              <Link
                href="/customer/nearby-workers"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
              >
                <span>Full Map View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rankedWorkers.map((match) => (
                <WorkerCard
                  key={match.worker.id}
                  match={match}
                  isSelected={false}
                  onViewProfile={(w) => setProfileWorker(w)}
                  onRequestService={(w, score) => handleRequestService(w, score)}
                />
              ))}
            </div>
          </div>

          {/* Quick Dashboard Links Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <Link
              href="/customer/bookings"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">My Service History</h4>
                <p className="text-xs text-slate-500">Track all requests & receipts</p>
              </div>
            </Link>

            <Link
              href="/customer/payments"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Payments & Invoices</h4>
                <p className="text-xs text-slate-500">Transparent 85-10-5 split records</p>
              </div>
            </Link>

            <Link
              href="/customer/reviews"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Rate & Review Artisans</h4>
                <p className="text-xs text-slate-500">Support your local cooperative</p>
              </div>
            </Link>
          </div>
        </main>

        {/* Emergency Modal */}
        {showEmergencyModal && (
          <EmergencyModal
            isOpen={showEmergencyModal}
            onClose={() => setShowEmergencyModal(false)}
            onSelectWorker={async (worker: Worker, emergencyType: string) => {
              setShowEmergencyModal(false);
              await createServiceRequest({
                category: emergencyType,
                skill: worker.skills[0] || emergencyType,
                problem: `URGENT EMERGENCY: ${emergencyType}`,
                urgency: 'emergency',
                isEmergency: true,
                workerId: worker.id,
                amount: 450,
                matchScore: 98,
                matchReasons: ['Emergency priority dispatch', 'Nearest verified available artisan'],
              });
              router.push('/customer/bookings');
            }}
          />
        )}

        {/* Worker Profile Modal */}
        {profileWorker && (
          <WorkerProfileModal
            worker={profileWorker}
            reviews={reviews}
            onClose={() => setProfileWorker(null)}
            onRequestService={(w) => {
              setProfileWorker(null);
              handleRequestService(w, 95);
            }}
          />
        )}

        <Footer />
      </div>
    </RoleGuard>
  );
}
