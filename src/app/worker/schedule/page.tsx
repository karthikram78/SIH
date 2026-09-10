'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function WorkerSchedulePage() {
  const { currentWorker, serviceRequests } = useApp();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState('Today (Wednesday)');

  const timeSlots = [
    { time: '09:00 AM - 11:00 AM', status: 'Booked', task: 'Pipe Leakage Fix (T. Nagar)', customer: 'Priya Sharma' },
    { time: '11:30 AM - 01:00 PM', status: 'Available', task: 'Open for booking', customer: '' },
    { time: '02:00 PM - 03:30 PM', status: 'Available', task: 'Open for booking', customer: '' },
    { time: '04:00 PM - 06:00 PM', status: 'Booked', task: 'Drain Cleaning (Mylapore)', customer: 'R. Balasubramanian' },
    { time: '06:30 PM - 08:00 PM', status: 'Emergency Duty', task: 'Cooperative On-Call Duty', customer: 'Standby' },
  ];

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Work Schedule & Slots</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage your daily availability slots, assigned jobs, and cooperative standby duty.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200">
                Weekly Total: <strong>32 Working Hours</strong>
              </span>
            </div>
          </div>

          {/* Days bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['Today (Wed)', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'].map((d, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                  selectedDay === d
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Slots List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50/70 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-600" />
                <span>Schedule for {selectedDay}</span>
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">Standard Hours: 09:00 AM - 08:00 PM</span>
            </div>

            {timeSlots.map((slot, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">{slot.time}</span>
                    <span className="text-xs text-slate-600">{slot.task}</span>
                    {slot.customer && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Client: {slot.customer}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      slot.status === 'Booked'
                        ? 'bg-amber-100 text-amber-800'
                        : slot.status === 'Emergency Duty'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {slot.status}
                  </span>
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
