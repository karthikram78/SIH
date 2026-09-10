'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  Users,
  Building,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Settings,
  Scale,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { workers, cooperatives, serviceRequests } = useApp();

  const totalGMV = 325400;
  const platformRevenue = Math.round(totalGMV * 0.05); // 5% platform fee
  const coopWelfarePool = Math.round(totalGMV * 0.10); // 10%
  const pendingVerifications = workers.filter((w) => !w.isOverallVerified).length;

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* Platform Admin Subnav */}
        <div className="bg-slate-900 border-b border-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-bold">
              <Link href="/admin/dashboard" className="px-3 py-1.5 rounded-lg bg-amber-600 text-white whitespace-nowrap">
                Platform Console
              </Link>
              <Link href="/admin/users" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                Users
              </Link>
              <Link href="/admin/workers" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                Workers
              </Link>
              <Link href="/admin/worker-verification" className="px-3 py-1.5 rounded-lg text-amber-400 bg-amber-950/60 border border-amber-500/30 whitespace-nowrap">
                Verification Desk ({pendingVerifications})
              </Link>
              <Link href="/admin/cooperatives" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                Cooperatives
              </Link>
              <Link href="/admin/services" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                Services & Skills
              </Link>
              <Link href="/admin/jobs" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                All Jobs
              </Link>
              <Link href="/admin/payments" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                Payments & Fees
              </Link>
              <Link href="/admin/reports" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                SIH Audit Reports
              </Link>
              <Link href="/admin/settings" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap">
                Platform Settings
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Executive Overview Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Ministry of Cooperation • Central Oversight Desk (SIH26089)
              </span>
            </div>
            <h1 className="text-3xl font-black">Avadi Connect National Management Console</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Real-time monitoring of artisan onboarding, statutory 85/10/5 fee transparency, cooperative welfare compliance, and algorithmic worker matching governance.
            </p>
          </div>

          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Affiliated Cooperatives</span>
              <div className="text-2xl font-black text-slate-900">{cooperatives.length} Societies</div>
              <span className="text-[10px] text-emerald-600 font-bold">100% compliant audits</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Registered Artisans</span>
              <div className="text-2xl font-black text-slate-900">{workers.length} Workers</div>
              <span className="text-[10px] text-slate-500">Across 15 trade categories</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Welfare Pool (10%)</span>
              <div className="text-2xl font-black text-amber-600 flex items-center">
                <IndianRupee className="w-4 h-4" />
                <span>{coopWelfarePool.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Social security escrow balance</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Platform Ops Fee (5%)</span>
              <div className="text-2xl font-black text-slate-900 flex items-center">
                <IndianRupee className="w-4 h-4" />
                <span>{platformRevenue.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500">Zero markup non-profit operations</span>
            </div>
          </div>

          {/* Quick Actions Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/worker-verification"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Worker Document Verification Desk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review pending Aadhaar proofs, trade certificates, and workshop audit reports. Approve or return credentials.
              </p>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <span>Inspect Verification Queue ({pendingVerifications})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/admin/cooperatives"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cooperative Societies Registry</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Audit registered artisan societies under the Tamil Nadu Cooperative Act. Monitor district membership.
              </p>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>View Cooperatives Roster</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/admin/settings"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Smart Matching Weights & Rules</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fine-tune matching weights (30% skill, 25% proximity, 15% availability, etc.) and statutory fee splits.
              </p>
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>Configure Platform Algorithms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
