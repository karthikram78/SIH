'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  IndianRupee,
} from 'lucide-react';

export default function AdminJobsPage() {
  const { serviceRequests, updateJobStatus } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = serviceRequests.filter((r) => {
    const matchSearch =
      (r.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.workerName || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Platform Service Requests Ledger</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Centralized job dispatch monitor, state transitions, and dispute intervention.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200">
              Total Recorded Jobs: <strong>{serviceRequests.length}</strong>
            </span>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by trade, customer or artisan..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {['All', 'Requested', 'Accepted', 'In_Progress', 'Completed', 'Paid'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Job ID & Service</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Artisan Assigned</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Statutory Fee</th>
                    <th className="p-4">Split (85/10/5)</th>
                    <th className="p-4 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((j) => {
                    const workerCut = Math.round(j.amount * 0.85);
                    const coopCut = Math.round(j.amount * 0.10);
                    const platformCut = Math.round(j.amount * 0.05);

                    return (
                      <tr key={j.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{j.category}</span>
                          <span className="text-[10px] text-slate-400 font-mono">#{j.id.slice(0, 8)}</span>
                        </td>

                        <td className="p-4 font-medium text-slate-800">{j.customerName}</td>
                        <td className="p-4 font-medium text-emerald-800">{j.workerName}</td>

                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                            {j.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-slate-900">₹{j.amount}</td>

                        <td className="p-4 text-[10px] text-slate-500">
                          ₹{workerCut} / ₹{coopCut} / ₹{platformCut}
                        </td>

                        <td className="p-4 text-right">
                          {j.status !== 'completed' && j.status !== 'paid' && (
                            <button
                              onClick={() => updateJobStatus(j.id, 'completed')}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                            >
                              Force Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
