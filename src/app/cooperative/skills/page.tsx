'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Wrench,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
} from 'lucide-react';

export default function CooperativeSkillsPage() {
  const { serviceCategories, workers } = useApp();

  const workshops = [
    {
      title: 'Advanced Inverter & Solar Pump Servicing',
      trade: 'Electrical',
      date: 'Sept 15, 2026',
      enrolled: 18,
      status: 'Upcoming',
    },
    {
      title: 'Modern PEX Piping & Pressure Leak Diagnostics',
      trade: 'Plumbing',
      date: 'Sept 22, 2026',
      enrolled: 24,
      status: 'Upcoming',
    },
    {
      title: 'Electric Two-Wheeler Battery Diagnostics & Motor Repair',
      trade: 'Mechanic',
      date: 'Oct 05, 2026',
      enrolled: 15,
      status: 'Registration Open',
    },
  ];

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Skills Registry & Vocational Training
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Cooperative upskilling programs, trade certification records, and technician capacity building.
              </p>
            </div>

            <button
              onClick={() => alert('New training program creator modal simulated.')}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Workshop</span>
            </button>
          </div>

          {/* Training Workshops */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Active & Scheduled Cooperative Workshops</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workshops.map((w, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {w.trade}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{w.title}</h3>
                  <div className="text-xs text-slate-500 pt-1">
                    <span>Date: {w.date}</span>
                    <span className="block mt-0.5">Enrolled Artisans: <strong>{w.enrolled} members</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Skill Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Cooperative Trade Competency Matrix</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceCategories.slice(0, 6).map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {cat.skills.length} Skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
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
