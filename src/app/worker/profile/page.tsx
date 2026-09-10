'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Building,
  Save,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Star,
} from 'lucide-react';

export default function WorkerProfilePage() {
  const { currentWorker, updateWorkerProfile } = useApp();

  const [name, setName] = useState(currentWorker.name);
  const [headline, setHeadline] = useState(currentWorker.headline);
  const [bio, setBio] = useState(currentWorker.bio);
  const [hourlyRate, setHourlyRate] = useState(currentWorker.baseChargePerHour);
  const [experienceYears, setExperienceYears] = useState(currentWorker.experienceYears);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(currentWorker.serviceRadiusKm);
  const [savedMsg, setSavedMsg] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedRate = Number(hourlyRate);
    if (!Number.isFinite(validatedRate) || validatedRate < 50 || validatedRate > 10000) {
      setErrorMsg('Hourly charge must be between ₹50 and ₹10,000.');
      return;
    }

    setErrorMsg('');
    await updateWorkerProfile(currentWorker.id, {
      name,
      headline,
      bio,
      baseChargePerHour: Math.round(validatedRate),
      experienceYears: Number(experienceYears),
      serviceRadiusKm: Number(serviceRadiusKm),
    });

    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Worker Profile</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Your public artisan profile visible to customers and your affiliated cooperative.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4-Point Verified</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
              <img
                src={currentWorker.avatar}
                alt={currentWorker.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <div>
                <h2 className="text-xl font-black text-slate-900">{name}</h2>
                <p className="text-xs font-bold text-amber-700">{currentWorker.primaryCategory} Specialist</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>Cooperative: <strong>{currentWorker.cooperativeName}</strong></span>
                </p>
              </div>
            </div>

            {savedMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Base Hourly Charge (₹)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min={50}
                    max={10000}
                    step={50}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Experience (Years)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Service Radius (km)</label>
                  <input
                    type="number"
                    value={serviceRadiusKm}
                    onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Registered Mobile</label>
                  <input
                    type="text"
                    value={currentWorker.mobile}
                    disabled
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Professional Bio</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800">Verified Skills</span>
                <div className="flex flex-wrap gap-2">
                  {currentWorker.skills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
