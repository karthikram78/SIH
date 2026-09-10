'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  Briefcase,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Building,
} from 'lucide-react';

export default function WorkerNotificationsPage() {
  const { notifications, markNotificationRead } = useApp();

  const workerNotifs = notifications.filter(
    (n) => n.targetRole === 'worker' || !n.targetRole
  );

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Worker Alerts & Notifications</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Real-time job dispatch notifications, payment credits, and cooperative notices.
              </p>
            </div>

            <button
              onClick={() => workerNotifs.forEach((n) => markNotificationRead(n.id))}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 transition"
            >
              Mark All as Read
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {workerNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-5 flex items-start gap-4 transition cursor-pointer hover:bg-slate-50 ${
                  notif.read ? 'opacity-70 bg-white' : 'bg-emerald-50/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {notif.type === 'job' && <Briefcase className="w-4 h-4 text-blue-600" />}
                  {notif.type === 'verification' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  {notif.type === 'payment' && <CreditCard className="w-4 h-4 text-amber-600" />}
                  {notif.type === 'alert' && <AlertCircle className="w-4 h-4 text-purple-600" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{notif.title}</span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      )}
                    </h3>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}

            {workerNotifs.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-xs">
                No worker notifications to display.
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
