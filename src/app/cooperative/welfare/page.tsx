'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  HeartHandshake,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  IndianRupee,
  Activity,
  FileCheck,
} from 'lucide-react';

export default function CooperativeWelfareAdminPage() {
  const { cooperatives } = useApp();
  const coop = cooperatives[0];

  const recentClaims = [
    {
      id: 'CLM-104',
      workerName: 'Arun Kumar',
      trade: 'Plumbing',
      type: 'Annual Health Checkup Reimbursement',
      amount: 1500,
      date: 'Sept 04, 2026',
      status: 'Approved',
    },
    {
      id: 'CLM-103',
      workerName: 'M. Senthil Nathan',
      trade: 'Electrical',
      type: 'Toolbox Modernization Loan (0% Interest)',
      amount: 12000,
      date: 'Aug 28, 2026',
      status: 'Approved',
    },
    {
      id: 'CLM-102',
      workerName: 'K. Saravanan',
      trade: 'Vehicle Repair',
      type: 'Emergency Minor Injury Clinic Bill',
      amount: 2800,
      date: 'Aug 14, 2026',
      status: 'Disbursed',
    },
  ];

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welfare Administration & Claims Desk
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Disburse accident insurance, health aid, and welfare benefits to verified member workers.
              </p>
            </div>

            <div className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200">
              Welfare Balance: <strong className="text-emerald-700">₹32,540</strong>
            </div>
          </div>

          {/* Claims List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Recent Welfare Claims & Disbursements</h2>
              <span className="text-xs text-slate-500 font-medium">Auto-funded via 10% job split</span>
            </div>

            <div className="divide-y divide-slate-100">
              {recentClaims.map((c) => (
                <div key={c.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{c.workerName}</span>
                      <span className="text-[10px] text-slate-500">({c.trade})</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{c.type}</p>
                    <span className="text-[10px] text-slate-400 block">Claim ID: {c.id} • Date: {c.date}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">₹{c.amount}</div>
                    <span className="text-[10px] text-slate-400">Direct Bank Transfer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
