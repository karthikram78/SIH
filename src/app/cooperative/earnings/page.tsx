'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  IndianRupee,
  TrendingUp,
  Building,
  Scale,
  CreditCard,
  Download,
  Calendar,
} from 'lucide-react';

export default function CooperativeEarningsPage() {
  const { cooperatives } = useApp();
  const coop = cooperatives[0];

  const totalGMV = 325400;
  const totalWorkerPayout = Math.round(totalGMV * 0.85); // ₹276,590
  const totalWelfareFund = Math.round(totalGMV * 0.10);  // ₹32,540
  const totalPlatformFee = Math.round(totalGMV * 0.05);  // ₹16,270

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Cooperative Welfare Ledger & Revenue
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Statutory 10% welfare contribution accumulation under Ministry of Cooperation guidelines.
              </p>
            </div>

            <div className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200">
              Cooperative: <strong>{coop.name}</strong>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Total Platform GMV</span>
              <div className="text-2xl font-black text-white flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                <span>{totalGMV.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-400">Total services booked</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-emerald-700 font-bold uppercase">Workers Net Livelihood (85%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>{totalWorkerPayout.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Directly retained by artisans</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-amber-700 font-bold uppercase">Welfare Fund Pool (10%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-600" />
                <span>{totalWelfareFund.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Reserved for medical & accident coverage</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-600 font-bold uppercase">Platform Maintenance (5%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-slate-600" />
                <span>{totalPlatformFee.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Central cloud operations</span>
            </div>
          </div>

          {/* Statutory Guidelines Explanation */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 text-white space-y-4">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              <span>Section 16 Statutory Distribution Compliance</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with Ministry of Cooperation directives for SIH26089, private middlemen taking 25-35% cut are eliminated. Avadi Connect enforces an unalterable rule: 85% is directly credited to the worker upon job OTP verification, 10% is placed in the cooperative social security escrow, and only 5% is allocated for basic platform running costs.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
