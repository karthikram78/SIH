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
  AlertCircle,
  IndianRupee,
  Activity,
  Heart,
  FileText,
  BadgePercent,
} from 'lucide-react';

export default function WorkerWelfarePage() {
  const { currentWorker } = useApp();

  const welfareBenefits = [
    {
      title: 'Group Accident Insurance (Demo)',
      status: 'Active Coverage',
      coverage: '₹5,00,000 Sum Insured',
      desc: 'Provided through cooperative welfare fund accumulation (10% job contribution). Covers on-duty accidents, hospitalization and disability.',
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Artisan Health & Maternity Support (Demo)',
      status: 'Eligible',
      coverage: 'Up to ₹50,000 / year',
      desc: 'Annual health checkup reimbursement and emergency family medical assistance managed by cooperative committee.',
      icon: Heart,
      color: 'bg-rose-100 text-rose-700',
    },
    {
      title: 'Micro-Pension & Thrift Fund (Demo)',
      status: 'Enrolled',
      coverage: '₹14,250 Accumulated Balance',
      desc: 'Cooperative savings scheme accumulating interest for retirement and skill acquisition grants.',
      icon: Activity,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Tool Upgrade & Modernization Loan (Demo)',
      status: 'Eligible',
      coverage: '0% Interest up to ₹25,000',
      desc: 'Special credit line for purchasing certified safety equipment, drills, diagnostic multimeters, and toolboxes.',
      icon: BadgePercent,
      color: 'bg-amber-100 text-amber-700',
    },
  ];

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Cooperative Welfare & Social Security
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Institutional protections funded by the 10% statutory contribution from every completed job.
              </p>
            </div>

            <div className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200">
              Cooperative: <strong>{currentWorker.cooperativeName}</strong>
            </div>
          </div>

          {/* Welfare Account Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Member Welfare Account #TN-COOP-{currentWorker.id.slice(0, 6).toUpperCase()}</h2>
                <span className="text-xs text-emerald-300 font-semibold">Tier-1 Active Good Standing Member</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Welfare Status</span>
                <span className="text-emerald-400 font-bold text-sm mt-0.5 block">Full Coverage Active</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Completed Jobs</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{currentWorker.completedJobsCount} Verified Jobs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total 10% Contributed</span>
                <span className="text-amber-400 font-bold text-sm mt-0.5 block">₹1,850</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Welfare Benefits Claimed</span>
                <span className="text-slate-200 font-bold text-sm mt-0.5 block">₹0 (Zero claims)</span>
              </div>
            </div>
          </div>

          {/* Welfare Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {welfareBenefits.map((b, idx) => {
              const IconComp = b.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${b.color} flex items-center justify-center`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                    <p className="text-xs font-bold text-slate-800">{b.coverage}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                  </div>

                  <button
                    onClick={() => alert(`Welfare Claim Request Form (Demo Simulation) initiated for ${b.title}.`)}
                    className="mt-2 py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition self-start"
                  >
                    Submit Assistance Request
                  </button>
                </div>
              );
            })}
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
