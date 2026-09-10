'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { AI_DEMAND_FORECASTS } from '@/lib/demandForecast';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  MapPin,
  BellRing,
  CheckCircle2,
  Scale,
  ArrowRight,
} from 'lucide-react';

export default function CooperativeDemandForecastPage() {
  const [broadcastSent, setBroadcastSent] = useState(false);

  const allocationData = [
    {
      area: 'Central Chennai (T. Nagar)',
      trade: 'Plumbing',
      demand: 'High',
      available: 3,
      recommended: 5,
      shortage: 2,
      recommendation: 'Move/encourage 2 additional plumbers from Guindy cluster to this service area.',
    },
    {
      area: 'Anna Nagar West',
      trade: 'Electrical',
      demand: 'Very High',
      available: 4,
      recommended: 7,
      shortage: 3,
      recommendation: 'Notify 3 idle electricians in Shenoy Nagar to switch status to AVAILABLE.',
    },
    {
      area: 'Adyar & Besant Nagar',
      trade: 'Carpentry',
      demand: 'Normal',
      available: 4,
      recommended: 4,
      shortage: 0,
      recommendation: 'Capacity balanced. Maintain existing shifts.',
    },
    {
      area: 'Velachery Bypass',
      trade: 'Mechanic & Puncture',
      demand: 'High',
      available: 2,
      recommended: 4,
      shortage: 2,
      recommendation: 'Deploy 2 mobile repair units along arterial flyover corridor during peak rush hours.',
    },
  ];

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <RoleGuard allowedRoles={['cooperative_admin', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Prototype Predictive Intelligence (SIH26089)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                AI Service Demand Forecasting & Workforce Allocation
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Analyzes historical service requests, regional weather signals, and traffic trends to prevent artisan shortages.
              </p>
            </div>

            <button
              onClick={handleBroadcast}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
            >
              <BellRing className="w-4 h-4" />
              <span>Broadcast Allocation SMS</span>
            </button>
          </div>

          {broadcastSent && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Workforce mobilization alert dispatched to 8 idle member artisans via Cooperative SMS Gateway!</span>
            </div>
          )}

          {/* AI Forecast Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AI_DEMAND_FORECASTS.map((fc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {fc.urgencyNotice}
                    </span>
                    <span className="text-sm font-black text-emerald-600">{fc.predictedDemandChange}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{fc.category}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{fc.reason}</p>

                  <div className="pt-2 text-[11px] text-slate-500">
                    <strong className="text-slate-800">Affected Zones:</strong> {fc.affectedZones.join(', ')}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 bg-amber-50/70 p-3 rounded-2xl text-[11px] text-amber-950 font-medium space-y-1">
                  <strong className="block text-amber-900">Cooperative Recommendation:</strong>
                  <span>{fc.recommendedAction}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Section 22: Workforce Allocation System */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Workforce Allocation Balance Sheet</h2>
              <p className="text-xs text-slate-500">
                Identifies real-time artisan shortages across Chennai municipal wards and recommends proactive member re-routing.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5">Service Area / Ward</th>
                    <th className="p-3.5">Trade</th>
                    <th className="p-3.5">Demand Level</th>
                    <th className="p-3.5 text-center">Available</th>
                    <th className="p-3.5 text-center">Recommended</th>
                    <th className="p-3.5 text-center">Shortage</th>
                    <th className="p-3.5">Reallocation Directive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allocationData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{row.area}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{row.trade}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.demand === 'Very High' || row.demand === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {row.demand}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-700">{row.available}</td>
                      <td className="p-3.5 text-center font-bold text-slate-900">{row.recommended}</td>
                      <td className="p-3.5 text-center font-bold">
                        {row.shortage > 0 ? (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">-{row.shortage}</span>
                        ) : (
                          <span className="text-emerald-600">0</span>
                        )}
                      </td>
                      <td className="p-3.5 text-xs text-slate-600 max-w-xs">{row.recommendation}</td>
                    </tr>
                  ))}
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
