'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ArrowLeft,
  Building,
  Star,
  MapPin,
  IndianRupee,
  AlertTriangle,
} from 'lucide-react';

export default function CooperativeMemberAuditPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params?.id as string;
  const { workers, verifyDocument } = useApp();

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const worker = useMemo(() => {
    return workers.find((w) => w.id === memberId) || workers[0];
  }, [workers, memberId]);

  const handleUpdateStatus = (action: 'verify' | 'reject') => {
    if (action === 'verify') {
      worker.isVerified = true;
      setStatusMsg('Member 4-point verification endorsed and approved by cooperative secretary.');
    } else {
      worker.isVerified = false;
      setStatusMsg('Member returned for document resubmission.');
    }
    setTimeout(() => setStatusMsg(null), 3500);
  };

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Link
            href="/cooperative/members"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Member Directory</span>
          </Link>

          {/* Member Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <h1 className="text-2xl font-black text-slate-900">{worker.name}</h1>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">{worker.primaryCategory} Specialist</p>
                  <p className="text-xs text-slate-500 mt-1">{worker.location.address}, {worker.location.city}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus('verify')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
                >
                  Endorse / Verify
                </button>
                <button
                  onClick={() => handleUpdateStatus('reject')}
                  className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition"
                >
                  Flag for Review
                </button>
              </div>
            </div>

            {statusMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{statusMsg}</span>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Experience</span>
                <span className="text-sm font-black text-slate-900">{worker.experienceYears} Years</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Rating</span>
                <span className="text-sm font-black text-slate-900">{worker.rating} / 5.0</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Jobs</span>
                <span className="text-sm font-black text-slate-900">{worker.completedJobsCount} Jobs</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Hourly Charge</span>
                <span className="text-sm font-black text-slate-900">₹{worker.baseChargePerHour}</span>
              </div>
            </div>
          </div>

          {/* Dossier Documents Audit */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cooperative Verification Checklist</h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Identity Proof (Aadhaar / Voter ID Demo)</span>
                    <span className="text-[10px] text-slate-400">Institutional verification copy on file</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  VERIFIED
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Vocational Trade Certificate (ITI / Guild Demo)</span>
                    <span className="text-[10px] text-slate-400">Plumbing & sanitation skills validated</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  VERIFIED
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Workshop / Shop Physical Geo-Tag Report</span>
                    <span className="text-[10px] text-slate-400">Field officer visited and inspected tools</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
