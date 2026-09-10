'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { WorkerDashboardView } from '@/components/worker/WorkerDashboardView';
import {
  Briefcase,
  ShieldCheck,
  Calendar,
  Clock,
  IndianRupee,
  Star,
  HeartHandshake,
  Bell,
  ArrowRight,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* Worker Portal Quick Subnav */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-bold">
              <Link href="/worker/dashboard" className="px-3 py-1.5 rounded-lg bg-amber-600 text-white whitespace-nowrap">
                Dashboard
              </Link>
              <Link href="/worker/jobs" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Jobs
              </Link>
              <Link href="/worker/verification" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Verification
              </Link>
              <Link href="/worker/schedule" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Schedule
              </Link>
              <Link href="/worker/availability" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Availability
              </Link>
              <Link href="/worker/earnings" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Earnings
              </Link>
              <Link href="/worker/reviews" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Reviews
              </Link>
              <Link href="/worker/welfare" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Welfare
              </Link>
              <Link href="/worker/register" className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap">
                Registration Wizard
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <WorkerDashboardView />
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
