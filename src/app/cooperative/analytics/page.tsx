'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Star,
  Clock,
  MapPin,
} from 'lucide-react';

export default function CooperativeAnalyticsPage() {
  const { workers, serviceRequests, serviceCategories } = useApp();

  const metrics = [
    { label: 'Avg Customer Rating', value: '4.85 / 5.0', icon: Star, color: 'text-amber-500' },
    { label: 'Avg Dispatch Arrival Time', value: '26 mins', icon: Clock, color: 'text-blue-500' },
    { label: 'Job Completion Rate', value: '98.4%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Active Service Zones', value: '10 Zones', icon: MapPin, color: 'text-purple-500' },
  ];

  const tradeDistribution = [
    { name: 'Plumbing', pct: 34, jobs: 42 },
    { name: 'Electrical', pct: 28, jobs: 35 },
    { name: 'Vehicle & Puncture', pct: 18, jobs: 22 },
    { name: 'Carpentry', pct: 12, jobs: 15 },
    { name: 'House Cleaning', pct: 8, jobs: 10 },
  ];

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Cooperative Performance Analytics</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Data intelligence on member fulfillment rates, customer satisfaction, and trade request distribution.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {metrics.map((m, idx) => {
              const IconComp = m.icon;
              return (
                <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">{m.label}</span>
                    <IconComp className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{m.value}</div>
                </div>
              );
            })}
          </div>

          {/* Trade Share Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900">Service Request Share by Trade</h2>

            <div className="space-y-4">
              {tradeDistribution.map((t, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{t.name}</span>
                    <span className="text-slate-500 font-medium">{t.jobs} jobs ({t.pct}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full"
                      style={{ width: `${t.pct}%` }}
                    ></div>
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
