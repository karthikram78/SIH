'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  CreditCard,
  IndianRupee,
  Scale,
  Download,
  Building,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { serviceRequests } = useApp();

  const totalGMV = 325400;
  const workerLivelihood = Math.round(totalGMV * 0.85);
  const coopEscrow = Math.round(totalGMV * 0.10);
  const platformRevenue = Math.round(totalGMV * 0.05);

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Platform Payments & Escrow Ledger</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Centralized audit of all statutory fee splits under Ministry of Cooperation compliance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Total Platform Volume</span>
              <div className="text-2xl font-black text-white flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                <span>{totalGMV.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-400">Gross customer turnover</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-emerald-700 font-bold uppercase">Artisan Payouts (85%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>{workerLivelihood.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Directly transferred to bank/UPI</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-amber-700 font-bold uppercase">Coop Welfare Escrow (10%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-600" />
                <span>{coopEscrow.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Reserved for medical/accident funds</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-600 font-bold uppercase">Platform Ops (5%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-slate-600" />
                <span>{platformRevenue.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Infrastructure maintenance</span>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
