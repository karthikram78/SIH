'use client';

import React from 'react';
import { Worker, RatingReview } from '@/types';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  Briefcase,
  Phone,
  Lock,
  Award,
  Calendar,
} from 'lucide-react';

interface WorkerProfileModalProps {
  worker: Worker | null;
  reviews: RatingReview[];
  onClose: () => void;
  onRequestService: (worker: Worker) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  reviews,
  onClose,
  onRequestService,
}) => {
  if (!worker) return null;

  const workerReviews = reviews.filter((r) => r.workerId === worker.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
            />
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h3 className="text-2xl font-black">{worker.name}</h3>
                {worker.isOverallVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-coop-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Cooperative Member</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">{worker.headline}</p>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{worker.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({worker.completedJobsCount} jobs)</span>
                </div>
                <span className="text-slate-500">•</span>
                <div className="flex items-center gap-1 text-slate-300">
                  <Briefcase className="w-3.5 h-3.5 text-saffron-400" />
                  <span>{worker.experienceYears} Years Exp</span>
                </div>
                <span className="text-slate-500">•</span>
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Avg Resp: {worker.responseTimeMinutes}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Cooperative Affiliation Card */}
          <div className="p-4 rounded-2xl bg-coop-50/70 border border-coop-200 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-coop-600 text-white shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-coop-700">
                Cooperative Society Affiliation
              </span>
              <h4 className="font-bold text-sm text-slate-900">{worker.cooperativeName}</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Registered member since {worker.joinedDate}. Covered under cooperative welfare fund, fair-pricing guarantee & dispute resolution board.
              </p>
            </div>
          </div>

          {/* About Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Professional Background
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {worker.bio}
            </p>
          </div>

          {/* Skills & Services Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Trade Skills & Specializations
            </h4>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-saffron-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Verification Badges Grid (Strictly no sensitive numbers exposed) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Verification Credentials</span>
              <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Identity data protected & redacted</span>
              </span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <CheckCircle2 className="w-5 h-5 text-coop-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">Govt Identity</div>
                <div className="text-[10px] text-coop-700 font-semibold">Verified ✓</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <CheckCircle2 className="w-5 h-5 text-coop-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">Trade Skill/ITI</div>
                <div className="text-[10px] text-coop-700 font-semibold">Verified ✓</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                {worker.verifications.shop === 'verified' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-coop-600 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-800">Shop / Workshop</div>
                    <div className="text-[10px] text-coop-700 font-semibold">Verified ✓</div>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-800">Shop / Workshop</div>
                    <div className="text-[10px] text-amber-700 font-semibold">Independent</div>
                  </>
                )}
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <CheckCircle2 className="w-5 h-5 text-coop-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">Mobile OTP</div>
                <div className="text-[10px] text-coop-700 font-semibold">Verified ✓</div>
              </div>
            </div>
          </div>

          {/* Shop / Workplace details if available */}
          {worker.shop && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Registered Workshop / Shop
              </h4>
              <div className="flex items-center gap-4">
                <img
                  src={worker.shop.photoUrl}
                  alt={worker.shop.name}
                  className="w-20 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{worker.shop.name}</div>
                  <div className="text-xs text-slate-600">{worker.shop.address}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Operating since {worker.shop.establishedYear} • Municipal License Audited
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Customer Reviews ({workerReviews.length})
            </h4>
            {workerReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                No public reviews yet for this worker.
              </p>
            ) : (
              <div className="space-y-2.5">
                {workerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{rev.customerName}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600">{rev.reviewText}</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(rev.createdAt).toLocaleDateString()} • {rev.serviceCategory}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-slate-500">Base Service Charge:</span>{' '}
            <strong className="text-slate-900 text-sm">₹{worker.baseChargePerHour}/hr</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestService(worker);
              }}
              className="px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-500/20 transition flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Request Service</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
