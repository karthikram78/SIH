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
  Filter,
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

export default function CooperativeMembersPage() {
  const { workers, cooperatives } = useApp();
  const coop = cooperatives[0];

  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All');

  const coopWorkers = useMemo(() => {
    return workers.filter((w) => w.cooperativeId === coop.id);
  }, [workers, coop.id]);

  const filtered = useMemo(() => {
    return coopWorkers.filter((w) => {
      const matchSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchTrade = tradeFilter === 'All' || w.primaryCategory === tradeFilter;
      return matchSearch && matchTrade;
    });
  }, [coopWorkers, search, tradeFilter]);

  const trades = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Vehicle Repair', 'Painting', 'Technician'];

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Cooperative Member Roster</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {coop.name} • {coopWorkers.length} Registered Artisans
              </p>
            </div>

            <Link
              href="/worker/register"
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
            >
              + Onboard New Worker
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member name or skill..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {trades.map((t) => (
                <button
                  key={t}
                  onClick={() => setTradeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    tradeFilter === t
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
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
                    <th className="p-4">Worker / Artisan</th>
                    <th className="p-4">Trade & Skills</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Jobs</th>
                    <th className="p-4 text-right">Action</th>
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
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{w.name}</span>
                            <span className="text-[11px] text-slate-400">{w.mobile}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{w.primaryCategory}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">
                          {w.skills.slice(0, 2).join(', ')}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-[11px] font-bold capitalize flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              w.availability === 'available'
                                ? 'bg-emerald-500'
                                : w.availability === 'busy'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          ></span>
                          <span>{w.availability}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{w.rating}</span>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-slate-800">
                        {w.completedJobsCount}
                      </td>

                      <td className="p-4 text-right">
                        <Link
                          href={`/cooperative/members/${w.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-700 text-white font-bold text-[11px] transition inline-flex items-center gap-1"
                        >
                          <span>Audit / View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                        No cooperative members match the current search filters.
                      </td>
                    </tr>
                  )}
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
