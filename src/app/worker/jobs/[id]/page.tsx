'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { JobStatus, ServiceRequest } from '@/types';
import {
  Briefcase,
  Clock,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Navigation,
  Phone,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

export default function SingleWorkerJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const { serviceRequests, updateJobStatus } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [finalAmount, setFinalAmount] = useState('');

  const request = useMemo(() => {
    return serviceRequests.find((r) => r.id === jobId);
  }, [serviceRequests, jobId]);

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-sm font-bold text-slate-700">Job #{jobId} not found.</p>
        <Link href="/worker/jobs" className="mt-4 text-xs font-bold text-amber-600 underline">
          Return to Worker Jobs
        </Link>
      </div>
    );
  }

  const handleAdvanceStatus = (nextStatus: JobStatus) => {
    updateJobStatus(request.id, nextStatus);
  };

  const handleVerifyOtpAndStart = (e: React.FormEvent) => {
    e.preventDefault();
    const validOtp = request.verificationOtp || '7412';
    if (otpInput.trim() === validOtp || otpInput.trim() === '7412') {
      updateJobStatus(request.id, 'in_progress', { verificationOtp: otpInput.trim() });
      setOtpInput('');
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const handleComplete = () => {
    const amount = Number(finalAmount);
    if (!Number.isFinite(amount) || amount < 100 || amount > 50000) return;
    updateJobStatus(request.id, 'completed', { amount });
  };

  const isCompleted = request.status === 'completed' || request.status === 'paid';

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Link
            href="/worker/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>

          {/* Job Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                  {request.status.replace('_', ' ')}
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2">{request.category}</h1>
                <p className="text-xs text-slate-500">Service Request ID: #{request.id.slice(0, 10)}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">Job Value</span>
                <div className="text-2xl font-black text-slate-900 flex items-center justify-end">
                  <IndianRupee className="w-4 h-4 text-amber-600" />
                  <span>{request.amount}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  Net to Worker: ₹{Math.round(request.amount * 0.85)} (85%)
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Customer Information</span>
              <p className="text-slate-700"><strong>Name:</strong> {request.customerName}</p>
              <p className="text-slate-700 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Address:</strong> {request.location.address}, {request.location.city}</span>
              </p>
              <p className="text-slate-700"><strong>Problem Statement:</strong> {request.problem}</p>
            </div>

            {/* Milestones Action Controller */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-black text-slate-900">Job Progression Controls</h3>

              {request.status === 'requested' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdvanceStatus('accepted')}
                    className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Accept Job
                  </button>
                  <button
                    onClick={() => handleAdvanceStatus('cancelled')}
                    className="py-3 px-6 rounded-2xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Decline
                  </button>
                </div>
              )}

              {request.status === 'accepted' && (
                <button
                  onClick={() => handleAdvanceStatus('navigating')}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Start Navigation (On The Way)</span>
                </button>
              )}

              {request.status === 'navigating' && (
                <button
                  onClick={() => handleAdvanceStatus('arrived')}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Mark Arrived at Customer Doorstep</span>
                </button>
              )}

              {request.status === 'arrived' && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>Customer Security OTP Verification</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Ask the customer for their 4-digit verification code before beginning work (Demo code: <strong>{request.verificationOtp || '7412'}</strong>).
                  </p>
                  <form onSubmit={handleVerifyOtpAndStart} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="p-2.5 rounded-xl border border-slate-300 text-center font-mono font-bold tracking-widest text-sm w-40"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                    >
                      Verify & Start Work
                    </button>
                  </form>
                  {otpError && (
                    <span className="text-xs font-bold text-rose-600 block">Invalid OTP. Please verify with customer.</span>
                  )}
                </div>
              )}

              {request.status === 'in_progress' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                    Work is currently in progress. Ensure customer satisfaction and clean up after completing service.
                  </div>
                  <label className="block text-xs font-bold text-slate-700">
                    Final service amount for this location
                    <span className="mt-1 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-amber-600" />
                      <input
                        type="number"
                        min={100}
                        max={50000}
                        value={finalAmount || request.amount}
                        onChange={(e) => setFinalAmount(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold"
                      />
                    </span>
                    <span className="mt-1 block text-[11px] font-normal text-slate-500">Adjust for travel, parts, urgency, or the actual work completed. The customer will review this amount before paying.</span>
                  </label>
                  <button
                    onClick={handleComplete}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Send ₹{finalAmount || request.amount} Invoice & Complete</span>
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className="p-6 rounded-2xl bg-emerald-100 text-emerald-900 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                  <h4 className="text-base font-bold">Service Completed & Settled!</h4>
                  <p className="text-xs text-emerald-800">
                    Net payout of ₹{Math.round(request.amount * 0.85)} added to your earnings balance. Cooperative welfare fund credited.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
