'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WorkerRegistrationWizard } from '@/components/worker/WorkerRegistrationWizard';
import { ShieldCheck, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WorkerRegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <Link
          href="/worker/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Worker Dashboard</span>
        </Link>

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ministry of Cooperation Onboarding Standard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Independent Worker & Artisan Registration</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Join a registered artisan cooperative in Tamil Nadu. Enjoy fair wages (85% net direct earnings), social security, and verified digital dispatch.
          </p>
        </div>

        <WorkerRegistrationWizard onComplete={() => router.push('/worker/verification')} />
      </main>

      <Footer />
    </div>
  );
}
