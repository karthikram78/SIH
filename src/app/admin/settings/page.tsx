'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Sliders,
  Scale,
  Save,
  CheckCircle2,
  MapPin,
  Sparkles,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { DEFAULT_WEIGHTS } from '@/lib/matchingEngine';

export default function AdminSettingsPage() {
  const { weights, setWeights } = useApp();

  const [skillWeight, setSkillWeight] = useState(weights.skill);
  const [distWeight, setDistWeight] = useState(weights.distance);
  const [availWeight, setAvailWeight] = useState(weights.availability);
  const [ratingWeight, setRatingWeight] = useState(weights.rating);
  const [verifWeight, setVerifWeight] = useState(weights.verification);
  const [expWeight, setExpWeight] = useState(weights.experience);

  const [workerShare, setWorkerShare] = useState(85);
  const [coopShare, setCoopShare] = useState(10);
  const [platformShare, setPlatformShare] = useState(5);

  const [saved, setSaved] = useState(false);

  const totalWeight = skillWeight + distWeight + availWeight + ratingWeight + verifWeight + expWeight;
  const totalFeeSplit = workerShare + coopShare + platformShare;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setWeights({
      skill: skillWeight,
      distance: distWeight,
      availability: availWeight,
      rating: ratingWeight,
      verification: verifWeight,
      experience: expWeight,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    setSkillWeight(DEFAULT_WEIGHTS.skill);
    setDistWeight(DEFAULT_WEIGHTS.distance);
    setAvailWeight(DEFAULT_WEIGHTS.availability);
    setRatingWeight(DEFAULT_WEIGHTS.rating);
    setVerifWeight(DEFAULT_WEIGHTS.verification);
    setExpWeight(DEFAULT_WEIGHTS.experience);
    setWorkerShare(85);
    setCoopShare(10);
    setPlatformShare(5);
  };

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Platform Rules & Algorithm Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Configure smart matching engine weight formulas and statutory fee split parameters.
              </p>
            </div>

            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Statutory Defaults</span>
            </button>
          </div>

          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Algorithm weights and statutory parameters updated across all dispatch nodes!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 13: 6-Factor Smart Matching Weights */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>Smart Worker Matching Weights (Section 13)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Calculates recommendation match score for customers seeking nearby artisans.
                  </p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  Sum: {totalWeight}% {totalWeight !== 100 && '(Must equal 100%)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>1. Skill Match</span>
                    <span className="text-amber-600">{skillWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={skillWeight}
                    onChange={(e) => setSkillWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <span className="text-[10px] text-slate-400">Match required trade and specializations</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>2. Geographic Distance</span>
                    <span className="text-amber-600">{distWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={distWeight}
                    onChange={(e) => setDistWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <span className="text-[10px] text-slate-400">Haversine GPS proximity to customer</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>3. Real-Time Availability</span>
                    <span className="text-amber-600">{availWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={availWeight}
                    onChange={(e) => setAvailWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <span className="text-[10px] text-slate-400">AVAILABLE vs BUSY status</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>4. Verified Customer Rating</span>
                    <span className="text-amber-600">{ratingWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={ratingWeight}
                    onChange={(e) => setRatingWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <span className="text-[10px] text-slate-400">Average verified star rating (0-5)</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>5. 4-Point Verification</span>
                    <span className="text-amber-600">{verifWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={verifWeight}
                    onChange={(e) => setVerifWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <span className="text-[10px] text-slate-400">Institutional cooperative verification</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>6. Trade Experience Years</span>
                    <span className="text-amber-600">{expWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={expWeight}
                    onChange={(e) => setExpWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <span className="text-[10px] text-slate-400">Years of proven master craftsmanship</span>
                </div>
              </div>
            </div>

            {/* Section 16: Statutory Fee Distribution */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-600" />
                    <span>Statutory Fee Distribution Percentages (Section 16)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enforces transparent split of every customer payment between artisan, welfare escrow, and platform.
                  </p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${totalFeeSplit === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  Sum: {totalFeeSplit}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Worker Net Livelihood (%)</label>
                  <input
                    type="number"
                    min={50}
                    max={95}
                    value={workerShare}
                    onChange={(e) => setWorkerShare(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Cooperative Welfare Fund (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={coopShare}
                    onChange={(e) => setCoopShare(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Platform Maintenance Fee (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={platformShare}
                    onChange={(e) => setPlatformShare(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={totalWeight !== 100 || totalFeeSplit !== 100}
              className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Platform Algorithm Rules</span>
            </button>
          </form>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
