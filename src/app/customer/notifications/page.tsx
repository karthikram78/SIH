'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Check,
  Star,
  ArrowRight,
} from 'lucide-react';

export default function CustomerNotificationsPage() {
  const { notifications, markNotificationRead } = useApp();

  const customerNotifs = notifications.filter(
    (n) => n.targetRole === 'customer' || !n.targetRole
  );

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Notifications</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Real-time booking milestones, worker arrival alerts, and payment receipts.
              </p>
            </div>

            <button
              onClick={() => customerNotifs.forEach((n) => markNotificationRead(n.id))}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 transition"
            >
              Mark All as Read
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {customerNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-5 flex items-start gap-4 transition cursor-pointer hover:bg-slate-50 ${
                  notif.read ? 'opacity-70 bg-white' : 'bg-amber-50/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{notif.title}</span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                      )}
                    </h3>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}

            {customerNotifs.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-xs">
                No notifications to display.
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
