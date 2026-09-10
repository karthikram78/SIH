'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { NearbyWorkersMap } from '@/components/customer/NearbyWorkersMap';
import { WorkerProfileModal } from '@/components/customer/WorkerProfileModal';
import { WorkerCard } from '@/components/customer/WorkerCard';
import { rankWorkers } from '@/lib/matchingEngine';
import { Worker } from '@/types';
import {
  MapPin,
  Filter,
  SlidersHorizontal,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export default function NearbyWorkersPage() {
  const router = useRouter();
  const {
    workers,
    userLocation,
    serviceCategories,
    weights,
    createServiceRequest,
    isLiveLocationActive,
    startLiveTracking,
    stopLiveTracking,
    reviews,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || 'worker-1');
  const [profileWorker, setProfileWorker] = useState<Worker | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10);

  // Ranked workers
  const rankedWorkers = useMemo(() => {
    const list = rankWorkers(
      workers,
      userLocation,
      selectedCategory === 'All' ? 'Plumbing' : selectedCategory,
      undefined,
      weights
    );

    if (selectedCategory === 'All') return list;
    return list.filter((m) => m.worker.primaryCategory.toLowerCase() === selectedCategory.toLowerCase());
  }, [workers, userLocation, selectedCategory, weights]);

  const handleRequestService = async (worker: Worker, matchScore: number = 92) => {
    const req = await createServiceRequest({
      category: worker.primaryCategory,
      skill: worker.skills[0] || worker.primaryCategory,
      problem: `Requested verified service from ${worker.name}`,
      urgency: 'medium',
      workerId: worker.id,
      amount: worker.baseChargePerHour,
      matchScore,
      matchReasons: ['Selected from nearby map', '4-point cooperative verified'],
    });
    router.push(`/customer/bookings/${req.id}`);
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Nearby Verified Workers Radar
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Visualizing cooperative-verified artisans within your service radius in {userLocation.city}.
              </p>
            </div>

            {/* Live GPS Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={isLiveLocationActive ? stopLiveTracking : startLiveTracking}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                  isLiveLocationActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isLiveLocationActive ? 'animate-ping text-emerald-600' : 'text-slate-400'}`} />
                <span>{isLiveLocationActive ? 'Live GPS Active' : 'Enable Live GPS'}</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === 'All' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Trades ({workers.length})
              </button>
              {serviceCategories.slice(0, 7).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === c.name ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Found <strong className="text-slate-900">{rankedWorkers.length}</strong> verified artisans
            </div>
          </div>

          {/* Interactive Map & Side List Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Container (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2 min-h-[500px]">
              <NearbyWorkersMap
                workers={workers}
                userLocation={userLocation}
                selectedWorkerId={selectedWorkerId}
                onSelectWorker={(w) => setSelectedWorkerId(w.id)}
              />
            </div>

            {/* Worker Cards Column (5 cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {rankedWorkers.map((match) => (
                <WorkerCard
                  key={match.worker.id}
                  match={match}
                  isSelected={selectedWorkerId === match.worker.id}
                  onViewProfile={(w) => setProfileWorker(w)}
                  onRequestService={(w, score) => handleRequestService(w, score)}
                />
              ))}

              {rankedWorkers.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No workers available for this trade</p>
                  <p className="text-[11px] text-slate-500">Try selecting &quot;All Trades&quot; or expanding your search zone.</p>
                </div>
              )}
            </div>
          </div>
        </main>

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
