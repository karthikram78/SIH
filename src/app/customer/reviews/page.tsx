'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function CustomerReviewsPage() {
  const { reviews, serviceRequests, currentUser, submitReview } = useApp();

  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);

  // Completed jobs by this customer
  const completedJobs = useMemo(() => {
    return serviceRequests.filter(
      (r) => r.customerId === currentUser.id && (r.status === 'completed' || r.status === 'paid')
    );
  }, [serviceRequests, currentUser.id]);

  // Existing reviews by this customer
  const customerReviews = useMemo(() => {
    return reviews.filter((rev) => rev.customerId === currentUser.id);
  }, [reviews, currentUser.id]);

  // Jobs that still need a review
  const pendingReviewJobs = useMemo(() => {
    const reviewedJobIds = new Set(customerReviews.map((r) => r.serviceRequestId));
    return completedJobs.filter((j) => !reviewedJobIds.has(j.id));
  }, [completedJobs, customerReviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) return;
    submitReview(selectedRequestId, rating, comment || 'Highly professional, punctual, and well-skilled.');
    setSubmittedMsg('Thank you! Your verified community rating has been recorded and the artisan’s rating updated.');
    setSelectedRequestId('');
    setComment('');
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Ratings & Reviews</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Leave authentic, cooperative-verified feedback for workers who completed your service requests.
            </p>
          </div>

          {/* Pending Review Section if any */}
          {pendingReviewJobs.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Pending Reviews ({pendingReviewJobs.length} completed jobs)</span>
              </div>

              {submittedMsg && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submittedMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4 bg-white p-6 rounded-2xl border border-amber-200">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Select Completed Service</label>
                  <select
                    value={selectedRequestId}
                    onChange={(e) => setSelectedRequestId(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Choose a completed booking to rate --</option>
                    {pendingReviewJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.category} by {j.workerName} ({new Date(j.createdAt).toLocaleDateString()}) - ₹{j.amount}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Star Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating} Stars</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Written Feedback</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share how the worker did (punctuality, skill, cleanliness)..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                >
                  Submit Verified Review
                </button>
              </form>
            </div>
          )}

          {/* Past Submitted Reviews */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Your Past Reviews ({customerReviews.length})</h2>

            <div className="space-y-4">
              {customerReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{rev.workerName}</span>
                      <span className="text-[10px] text-slate-500 ml-2">({rev.category})</span>
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
                  <p className="text-xs text-slate-600 italic">&quot;{rev.comment}&quot;</p>
                  <span className="text-[10px] text-slate-400 block">{rev.createdAt}</span>
                </div>
              ))}

              {customerReviews.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  You haven&apos;t written any reviews yet. Complete a job to share verified community feedback.
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
