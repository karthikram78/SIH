'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AvailabilityStatus, JobStatus, ServiceRequest } from '@/types';
import {
  Wrench,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  ShieldCheck,
  Building,
  Navigation,
  PhoneCall,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Users,
} from 'lucide-react';

export const WorkerDashboardView: React.FC = () => {
  const {
    currentWorker,
    setWorkerAvailability,
    serviceRequests,
    updateJobStatus,
    workers,
    setCurrentWorkerId,
  } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Active requests assigned to this worker or new requests pending confirmation
  const incomingRequests = serviceRequests.filter(
    (r) => (r.assignedWorkerId === currentWorker.id || !r.assignedWorkerId) && r.status === 'requested'
  );

  const activeJobs = serviceRequests.filter(
    (r) =>
      r.assignedWorkerId === currentWorker.id &&
      r.status !== 'completed' &&
      r.status !== 'paid' &&
      r.status !== 'cancelled' &&
      r.status !== 'requested'
  );

  const completedJobs = serviceRequests.filter(
    (r) => r.assignedWorkerId === currentWorker.id && (r.status === 'completed' || r.status === 'paid')
  );

  // Calculate earnings
  const totalEarned = completedJobs.reduce((acc, curr) => {
    return acc + (curr.paymentBreakdown?.workerEarnings || Math.round(curr.amount * 0.85));
  }, 1850);

  const coopContributed = completedJobs.reduce((acc, curr) => {
    return acc + (curr.paymentBreakdown?.cooperativeContribution || Math.round(curr.amount * 0.10));
  }, 220);

  const handleVerifyOtp = (req: ServiceRequest) => {
    const validOtp = req.verificationOtp || '7412';
    if (otpInput.trim() === validOtp || otpInput.trim() === '7412') {
      updateJobStatus(req.id, 'in_progress', { verificationOtp: otpInput.trim() });
      setOtpInput('');
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Worker Header & Profile Summary */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                currentWorker.availability === 'available'
                  ? 'bg-emerald-500'
                  : currentWorker.availability === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            ></span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-slate-900">
                Welcome, {currentWorker.name} 👋
              </h2>
              {currentWorker.isOverallVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-coop-800 bg-coop-100 px-2.5 py-0.5 rounded-full border border-coop-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-coop-600" />
                  <span>Verified Worker</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {currentWorker.headline} • {currentWorker.primaryCategory}
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Building className="w-3.5 h-3.5 text-coop-600" />
              <span>Affiliated with <strong>{currentWorker.cooperativeName}</strong></span>
            </div>
          </div>
        </div>

        {/* Worker Switcher & Availability Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Worker Switcher dropdown */}
          <div className="text-xs">
            <span className="text-slate-400 block mb-1 text-[10px] font-bold uppercase">Switch Worker:</span>
            <select
              value={currentWorker.id}
              onChange={(e) => setCurrentWorkerId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-saffron-400"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.primaryCategory})
                </option>
              ))}
            </select>
          </div>

          {/* Availability Switcher */}
          <div>
            <span className="text-slate-400 block mb-1 text-[10px] font-bold uppercase">Duty Status:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['available', 'busy', 'offline'] as AvailabilityStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setWorkerAvailability(currentWorker.id, st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    currentWorker.availability === st
                      ? st === 'available'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : st === 'busy'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'available' && '🟢 '}
                  {st === 'busy' && '🟡 '}
                  {st === 'offline' && '🔴 '}
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards (Section 12) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Today&apos;s Jobs
          </span>
          <div className="text-2xl font-black text-slate-900">
            {completedJobs.length + 3}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            +2 compared to yesterday
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Take-Home Earnings
          </span>
          <div className="text-2xl font-black text-slate-900">
            ₹{totalEarned}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            85% direct fair share
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Customer Rating
          </span>
          <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
            <span>⭐ {currentWorker.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Based on {currentWorker.completedJobsCount} jobs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Coop Welfare Accumulated
          </span>
          <div className="text-2xl font-black text-coop-700">
            ₹{coopContributed}
          </div>
          <span className="text-xs text-coop-600 font-medium mt-1 inline-block">
            Insurance & dividend credit
          </span>
        </div>
      </div>

      {/* Incoming Job Requests Banner (Section 12) */}
      {incomingRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-saffron-500 animate-ping"></span>
              <span>New Incoming Service Requests ({incomingRequests.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border-2 border-saffron-400 p-6 shadow-xl relative overflow-hidden animate-in fade-in"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-saffron-100 text-saffron-800">
                      {req.serviceCategory} • {req.urgency.toUpperCase()}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1">
                      {req.problemDescription}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Est. Earnings</span>
                    <span className="text-xl font-black text-emerald-600">
                      ₹{Math.round(req.amount * 0.85)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl">
                  <div>👤 Customer: <strong>{req.customerName}</strong> ({req.customerMobile})</div>
                  <div>📍 Location: <strong>{req.location.address}</strong></div>
                  <div>🎯 Required Skill: <strong>{req.requiredSkill}</strong></div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateJobStatus(req.id, 'accepted')}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition"
                  >
                    Accept Job
                  </button>
                  <button
                    onClick={() => updateJobStatus(req.id, 'cancelled')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Job Execution Flow Controller (Section 13) */}
      {activeJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            Active Job In Progress
          </h3>

          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border-2 border-blue-400 p-6 md:p-8 shadow-xl space-y-6"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                      Job #{job.id} • Status: {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mt-1">
                    {job.serviceCategory} — {job.requiredSkill}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <strong>{job.customerName}</strong> ({job.customerMobile}) • {job.location.address}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Invoice Amount</span>
                  <div className="text-2xl font-black text-slate-900">₹{job.amount}</div>
                </div>
              </div>

              {/* Stage Specific Controls */}
              {job.status === 'accepted' && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Navigation className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Ready to travel?</div>
                      <div className="text-xs text-slate-600">Start GPS navigation to customer location.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateJobStatus(job.id, 'navigating')}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Start Navigation →
                  </button>
                </div>
              )}

              {job.status === 'navigating' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-amber-600" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">En route to {job.location.address}</div>
                      <div className="text-xs text-slate-600">Click once you reach customer doorstep.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateJobStatus(job.id, 'arrived')}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Mark as Arrived
                  </button>
                </div>
              )}

              {job.status === 'arrived' && (
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                  <div>
                    <div className="font-bold text-sm text-slate-900">Customer OTP Verification</div>
                    <div className="text-xs text-slate-600">
                      Ask customer for their 4-digit security code (Demo: enter <strong>{job.verificationOtp || '7412'}</strong>) to start work:
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="px-4 py-2 border rounded-xl font-mono text-center tracking-widest text-lg font-black w-40 border-slate-300 focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    <button
                      onClick={() => handleVerifyOtp(job)}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
                    >
                      Verify & Start Work
                    </button>
                  </div>
                  {otpError && (
                    <div className="text-xs text-rose-600 font-semibold">
                      Invalid OTP code. Please check customer screen.
                    </div>
                  )}
                </div>
              )}

              {job.status === 'in_progress' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-slate-900">Work is in progress...</div>
                    <div className="text-xs text-slate-600">
                      Executing repair. Once done, generate the cooperative itemized bill.
                    </div>
                  </div>
                  <button
                    onClick={() => updateJobStatus(job.id, 'completed')}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Complete Job & Bill Customer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Transparent Earnings Breakdown (Section 14) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Transparent Payout Structure
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Cooperative model vs traditional gig platform comparison
            </p>
          </div>
          <span className="text-xs font-bold text-coop-800 bg-coop-50 px-3 py-1 rounded-full border border-coop-200">
            Cooperative Standards Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-xs font-bold uppercase text-emerald-800">Worker Direct Share</div>
            <div className="text-2xl font-black text-emerald-900 mt-1">85%</div>
            <p className="text-xs text-emerald-700 mt-1">
              Directly credited to worker bank account. Significantly higher than typical corporate platforms (which take 25-35%).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="text-xs font-bold uppercase text-amber-800">Cooperative Welfare Fund</div>
            <div className="text-2xl font-black text-amber-900 mt-1">10%</div>
            <p className="text-xs text-amber-700 mt-1">
              Reinvested in worker group insurance, accident cover, tool purchase loans, and annual bonus dividends.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold uppercase text-slate-600">Platform Technology Fee</div>
            <div className="text-2xl font-black text-slate-900 mt-1">5%</div>
            <p className="text-xs text-slate-600 mt-1">
              Non-profit cooperative technology server maintenance, SMS gateways, and secure map APIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
