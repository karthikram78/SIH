'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function CustomerBookingsPage() {
  const { serviceRequests, currentUser } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const customerRequests = useMemo(() => {
    return serviceRequests.filter((r) => r.customerId === currentUser.id);
  }, [serviceRequests, currentUser.id]);

  const filtered = useMemo(() => {
    if (filter === 'active') {
      return customerRequests.filter((r) => !['completed', 'paid', 'cancelled'].includes(r.status));
    }
    if (filter === 'completed') {
      return customerRequests.filter((r) => ['completed', 'paid'].includes(r.status));
    }
    if (filter === 'cancelled') {
      return customerRequests.filter((r) => r.status === 'cancelled');
    }
    return customerRequests;
  }, [customerRequests, filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Requested</span>;
      case 'accepted':
      case 'navigating':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">On The Way</span>;
      case 'arrived':
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">In Progress</span>;
      case 'completed':
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Service Bookings</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Track live status, verify completion with security OTP, and review past service history.
              </p>
            </div>

            <Link
              href="/customer/request-service"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+ Request New Service</span>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {(['all', 'active', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                  filter === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab} ({
                  tab === 'all'
                    ? customerRequests.length
                    : tab === 'active'
                    ? customerRequests.filter((r) => !['completed', 'paid', 'cancelled'].includes(r.status)).length
                    : tab === 'completed'
                    ? customerRequests.filter((r) => ['completed', 'paid'].includes(r.status)).length
                    : customerRequests.filter((r) => r.status === 'cancelled').length
                })
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-900">{req.category}</span>
                    {getStatusBadge(req.status)}
                    {req.isEmergency && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                        🚨 Emergency
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{req.problem}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>Artisan: <strong className="text-slate-700">{req.workerName}</strong></span>
                    <span>•</span>
                    <span>Created: <strong>{new Date(req.createdAt).toLocaleDateString()}</strong></span>
                    {req.verificationOtp && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">OTP: {req.verificationOtp}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Statutory Fee</span>
                    <div className="text-base font-black text-slate-900 flex items-center justify-end">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                      <span>{req.amount}</span>
                    </div>
                  </div>

                  <Link
                    href={`/customer/bookings/${req.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Track / Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No bookings in this category</h3>
                <p className="text-xs text-slate-500">Need household or vehicle repairs? Request a verified worker now.</p>
                <Link
                  href="/customer/request-service"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md"
                >
                  <span>Request a Service</span>
                </Link>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
