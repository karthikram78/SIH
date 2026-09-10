'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { ActiveJobTracker } from '@/components/customer/ActiveJobTracker';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';

export default function SingleBookingTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;
  const { serviceRequests } = useApp();

  const request = useMemo(() => {
    return serviceRequests.find((r) => r.id === bookingId);
  }, [serviceRequests, bookingId]);

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Link
            href="/customer/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Bookings</span>
          </Link>

          {request ? (
            <ActiveJobTracker request={request} />
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h2 className="text-lg font-bold text-slate-900">Booking #{bookingId} Not Found</h2>
              <p className="text-xs text-slate-500">The requested booking record does not exist or has been removed.</p>
              <Link
                href="/customer/bookings"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <span>View My Bookings</span>
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
