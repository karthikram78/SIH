'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  CreditCard,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Scale,
  Download,
} from 'lucide-react';

export default function CustomerPaymentsPage() {
  const { serviceRequests, currentUser } = useApp();

  const paidRequests = useMemo(() => {
    return serviceRequests.filter(
      (r) => r.customerId === currentUser.id && (r.status === 'paid' || r.status === 'completed')
    );
  }, [serviceRequests, currentUser.id]);

  const totalSpent = paidRequests.reduce((sum, r) => sum + r.amount, 0);
  const totalWorkerTransferred = Math.round(totalSpent * 0.85);
  const totalCoopWelfare = Math.round(totalSpent * 0.10);
  const totalPlatform = Math.round(totalSpent * 0.05);

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Payments & Receipts</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Transparent statutory breakdown for every service payment under Ministry of Cooperation guidelines.
              </p>
            </div>
          </div>

          {/* Statutory 85-10-5 Split Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Paid Out</span>
              <div className="text-2xl font-black text-white flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                <span>{totalSpent}</span>
              </div>
              <span className="text-[10px] text-slate-400">Across {paidRequests.length} completed services</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider block">Worker Direct (85%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>{totalWorkerTransferred}</span>
              </div>
              <span className="text-[10px] text-slate-500">100% net livelihood to artisans</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block">Coop Welfare (10%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-600" />
                <span>{totalCoopWelfare}</span>
              </div>
              <span className="text-[10px] text-slate-500">Health & accident fund</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider block">Platform Fee (5%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4 text-slate-600" />
                <span>{totalPlatform}</span>
              </div>
              <span className="text-[10px] text-slate-500">Zero-profit operational maintenance</span>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Transaction History</h2>
              <span className="text-xs text-slate-400 font-medium">All figures in INR (₹)</span>
            </div>

            <div className="divide-y divide-slate-100">
              {paidRequests.map((req) => {
                const workerShare = Math.round(req.amount * 0.85);
                const coopShare = Math.round(req.amount * 0.10);
                const platformShare = Math.round(req.amount * 0.05);

                return (
                  <div key={req.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{req.category}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          SUCCESSFUL
                        </span>
                        <span className="text-xs text-slate-400">Txn: #{req.id.slice(0, 8)}</span>
                      </div>
                      <p className="text-xs text-slate-600">Artisan: <strong>{req.workerName}</strong></p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Paid: {new Date(req.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Mode: {req.paymentMethod || 'UPI Simulation'}</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="text-right text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-900 text-sm">₹{req.amount}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Worker: ₹{workerShare} | Coop: ₹{coopShare} | Fee: ₹{platformShare}
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloaded Invoice #${req.id} (PDF simulated)`)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {paidRequests.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-xs">
                  No completed payment records found yet.
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
