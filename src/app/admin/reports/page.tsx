'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import {
  FileText,
  Download,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    {
      title: 'SIH26089 Compliance & Audit Report',
      period: 'Annual FY 2025-2026',
      size: '2.4 MB PDF',
      desc: 'Complete architectural demonstration of cooperative integration, statutory 85/10/5 fee transparency, and algorithmic matching.',
    },
    {
      title: 'Artisan Welfare Fund Escrow Statement',
      period: 'Q3 2026',
      size: '1.1 MB PDF',
      desc: '10% welfare deduction reconciliation across all affiliated Tamil Nadu artisan societies.',
    },
    {
      title: 'Worker 4-Point Verification Benchmark Log',
      period: 'August 2026',
      size: '850 KB PDF',
      desc: 'Institutional inspection logs covering Identity, Trade Competency, Physical Workshop, and Mobile OTP audits.',
    },
  ];

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Statutory Reports & SIH Documentation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Exportable audit trails for Ministry of Cooperation review and SIH 2026 jury evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((r, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {r.period}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">{r.desc}</p>
                </div>

                <button
                  onClick={() => alert(`Downloading ${r.title} (Simulated PDF download)`)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report ({r.size})</span>
                </button>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
