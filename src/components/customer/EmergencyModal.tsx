'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  X,
  Car,
  CircleDot,
  Zap,
  Wrench,
  Lock,
  MapPin,
  ArrowRight,
  Clock,
  PhoneCall,
} from 'lucide-react';
import { rankWorkers } from '@/lib/matchingEngine';
import { Worker, SmartMatchScore } from '@/types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorker: (worker: Worker, emergencyType: string) => void;
}

interface EmergencyOption {
  id: string;
  title: string;
  category: string;
  skill: string;
  description: string;
  icon: React.ReactNode;
  estTime: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onSelectWorker,
}) => {
  const { workers, userLocation, createServiceRequest, setCurrentRole } = useApp();
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyOption | null>(null);
  const [rankedResults, setRankedResults] = useState<SmartMatchScore[]>([]);
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchedWorker, setDispatchedWorker] = useState<Worker | null>(null);

  if (!isOpen) return null;

  const emergencyOptions: EmergencyOption[] = [
    {
      id: 'puncture',
      title: 'Roadside Puncture / Flat Tyre',
      category: 'Puncture & Tyres',
      skill: 'Tubeless Puncture Fix',
      description: 'Stranded on road or highway, rapid mobile puncture technician',
      icon: <CircleDot className="w-6 h-6 text-rose-600" />,
      estTime: '8-15 mins',
    },
    {
      id: 'breakdown',
      title: 'Vehicle Breakdown / Engine Off',
      category: 'Mechanic & Vehicle Repair',
      skill: 'Bike Breakdown Help',
      description: 'Two-wheeler or car stalled, jumpstart, belt or brake failure',
      icon: <Car className="w-6 h-6 text-rose-600" />,
      estTime: '10-20 mins',
    },
    {
      id: 'electrical',
      title: 'Electrical Short Circuit / Spark',
      category: 'Electrical',
      skill: 'Wiring Repair',
      description: 'Dangerous sparks, burning smell, total phase blackout, fuse blown',
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      estTime: '10-15 mins',
    },
    {
      id: 'water_burst',
      title: 'Severe Water Leakage / Pipe Burst',
      category: 'Plumbing',
      skill: 'Pipe Repair',
      description: 'Gushing pipe burst, overhead tank valve leak, flooding room',
      icon: <Wrench className="w-6 h-6 text-blue-600" />,
      estTime: '12-18 mins',
    },
    {
      id: 'lock_jammed',
      title: 'Locked Out / Jammed Lock',
      category: 'Carpenter',
      skill: 'Lock Fitting',
      description: 'Cannot enter home, broken key stuck in lock cylinder',
      icon: <Lock className="w-6 h-6 text-purple-600" />,
      estTime: '15-25 mins',
    },
  ];

  const handleSelectOption = (opt: EmergencyOption) => {
    setSelectedEmergency(opt);
    // Rank workers for this emergency
    const ranked = rankWorkers(workers, userLocation, opt.category, opt.skill);
    // Prioritize available workers
    const availableFirst = ranked.filter((r) => r.worker.availability === 'available');
    setRankedResults(availableFirst.length > 0 ? availableFirst : ranked);
  };

  const handleInstantDispatch = (worker: Worker) => {
    if (!selectedEmergency) return;
    setDispatchedWorker(worker);
    setIsDispatched(true);

    // Create immediate emergency service request
    createServiceRequest({
      category: selectedEmergency.category,
      skill: selectedEmergency.skill,
      problem: `EMERGENCY: ${selectedEmergency.title} - ${selectedEmergency.description}`,
      urgency: 'emergency',
      isEmergency: true,
      workerId: worker.id,
      amount: 450,
      matchScore: 98,
      matchReasons: [
        'Closest available emergency responder',
        `${worker.responseTimeMinutes} min fast response track record`,
        'Cooperative vetted technician',
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-rose-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-200">
                Avadi Connect SOS Dispatch
              </span>
              <h3 className="text-2xl font-black">🚨 Need Help Now — Emergency Protocol</h3>
            </div>
          </div>
          <p className="text-xs text-rose-100 mt-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>
              GPS Detected: <strong>{userLocation.address}</strong> (Search radius: 10km)
            </span>
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isDispatched && dispatchedWorker ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <PhoneCall className="w-8 h-8" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider mb-2">
                Emergency Alert Transmitted
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900">
                {dispatchedWorker.name} has been Alerted!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                Estimated arrival: <strong className="text-slate-900">{dispatchedWorker.responseTimeMinutes + 5} minutes</strong>.
                The worker is on standby and has received your exact GPS location.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto flex items-center gap-4">
                <img
                  src={dispatchedWorker.avatar}
                  alt={dispatchedWorker.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{dispatchedWorker.name}</div>
                  <div className="text-xs text-slate-500">{dispatchedWorker.headline}</div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    📞 Direct Hotline: {dispatchedWorker.mobile}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    setCurrentRole('worker'); // Allow instant switch to worker to accept!
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
                >
                  Switch to Worker View to Accept Job
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  Keep Tracking on Map
                </button>
              </div>
            </div>
          ) : !selectedEmergency ? (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                1. Select the Emergency Situation:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 text-left transition-all group flex items-start gap-3 shadow-xs hover:shadow-md"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-white group-hover:shadow-sm shrink-0">
                      {opt.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 group-hover:text-rose-700">
                        {opt.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {opt.description}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                        <Clock className="w-3 h-3" />
                        <span>Avg response: {opt.estTime}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedEmergency(null)}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    ← Change Emergency
                  </button>
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-sm text-slate-800">
                    {selectedEmergency.title}
                  </span>
                </div>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {rankedResults.length} Available Technicians Found
                </span>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Top Nearest Verified Responders:
              </h4>

              <div className="space-y-3">
                {rankedResults.slice(0, 3).map((match, idx) => (
                  <div
                    key={match.workerId}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                      idx === 0
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={match.worker.avatar}
                        alt={match.worker.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {match.worker.name}
                          </span>
                          <span className="text-xs font-bold text-amber-600">
                            ⭐ {match.worker.rating.toFixed(1)}
                          </span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-600 text-white">
                              Fastest Match
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          📍 {match.distanceKm} km away • ETA ~{match.worker.responseTimeMinutes + 4} mins
                        </div>
                        <div className="text-[11px] text-coop-700 font-semibold mt-0.5">
                          ✓ {match.worker.cooperativeName}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInstantDispatch(match.worker)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition hover:scale-105 active:scale-95"
                    >
                      <span>Instant Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
