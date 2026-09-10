'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Building,
  ShieldCheck,
  Users,
  Briefcase,
  IndianRupee,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function AdminCooperativesPage() {
  const { cooperatives } = useApp();

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Cooperative Societies Registry</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Institutional artisan cooperatives registered under Tamil Nadu State Cooperative Societies Act.
              </p>
            </div>

            <button
              onClick={() => alert('Cooperative Onboarding Application Form (Demo) initiated.')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Cooperative Society</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cooperatives.map((coop) => (
              <div
                key={coop.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Building className="w-5 h-5" />
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                      {coop.registrationNumber}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{coop.name}</h3>
                  <p className="text-xs text-slate-500">
                    District: <strong>{coop.district}, {coop.state}</strong> • Est. {coop.establishedYear}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-medium">Members</span>
                    <span className="font-bold text-slate-800">{coop.membersCount} Artisans</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-medium">Welfare Balance</span>
                    <span className="font-bold text-emerald-700">₹{coop.welfareFundBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
