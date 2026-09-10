'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Wrench,
  Plus,
  IndianRupee,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function AdminServicesPage() {
  const { serviceCategories } = useApp();

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Service Categories & Skills</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Configure approved trade sectors, baseline tariffs, and recognized skill specializations.
              </p>
            </div>

            <button
              onClick={() => alert('Add New Category Dialog (Demo) opened.')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Trade Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-700">
                      {cat.group}
                    </span>
                    <span className="text-xs font-black text-amber-700">₹{cat.basePrice} base</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Approved Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => alert(`Edit category ${cat.name} (Demo)`)}
                    className="p-2 text-slate-500 hover:text-slate-900 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
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
