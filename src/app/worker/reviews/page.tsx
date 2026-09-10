'use client';

import React, { useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

export default function WorkerReviewsPage() {
  const { currentWorker, reviews } = useApp();

  const workerReviews = useMemo(() => {
    return reviews.filter(
      (r) => r.workerId === currentWorker.id || r.workerName === currentWorker.name
    );
  }, [reviews, currentWorker.id, currentWorker.name]);

  return (
    <RoleGuard allowedRoles={['worker', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Customer Ratings & Reviews</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Authentic feedback from verified customers who completed service bookings with you.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-4 py-2 rounded-2xl">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-black text-slate-900">{currentWorker.rating}</span>
              <span className="text-xs text-slate-500 font-medium">/ 5.0 Rating</span>
            </div>
          </div>

          {/* Rating Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-around gap-6 text-center sm:text-left">
            <div>
              <div className="text-4xl font-black text-slate-900">{currentWorker.rating}</div>
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Based on {workerReviews.length + 12} jobs</span>
            </div>

            <div className="space-y-1 text-xs w-full max-w-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-500 text-right">5 Star</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[90%]"></div>
                </div>
                <span className="w-8 text-slate-400">90%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-500 text-right">4 Star</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[8%]"></div>
                </div>
                <span className="w-8 text-slate-400">8%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-500 text-right">3 Star</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[2%]"></div>
                </div>
                <span className="w-8 text-slate-400">2%</span>
              </div>
            </div>
          </div>

          {/* Reviews Feed */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Recent Customer Reviews</h2>

            <div className="space-y-3 divide-y divide-slate-100">
              {workerReviews.map((rev) => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                      <span className="text-[10px] text-slate-400 ml-2">{rev.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">&quot;{rev.comment}&quot;</p>
                  <span className="text-[10px] text-slate-400 block">{rev.createdAt}</span>
                </div>
              ))}

              {workerReviews.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No written reviews on record yet. Complete your first customer request to receive ratings.
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
