'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ServiceRequest, JobStatus } from '@/types';
import {
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  CreditCard,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  AlertCircle,
  QrCode,
  DollarSign,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveJobTrackerProps {
  request: ServiceRequest;
}

export const ActiveJobTracker: React.FC<ActiveJobTrackerProps> = ({ request }) => {
  const { updateJobStatus, submitReview, setCurrentRole } = useApp();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'Cash' | 'CoopWallet'>('UPI');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const steps: { key: JobStatus; label: string; desc: string }[] = [
    { key: 'requested', label: 'Requested', desc: 'Job dispatched to worker' },
    { key: 'accepted', label: 'Accepted', desc: 'Worker accepted and preparing tools' },
    { key: 'navigating', label: 'En Route', desc: 'Worker on the way to location' },
    { key: 'arrived', label: 'Arrived', desc: 'Worker at doorstep' },
    { key: 'in_progress', label: 'In Progress', desc: 'Work underway' },
    { key: 'completed', label: 'Work Done', desc: 'Work completed, bill generated' },
    { key: 'paid', label: 'Paid & Closed', desc: 'Payment received, reviewed' },
  ];

  const getStepIndex = (status: JobStatus) => {
    return steps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(request.status);

  const handlePay = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    updateJobStatus(request.id, 'paid', { paymentMethod: selectedPaymentMethod });
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(request.id, rating, reviewText || 'Prompt service, highly skilled and cooperative.');
    setReviewSubmitted(true);
  };

  const breakdown = request.paymentBreakdown || {
    totalAmount: request.amount,
    workerEarnings: Math.round(request.amount * 0.85),
    cooperativeContribution: Math.round(request.amount * 0.10),
    platformFee: Math.round(request.amount * 0.05),
    workerPercentage: 85,
    cooperativePercentage: 10,
    platformPercentage: 5,
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-900">
              Active Job • #{request.id}
            </span>
            {request.isEmergency && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                🚨 Emergency Dispatch
              </span>
            )}
          </div>
          <h3 className="text-xl font-black mt-1">
            {request.serviceCategory} — {request.requiredSkill}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-saffron-400" />
            <span>{request.location.address}</span>
          </p>
        </div>

        {/* Assigned Worker Quick Card */}
        {request.assignedWorker && (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <img
              src={request.assignedWorker.avatar}
              alt={request.assignedWorker.name}
              className="w-12 h-12 rounded-xl object-cover border border-white/20"
            />
            <div className="text-xs">
              <div className="font-bold text-white flex items-center gap-1">
                <span>{request.assignedWorker.name}</span>
                <span className="text-amber-400">⭐ {request.assignedWorker.rating.toFixed(1)}</span>
              </div>
              <div className="text-slate-300 text-[11px]">{request.assignedWorker.headline}</div>
              <div className="text-emerald-400 font-semibold text-[11px] mt-0.5">
                📞 {request.assignedWorker.mobile}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Timeline Stepper */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {steps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-saffron-50 border-saffron-400 shadow-xs'
                      : isPast
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-white border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-saffron-600 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                        {idx + 1}
                      </div>
                    )}
                    <span
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-saffron-800' : isPast ? 'text-emerald-800' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Status Action Body */}
      <div className="p-6 md:p-8">
        {/* State: Requested / Waiting */}
        {request.status === 'requested' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Waiting for Worker Confirmation
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              A dispatch notification has been sent to{' '}
              <strong>{request.assignedWorker?.name || 'the nearby cooperative worker'}</strong>.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentRole('worker')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
              >
                Switch to Worker View to Accept Job Now
              </button>
            </div>
          </div>
        )}

        {/* State: Accepted / Navigating */}
        {(request.status === 'accepted' || request.status === 'navigating') && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                ETA
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {request.assignedWorker?.name} is on the way!
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Simulated ETA: <strong>~7 minutes</strong> • Preparing service tools.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentRole('worker')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Control in Worker View
              </button>
            </div>
          </div>
        )}

        {/* State: Arrived (Security OTP) */}
        {request.status === 'arrived' && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Security Handshake
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                Worker has arrived at your doorstep!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Share this secure 4-digit verification code with {request.assignedWorker?.name} to commence the job:
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white border-2 border-amber-400 rounded-2xl px-5 py-2 text-2xl font-black tracking-widest text-slate-900 shadow-sm">
                {request.verificationOtp || '7412'}
              </div>
              <button
                onClick={() => setCurrentRole('worker')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Verify in Worker View
              </button>
            </div>
          </div>
        )}

        {/* State: In Progress */}
        {request.status === 'in_progress' && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                🛠️
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Work in Progress</h4>
                <p className="text-xs text-slate-600">
                  {request.assignedWorker?.name} is actively working on: {request.requiredSkill}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentRole('worker')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Complete in Worker View
            </button>
          </div>
        )}

        {/* State: Completed -> Transparent Payment Stage */}
        {request.status === 'completed' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                Work Completed Successfully
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-2">
                Transparent Cooperative Invoice
              </h4>
              <p className="text-xs text-slate-600">
                Review the transparent breakdown as per Ministry of Cooperation fair-work standards.
              </p>
            </div>

            {/* Transparent Fee Breakdown Card (Section 14) */}
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-sm text-slate-800">Total Customer Charge</span>
                <span className="font-black text-xl text-slate-900">₹{breakdown.totalAmount}</span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Worker Direct Take-Home ({breakdown.workerPercentage}%)</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{breakdown.workerEarnings}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-saffron-500"></span>
                    <span>Cooperative Welfare Fund Contribution ({breakdown.cooperativePercentage}%)</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{breakdown.cooperativeContribution}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>Platform Infrastructure Fee ({breakdown.platformPercentage}%)</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{breakdown.platformFee}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 italic">
                * Zero hidden commissions. 100% of the Cooperative Welfare Fund goes toward worker health insurance, tool subsidies, and year-end cooperative dividends.
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="max-w-xl mx-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Payment Mode:
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                    selectedPaymentMethod === 'UPI'
                      ? 'border-saffron-500 bg-saffron-50/50 text-saffron-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-saffron-600" />
                  <span>UPI / QR Scan</span>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod('Cash')}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                    selectedPaymentMethod === 'Cash'
                      ? 'border-saffron-500 bg-saffron-50/50 text-saffron-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Direct Cash</span>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod('CoopWallet')}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                    selectedPaymentMethod === 'CoopWallet'
                      ? 'border-saffron-500 bg-saffron-50/50 text-saffron-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Coop Wallet</span>
                </button>
              </div>

              <button
                onClick={handlePay}
                className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Pay ₹{breakdown.totalAmount}</span>
              </button>
            </div>
          </div>
        )}

        {/* State: Paid -> Customer Review Stage */}
        {request.status === 'paid' && (
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black text-slate-900">
              Payment Completed!
            </h4>
            <p className="text-xs text-slate-600">
              Paid ₹{breakdown.totalAmount} via {request.paymentMethod || 'UPI'}.
            </p>

            {reviewSubmitted || request.rating ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (request.rating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Thank you for rating {request.assignedWorker?.name}!
                </div>
                <p className="text-xs text-slate-600 mt-1 italic">
                  &quot;{request.reviewText || reviewText}&quot;
                </p>
                <span className="text-[10px] text-coop-700 font-semibold block mt-2">
                  ✓ Review added to Cooperative Worker Profile
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitRating}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3"
              >
                <div className="text-xs font-bold text-slate-800">
                  Rate {request.assignedWorker?.name} & Cooperative Service:
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 ml-2">{rating}.0 / 5.0</span>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share a short review about quality, punctuality, and professionalism..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-saffron-400 outline-none"
                  rows={2}
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md shadow-saffron-500/20 transition"
                >
                  Submit Cooperative Review
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
