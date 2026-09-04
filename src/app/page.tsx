'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { RoleSwitcherBanner } from '@/components/common/RoleSwitcherBanner';
import { LandingHero } from '@/components/home/LandingHero';
import { AIRequestCard } from '@/components/customer/AIRequestCard';
import { NearbyWorkersMap } from '@/components/customer/NearbyWorkersMap';
import { WorkerCard } from '@/components/customer/WorkerCard';
import { CategoryCards } from '@/components/home/CategoryCards';
import { HowItWorks } from '@/components/home/HowItWorks';
import { EmpoweringWorkersSection } from '@/components/home/EmpoweringWorkersSection';
import { EmergencyModal } from '@/components/customer/EmergencyModal';
import { SmartMatchingDrawer } from '@/components/customer/SmartMatchingDrawer';
import { WorkerProfileModal } from '@/components/customer/WorkerProfileModal';
import { CustomerAuthModal } from '@/components/home/CustomerAuthModal';
import { ActiveJobTracker } from '@/components/customer/ActiveJobTracker';
import { WorkerDashboardView } from '@/components/worker/WorkerDashboardView';
import { WorkerRegistrationWizard } from '@/components/worker/WorkerRegistrationWizard';
import { CooperativeDashboardView } from '@/components/cooperative/CooperativeDashboardView';
import { PlatformAdminView } from '@/components/admin/PlatformAdminView';
import { Footer } from '@/components/layout/Footer';
import { rankWorkers } from '@/lib/matchingEngine';
import { Worker, AIServiceAnalysis } from '@/types';
import {
  MapPin,
  Sparkles,
  SlidersHorizontal,
  Map,
  Grid,
  Filter,
  Users,
  Building,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const {
    currentRole,
    currentUser,
    workers,
    userLocation,
    weights,
    serviceRequests,
    reviews,
    createServiceRequest,
    setCurrentRole,
  } = useApp();

  // Modals and Drawers
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showWeightsDrawer, setShowWeightsDrawer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profileWorker, setProfileWorker] = useState<Worker | null>(null);

  // Search & Filter State
  const [targetCategory, setTargetCategory] = useState<string>('Plumbing');
  const [targetSkill, setTargetSkill] = useState<string>('Pipe/Tap Repair');
  const [currentProblem, setCurrentProblem] = useState<string>('Kitchen tap leaking water');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-1');
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'cards'>('split');
  const [workerSubView, setWorkerSubView] = useState<'dashboard' | 'register'>('dashboard');

  // Active customer job (if any currently in-progress)
  const activeCustomerRequest = serviceRequests.find(
    (r) => r.customerId === currentUser.id && r.status !== 'cancelled' && r.status !== 'paid'
  );

  // Ranked workers using configurable weights
  const rankedWorkers = useMemo(() => {
    return rankWorkers(workers, userLocation, targetCategory, targetSkill, weights);
  }, [workers, userLocation, targetCategory, targetSkill, weights]);

  // Handle AI Search submission
  const handleAISearch = (analysis: AIServiceAnalysis, queryText: string) => {
    setTargetCategory(analysis.detectedService);
    setTargetSkill(analysis.requiredSkill);
    setCurrentProblem(analysis.problem);

    // Scroll to workers section
    const el = document.getElementById('ranked-workers-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle requesting a service from a worker
  const handleRequestService = (
    worker: Worker,
    matchScore: number = 92,
    matchReasons: string[] = ['Optimal verified match']
  ) => {
    createServiceRequest({
      category: targetCategory,
      skill: targetSkill,
      problem: currentProblem,
      urgency: 'medium',
      isEmergency: false,
      workerId: worker.id,
      amount: worker.baseChargePerHour ? worker.baseChargePerHour + 150 : 500,
      matchScore,
      matchReasons,
    });

    // Scroll up to active job tracker
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Fixed Navigation & SIH Banner */}
      <Navbar
        onOpenEmergency={() => setShowEmergencyModal(true)}
        onOpenWeightsConfig={() => setShowWeightsDrawer(true)}
      />

      {/* Interactive Role Switcher Banner */}
      <RoleSwitcherBanner onOpenWeightsConfig={() => setShowWeightsDrawer(true)} />

      {/* Main Role-Based Content Area */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. CUSTOMER ROLE VIEW */}
        {/* ========================================================================= */}
        {currentRole === 'customer' && (
          <div className="space-y-12">
            {/* Landing Hero (Only if no active job tracker occupying attention, or at top) */}
            <LandingHero
              onFindService={() => {
                const el = document.getElementById('ai-search-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onJoinAsWorker={() => {
                setCurrentRole('worker');
                setWorkerSubView('register');
              }}
              onOpenEmergency={() => setShowEmergencyModal(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 -mt-10 relative z-20">
              {/* Active Job Tracker (if customer has an active booking) */}
              {activeCustomerRequest && (
                <div id="active-job-anchor" className="animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Live Cooperative Dispatch In Progress
                    </span>
                  </div>
                  <ActiveJobTracker request={activeCustomerRequest} />
                </div>
              )}

              {/* Customer Dashboard Greeting & AI Request Card (Section 6) */}
              <div id="ai-search-anchor" className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      Good morning, {currentUser.name} 👋
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                      <span>Current Location: <strong>{userLocation.address}</strong></span>
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                    Cooperative Network: <strong>Trichy Hub (248 Members)</strong>
                  </div>
                </div>

                <AIRequestCard
                  onSearch={handleAISearch}
                  selectedCategory={targetCategory}
                  onSelectCategory={(cat) => setTargetCategory(cat)}
                />
              </div>

              {/* Nearby Worker Search & Smart Matching Section (Sections 8 & 9) */}
              <div id="ranked-workers-section" className="space-y-6 pt-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">
                        Smart Matching Results
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-coop-100 text-coop-800">
                        Target Trade: {targetCategory}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      Verified Nearby Workers ({rankedWorkers.length} Found)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ranked by multi-factor weighted algorithm (Skill, Distance, Availability, Rating, Verification, Experience).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Switcher: Split / Map / Cards */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                      <button
                        onClick={() => setViewMode('split')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          viewMode === 'split' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Split View
                      </button>
                      <button
                        onClick={() => setViewMode('map')}
                        className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                          viewMode === 'map' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Map className="w-3.5 h-3.5" />
                        <span>Map</span>
                      </button>
                      <button
                        onClick={() => setViewMode('cards')}
                        className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                          viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>Cards</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setShowWeightsDrawer(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Adjust Weights</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Layout based on viewMode */}
                {viewMode === 'split' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Map Column (Sticky on desktop) */}
                    <div className="lg:col-span-6 sticky top-24">
                      <NearbyWorkersMap
                        userLocation={userLocation}
                        workers={workers}
                        selectedWorkerId={selectedWorkerId}
                        onSelectWorker={(w) => {
                          setSelectedWorkerId(w.id);
                          setProfileWorker(w);
                        }}
                      />
                    </div>

                    {/* Workers Cards List */}
                    <div className="lg:col-span-6 space-y-4">
                      {rankedWorkers.slice(0, 6).map((match) => (
                        <WorkerCard
                          key={match.workerId}
                          match={match}
                          isSelected={match.workerId === selectedWorkerId}
                          onRequestService={(worker, score, reasons) => {
                            setSelectedWorkerId(worker.id);
                            handleRequestService(worker, score, reasons);
                          }}
                          onViewProfile={(worker) => setProfileWorker(worker)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {viewMode === 'map' && (
                  <div className="space-y-4">
                    <NearbyWorkersMap
                      userLocation={userLocation}
                      workers={workers}
                      selectedWorkerId={selectedWorkerId}
                      onSelectWorker={(w) => {
                        setSelectedWorkerId(w.id);
                        setProfileWorker(w);
                      }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rankedWorkers.slice(0, 3).map((match) => (
                        <WorkerCard
                          key={match.workerId}
                          match={match}
                          isSelected={match.workerId === selectedWorkerId}
                          onRequestService={(worker, score, reasons) =>
                            handleRequestService(worker, score, reasons)
                          }
                          onViewProfile={(worker) => setProfileWorker(worker)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {viewMode === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rankedWorkers.map((match) => (
                      <WorkerCard
                        key={match.workerId}
                        match={match}
                        isSelected={match.workerId === selectedWorkerId}
                        onRequestService={(worker, score, reasons) =>
                          handleRequestService(worker, score, reasons)
                        }
                        onViewProfile={(worker) => setProfileWorker(worker)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Service Categories Catalog (Section 17) */}
              <div className="pt-8 border-t border-slate-200">
                <CategoryCards
                  selectedCategory={targetCategory}
                  onSelectCategory={(catName) => {
                    setTargetCategory(catName);
                    const el = document.getElementById('ranked-workers-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>

              {/* How It Works (Section 4) */}
              <div className="pt-4">
                <HowItWorks />
              </div>

              {/* Empowering Workers Section (Section 4 & 25) */}
              <div className="pt-4 pb-8">
                <EmpoweringWorkersSection
                  onJoinAsWorker={() => {
                    setCurrentRole('worker');
                    setWorkerSubView('register');
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. WORKER ROLE VIEW */}
        {/* ========================================================================= */}
        {currentRole === 'worker' && (
          <div className="space-y-6">
            {/* Worker sub-navigation */}
            <div className="bg-slate-100 border-b border-slate-200 py-3 px-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWorkerSubView('dashboard')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      workerSubView === 'dashboard'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Worker Duty Dashboard
                  </button>
                  <button
                    onClick={() => setWorkerSubView('register')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      workerSubView === 'register'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    5-Step Onboarding Wizard
                  </button>
                </div>

                <div className="text-xs text-slate-500 hidden sm:block">
                  Current Worker Persona: <strong>Arun Kumar (Plumber)</strong>
                </div>
              </div>
            </div>

            {workerSubView === 'dashboard' ? (
              <WorkerDashboardView />
            ) : (
              <WorkerRegistrationWizard onComplete={() => setWorkerSubView('dashboard')} />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. COOPERATIVE ADMIN ROLE VIEW */}
        {/* ========================================================================= */}
        {currentRole === 'cooperative_admin' && (
          <div>
            <CooperativeDashboardView />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PLATFORM ADMIN ROLE VIEW */}
        {/* ========================================================================= */}
        {currentRole === 'platform_admin' && (
          <div>
            <PlatformAdminView />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onSelectWorker={(w, type) => {
          setSelectedWorkerId(w.id);
          setShowEmergencyModal(false);
        }}
      />

      <SmartMatchingDrawer
        isOpen={showWeightsDrawer}
        onClose={() => setShowWeightsDrawer(false)}
      />

      <WorkerProfileModal
        worker={profileWorker}
        reviews={reviews}
        onClose={() => setProfileWorker(null)}
        onRequestService={(w) => {
          setProfileWorker(null);
          handleRequestService(w);
        }}
      />

      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
