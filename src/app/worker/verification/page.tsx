'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Upload,
  Building,
  HelpCircle,
} from 'lucide-react';

export default function WorkerVerificationPage() {
  const { currentWorker } = useApp();

  const isVerified = currentWorker.isVerified !== false;

  const verificationItems = [
    {
      title: 'Identity Verification',
      desc: 'Government photo ID vetted by cooperative compliance desk.',
      verified: true,
      docName: 'Voter ID / Driving License Copy',
    },
    {
      title: 'Skill Verification',
      desc: 'Trade competency certificate or cooperative master artisan endorsement.',
      verified: true,
      docName: 'Skill Certificate (Govt / Cooperative)',
    },
    {
      title: 'Workplace Verification',
      desc: 'Physical inspection of workshop, tools, or physical address by field officer.',
      verified: true,
      docName: 'Workshop Audit Report & Geo-tag',
    },
    {
      title: 'Mobile OTP Verification',
      desc: 'Secure mobile number authentication for real-time dispatch alerts.',
      verified: true,
      docName: currentWorker.mobile,
    },
  ];

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Worker Verification Status
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                4-Point Institutional Credentialing under Tamil Nadu Cooperative Societies Act.
              </p>
            </div>

            <div className="self-start sm:self-auto">
              {isVerified ? (
                <span className="px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>VERIFIED WORKER</span>
                </span>
              ) : (
                <span className="px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border-2 border-amber-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>PENDING VERIFICATION</span>
                </span>
              )}
            </div>
          </div>

          {/* Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              <span>Affiliated Cooperative: {currentWorker.cooperativeName}</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Only verified workers are recommended to customers by our Smart Matching algorithm. Verification status can only be modified by authorized cooperative secretaries and platform auditors.
            </p>
          </div>

          {/* 4 Points Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {verificationItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    APPROVED ✓
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{item.docName}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upload additional demo certificate */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Supporting Qualifications</h3>
            <p className="text-xs text-slate-500">
              Have you completed a new vocational workshop or acquired modern tool certifications? Submit for cooperative endorsement.
            </p>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-amber-400 transition cursor-pointer">
              <Upload className="w-8 h-8 text-amber-600 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Click to upload document file (Demo)</div>
              <div className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
