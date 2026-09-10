'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Search,
  ShieldCheck,
  Star,
  Building,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function AdminWorkersPage() {
  const { workers, cooperatives } = useApp();
  const [search, setSearch] = useState('');
  const [coopFilter, setCoopFilter] = useState('All');

  const filtered = useMemo(() => {
    return workers.filter((w) => {
      const matchSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.primaryCategory.toLowerCase().includes(search.toLowerCase());
      const matchCoop = coopFilter === 'All' || w.cooperativeId === coopFilter;
      return matchSearch && matchCoop;
    });
  }, [workers, search, coopFilter]);

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">National Worker Registry</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Platform-wide worker auditing, skill coverage, and cooperative society affiliations.
              </p>
            </div>

            <span className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200 self-start sm:self-auto">
              Total Enrolled Artisans: <strong>{workers.length}</strong>
            </span>
          </div>

          {/* Filters */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search worker or skill trade..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={coopFilter}
                onChange={(e) => setCoopFilter(e.target.value)}
                className="p-2 text-xs rounded-xl border border-slate-300 font-semibold"
              >
                <option value="All">All Cooperatives ({cooperatives.length})</option>
                {cooperatives.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Artisan Name</th>
                    <th className="p-4">Trade</th>
                    <th className="p-4">Cooperative Society</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Completed Jobs</th>
                    <th className="p-4">Hourly Rate</th>
                    <th className="p-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={w.avatar}
                            alt={w.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{w.name}</span>
                            <span className="text-[10px] text-slate-400">{w.location.city}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-800">{w.primaryCategory}</td>
                      <td className="p-4 text-slate-600 truncate max-w-[220px]">{w.cooperativeName}</td>

                      <td className="p-4 font-bold text-slate-900 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{w.rating}</span>
                      </td>

                      <td className="p-4 font-bold text-slate-700">{w.completedJobsCount}</td>
                      <td className="p-4 font-bold text-slate-900">₹{w.baseChargePerHour} / hr</td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          VERIFIED ✓
                        </span>
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
