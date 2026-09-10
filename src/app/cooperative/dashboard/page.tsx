'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { CooperativeDashboardView } from '@/components/cooperative/CooperativeDashboardView';

export default function CooperativeDashboardPage() {
  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* Cooperative Portal Subnav */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-bold">
              <Link href="/cooperative/dashboard" className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white whitespace-nowrap">
                Executive Overview
              </Link>
              <Link href="/cooperative/members" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Members
              </Link>
              <Link href="/cooperative/jobs" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Jobs
              </Link>
              <Link href="/cooperative/skills" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Skills & Training
              </Link>
              <Link href="/cooperative/earnings" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Welfare Ledger
              </Link>
              <Link href="/cooperative/welfare" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Insurance & Welfare
              </Link>
              <Link href="/cooperative/analytics" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Analytics
              </Link>
              <Link href="/cooperative/demand-forecast" className="px-3 py-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 whitespace-nowrap flex items-center gap-1">
                <span>AI Demand Forecast</span>
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <CooperativeDashboardView />
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
