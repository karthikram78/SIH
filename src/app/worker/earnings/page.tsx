'use client';

import React, { useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  IndianRupee,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  Scale,
  Download,
} from 'lucide-react';

export default function WorkerEarningsPage() {
  const { currentWorker, serviceRequests } = useApp();

  const completedJobs = useMemo(() => {
    return serviceRequests.filter(
      (r) => r.assignedWorkerId === currentWorker.id && ['completed', 'paid'].includes(r.status)
    );
  }, [serviceRequests, currentWorker.id]);

  const totalGross = completedJobs.reduce((acc, curr) => acc + curr.amount, 2200);
  const totalNet = Math.round(totalGross * 0.85);
  const totalCoopContribution = Math.round(totalGross * 0.10);
  const totalPlatformFee = Math.round(totalGross * 0.05);

  const todayNet = 425;
  const weeklyNet = 2550;
  const monthlyNet = 10800;

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Worker Earnings & Payouts</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Transparent 85% net earnings ledger, cooperative welfare deductions, and platform fee records.
              </p>
            </div>

            <button
              onClick={() => alert('Payout request of accumulated balance simulated to bank account.')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
            >
              <CreditCard className="w-4 h-4" />
              <span>Withdraw to Bank</span>
            </button>
          </div>

          {/* Earnings Period Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Today&apos;s Net</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>{todayNet}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">1 job completed</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Weekly Net</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>{weeklyNet}</span>
              </div>
              <span className="text-[10px] text-slate-400">Past 7 days</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Monthly Net</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>{monthlyNet}</span>
              </div>
              <span className="text-[10px] text-slate-400">Current calendar month</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-sm space-y-1">
              <span className="text-[11px] text-amber-400 font-bold uppercase">Total Lifetime Net</span>
              <div className="text-2xl font-black text-white flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                <span>{totalNet}</span>
              </div>
              <span className="text-[10px] text-slate-400">Directly deposited</span>
            </div>
          </div>

          {/* Statutory Breakdown Ribbon */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Lifetime Statutory Fee Split Summary</span>
              </div>
              <span className="text-sm font-bold text-amber-400">Gross: ₹{totalGross}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[11px]">85% Net Worker Earnings</span>
                <span className="text-lg font-black text-emerald-400">₹{totalNet}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Retained 100% by artisan</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[11px]">10% Cooperative Welfare Fund</span>
                <span className="text-lg font-black text-amber-400">₹{totalCoopContribution}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">For medical & accident coverage</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[11px]">5% Platform Operations</span>
                <span className="text-lg font-black text-slate-300">₹{totalPlatformFee}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Hosting & cloud maintenance</p>
              </div>
            </div>
          </div>

          {/* Detailed Transaction History */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Earnings Transaction History</h3>
              <span className="text-xs text-slate-500 font-medium">{completedJobs.length} Settled Jobs</span>
            </div>

            <div className="divide-y divide-slate-100">
              {completedJobs.map((j) => {
                const net = Math.round(j.amount * 0.85);
                const coop = Math.round(j.amount * 0.10);
                const fee = Math.round(j.amount * 0.05);

                return (
                  <div key={j.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{j.category}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          SETTLED
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">Client: {j.customerName} ({j.location.address.split(',')[0]})</p>
                      <span className="text-[10px] text-slate-400 block">{new Date(j.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="text-right bg-slate-50 p-3 rounded-2xl border border-slate-100 w-full sm:w-auto">
                      <div className="text-xs text-slate-500">Gross: ₹{j.amount}</div>
                      <div className="text-base font-black text-emerald-700">Net Earned: ₹{net}</div>
                      <div className="text-[10px] text-amber-700">Coop Welfare: ₹{coop} | Platform: ₹{fee}</div>
                    </div>
                  </div>
                );
              })}

              {completedJobs.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No completed jobs to display. Complete customer jobs to build your earnings record.
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
