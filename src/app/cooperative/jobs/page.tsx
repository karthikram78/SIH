'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
} from 'lucide-react';

export default function CooperativeJobsPage() {
  const { serviceRequests, workers, cooperatives } = useApp();
  const coop = cooperatives[0];

  const [statusFilter, setStatusFilter] = useState('All');

  const coopJobs = useMemo(() => {
    return serviceRequests.filter((r) => {
      const w = workers.find((item) => item.id === r.assignedWorkerId);
      return !w || w.cooperativeId === coop.id;
    });
  }, [serviceRequests, workers, coop.id]);

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return coopJobs;
    return coopJobs.filter((j) => j.status.toLowerCase() === statusFilter.toLowerCase());
  }, [coopJobs, statusFilter]);

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Cooperative Service Dispatch Ledger</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Oversee all customer requests dispatched to member artisans of {coop.name}.
              </p>
            </div>

            <div className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200">
              Total Cooperative Jobs: <strong>{coopJobs.length}</strong>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {['All', 'Requested', 'Accepted', 'In_Progress', 'Completed', 'Paid'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Jobs Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Service & Problem</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Assigned Member</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Welfare 10%</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{j.category}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{j.problem}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-800">{j.customerName}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-emerald-800">{j.workerName}</span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {j.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        ₹{j.amount}
                      </td>

                      <td className="p-4 font-bold text-amber-700">
                        ₹{Math.round(j.amount * 0.10)}
                      </td>

                      <td className="p-4 text-slate-400">
                        {new Date(j.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
