'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { AvailabilityStatus } from '@/types';
import {
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  Save,
  Radio,
  Sliders,
} from 'lucide-react';

export default function WorkerAvailabilityPage() {
  const { currentWorker, setWorkerAvailability } = useApp();

  const [availability, setAvailability] = useState<AvailabilityStatus>(currentWorker.availability);
  const [emergencyStandby, setEmergencyStandby] = useState(true);
  const [radiusKm, setRadiusKm] = useState(currentWorker.serviceRadiusKm || 8);
  const [startHour, setStartHour] = useState('08:00');
  const [endHour, setEndHour] = useState('20:00');
  const [saved, setSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkerAvailability(currentWorker.id, availability);
    currentWorker.serviceRadiusKm = radiusKm;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Work Availability Settings</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Control when you receive new jobs, your travel zone radius, and emergency standby preferences.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {saved && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Availability status & radius saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Status Radio Buttons (AVAILABLE, BUSY, OFFLINE) */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 block">Current Dispatch Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAvailability('available')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      availability === 'available'
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-sm font-bold text-slate-900">AVAILABLE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Ready to receive nearby customer bookings.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvailability('busy')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      availability === 'busy'
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-sm font-bold text-slate-900">BUSY</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Currently working on a job. No new alerts.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvailability('offline')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      availability === 'offline'
                        ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                      <span className="text-sm font-bold text-slate-900">OFFLINE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Off-duty. Profile will not appear in radar.</p>
                  </button>
                </div>
              </div>

              {/* Service Radius */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900">Maximum Service Radius</label>
                  <span className="text-sm font-black text-amber-600">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-xs text-slate-400">
                  Customers beyond {radiusKm} km from your registered shop in {currentWorker.location.city} will see lower match proximity scores.
                </p>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Daily Shift Start Time</label>
                  <input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Daily Shift End Time</label>
                  <input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Emergency Standby Duty Toggle */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Emergency On-Call Standby</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Receive 🚨 Need Help Now emergency broadcasts (puncture, water leakage, wire short) with emergency surcharge.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emergencyStandby}
                  onChange={(e) => setEmergencyStandby(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Availability Preferences</span>
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
