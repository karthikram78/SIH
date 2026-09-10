'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  Clock,
  IndianRupee,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function WorkerJobsPage() {
  const { currentWorker, serviceRequests, updateJobStatus } = useApp();
  const [tab, setTab] = useState<'requests' | 'active' | 'completed'>('requests');

  const incomingRequests = useMemo(() => {
    return serviceRequests.filter(
      (r) => (r.assignedWorkerId === currentWorker.id || !r.assignedWorkerId) && r.status === 'requested'
    );
  }, [serviceRequests, currentWorker.id]);

  const activeJobs = useMemo(() => {
    return serviceRequests.filter(
      (r) =>
        r.assignedWorkerId === currentWorker.id &&
        !['requested', 'completed', 'paid', 'cancelled'].includes(r.status)
    );
  }, [serviceRequests, currentWorker.id]);

  const completedJobs = useMemo(() => {
    return serviceRequests.filter(
      (r) => r.assignedWorkerId === currentWorker.id && ['completed', 'paid'].includes(r.status)
    );
  }, [serviceRequests, currentWorker.id]);

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Job Requests & Orders</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage incoming customer bookings, progress through job milestones, and record OTP completion.
              </p>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'requests'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              New Requests ({incomingRequests.length})
            </button>
            <button
              onClick={() => setTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'active'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              In Progress ({activeJobs.length})
            </button>
            <button
              onClick={() => setTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'completed'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Completed ({completedJobs.length})
            </button>
          </div>

          {/* List of Jobs */}
          <div className="space-y-4">
            {tab === 'requests' && (
              <>
                {incomingRequests.map((req) => {
                  const estEarnings = Math.round(req.amount * 0.85);
                  return (
                    <div
                      key={req.id}
                      className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-slate-900">{req.category}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 animate-pulse">
                              NEW REQUEST
                            </span>
                            {req.isEmergency && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                🚨 EMERGENCY
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{req.problem}</p>
                          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-4">
                            <span>Customer: <strong className="text-slate-700">{req.customerName}</strong></span>
                            <span>•</span>
                            <span>Urgency: <strong className="capitalize text-amber-700">{req.urgency}</strong></span>
                          </div>
                        </div>

                        <div className="text-right sm:text-right">
                          <span className="text-[10px] text-slate-400 block font-medium">Estimated Net Payout</span>
                          <div className="text-xl font-black text-emerald-700 flex items-center justify-end">
                            <IndianRupee className="w-4 h-4" />
                            <span>₹{estEarnings}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => updateJobStatus(req.id, 'cancelled')}
                          className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-600 transition"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => updateJobStatus(req.id, 'accepted')}
                          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-md transition"
                        >
                          Accept Job
                        </button>
                      </div>
                    </div>
                  );
                })}

                {incomingRequests.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700">No Pending Requests</h3>
                    <p className="text-xs text-slate-400">Keep your availability status as AVAILABLE to receive incoming bookings.</p>
                  </div>
                )}
              </>
            )}

            {tab === 'active' && (
              <>
                {activeJobs.map((req) => (
                  <div
                    key={req.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{req.category}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{req.problem}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                        <span>Customer: <strong>{req.customerName}</strong></span>
                        <span>•</span>
                        <span>Fee: ₹{req.amount}</span>
                      </div>
                    </div>

                    <Link
                      href={`/worker/jobs/${req.id}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Update Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}

                {activeJobs.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 text-slate-400 text-xs">
                    No active jobs in progress.
                  </div>
                )}
              </>
            )}

            {tab === 'completed' && (
              <>
                {completedJobs.map((req) => {
                  const netWorker = req.paymentBreakdown?.workerEarnings || Math.round(req.amount * 0.85);
                  const coopWelfare = req.paymentBreakdown?.cooperativeContribution || Math.round(req.amount * 0.10);

                  return (
                    <div
                      key={req.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">{req.category}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            COMPLETED & PAID
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{req.problem}</p>
                        <div className="text-[11px] text-slate-400 flex items-center gap-3">
                          <span>Customer: {req.customerName}</span>
                          <span>•</span>
                          <span>Completed: {new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-right p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <span className="text-[10px] text-emerald-800 font-bold block">Net Received</span>
                        <div className="text-base font-black text-emerald-900">₹{netWorker}</div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">+₹{coopWelfare} to Welfare Fund</span>
                      </div>
                    </div>
                  );
                })}

                {completedJobs.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 text-slate-400 text-xs">
                    No completed jobs yet.
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
