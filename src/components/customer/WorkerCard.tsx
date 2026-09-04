'use client';

import React, { useState } from 'react';
import { Worker, SmartMatchScore } from '@/types';
import {
  Star,
  MapPin,
  ShieldCheck,
  Phone,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Building,
  CheckCircle2,
} from 'lucide-react';

interface WorkerCardProps {
  match: SmartMatchScore;
  onRequestService: (worker: Worker, matchScore: number, matchReasons: string[]) => void;
  onViewProfile: (worker: Worker) => void;
  isSelected?: boolean;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  match,
  onRequestService,
  onViewProfile,
  isSelected,
}) => {
  const { worker, overallScore, distanceKm, breakdown, reasons } = match;
  const [showReasons, setShowReasons] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCall = () => {
    navigator.clipboard.writeText(worker.mobile);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const isAvailable = worker.availability === 'available';
  const isBusy = worker.availability === 'busy';

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all p-5 shadow-sm hover:shadow-xl relative overflow-hidden ${
        isSelected
          ? 'border-saffron-500 ring-2 ring-saffron-200 shadow-md'
          : 'border-slate-200/90 hover:border-saffron-300'
      }`}
    >
      {/* Top Banner / Match Pill */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isAvailable ? 'bg-emerald-500' : isBusy ? 'bg-amber-500' : 'bg-slate-400'
              }`}
              title={`Status: ${worker.availability}`}
            ></span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight hover:text-saffron-700 cursor-pointer" onClick={() => onViewProfile(worker)}>
                {worker.name}
              </h3>
              {worker.isOverallVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-coop-800 bg-coop-50 px-2 py-0.5 rounded-full border border-coop-200" title="Cooperative Verified Member">
                  <ShieldCheck className="w-3.5 h-3.5 text-coop-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
              {worker.headline}
            </p>

            <div className="flex items-center gap-3 mt-1 text-xs">
              <div className="flex items-center gap-1 font-extrabold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{worker.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({worker.completedJobsCount} jobs)</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 font-semibold text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                <span>{distanceKm} km away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className="text-right shrink-0">
          <div className="inline-flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Match Score
            </span>
            <div className="flex items-center gap-1 bg-gradient-to-r from-saffron-500 to-amber-500 text-white font-black text-sm px-2.5 py-0.5 rounded-lg shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{overallScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cooperative Affiliation */}
      <div className="mb-3 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Building className="w-3.5 h-3.5 text-coop-600 shrink-0" />
          <span className="font-semibold truncate max-w-[220px]" title={worker.cooperativeName}>
            {worker.cooperativeName}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Resp: <strong>~{worker.responseTimeMinutes}m</strong>
        </span>
      </div>

      {/* Skills Chips */}
      <div className="mb-3 flex items-center flex-wrap gap-1.5">
        {worker.skills.slice(0, 4).map((skill, idx) => (
          <span
            key={idx}
            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
          >
            {skill}
          </span>
        ))}
        {worker.skills.length > 4 && (
          <span className="text-[10px] text-slate-500 self-center">
            +{worker.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Verification Check Badges */}
      <div className="mb-4 grid grid-cols-3 gap-1.5 text-[11px] text-slate-600 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1 text-coop-800 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-coop-600" />
          <span>ID Verified</span>
        </div>
        <div className="flex items-center gap-1 text-coop-800 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-coop-600" />
          <span>Skill Verified</span>
        </div>
        <div className="flex items-center gap-1 font-medium">
          {worker.verifications.shop === 'verified' ? (
            <span className="flex items-center gap-1 text-coop-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-coop-600" />
              <span>Shop Verified</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Indep. Worker</span>
            </span>
          )}
        </div>
      </div>

      {/* Expandable "Why this worker?" section */}
      <div className="mb-4 border-t border-slate-100 pt-2">
        <button
          onClick={() => setShowReasons(!showReasons)}
          className="w-full flex items-center justify-between text-xs text-saffron-700 font-semibold hover:text-saffron-800 transition"
        >
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            <span>Why this worker? ({reasons.length} factors)</span>
          </span>
          {showReasons ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showReasons && (
          <div className="mt-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1.5 animate-in fade-in">
            <div className="grid grid-cols-3 gap-2 pb-2 mb-2 border-b border-amber-200/50 text-[10px] text-amber-900 font-medium">
              <div>Skill Match: <strong>{breakdown.skillMatch}/30</strong></div>
              <div>Distance: <strong>{breakdown.distanceMatch}/25</strong></div>
              <div>Availability: <strong>{breakdown.availabilityMatch}/15</strong></div>
            </div>
            {reasons.map((r, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="grid grid-cols-12 gap-2 pt-2">
        <button
          onClick={() => onRequestService(worker, overallScore, reasons)}
          className="col-span-6 px-3 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-saffron-500/20 transition flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Request Service</span>
        </button>

        <button
          onClick={handleCall}
          className="col-span-3 px-2 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1"
          title={`Call ${worker.mobile}`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>{copiedPhone ? 'Copied!' : 'Call'}</span>
        </button>

        <button
          onClick={() => onViewProfile(worker)}
          className="col-span-3 px-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center"
        >
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};
