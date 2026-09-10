'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Award,
  Phone,
  Mail,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';

export default function SingleWorkerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params?.id as string;
  const { workers, createServiceRequest, userLocation } = useApp();

  const worker = useMemo(() => {
    return workers.find((w) => w.id === workerId) || workers[0];
  }, [workers, workerId]);

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-sm font-bold text-slate-700">Worker profile not found.</p>
        <Link href="/customer/nearby-workers" className="mt-4 text-xs font-bold text-amber-600 underline">
          Return to Nearby Workers
        </Link>
      </div>
    );
  }

  const handleBookWorker = async () => {
    const req = await createServiceRequest({
      category: worker.primaryCategory,
      skill: worker.skills[0] || worker.primaryCategory,
      problem: `Requested verified service directly with ${worker.name}`,
      urgency: 'medium',
      workerId: worker.id,
      amount: worker.baseChargePerHour,
      matchScore: 96,
      matchReasons: ['Direct customer request', '4-point cooperative verification complete'],
    });
    router.push(`/customer/bookings/${req.id}`);
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Back button */}
          <Link
            href="/customer/nearby-workers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Nearby Workers</span>
          </Link>

          {/* Profile Card Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{worker.name}</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-amber-700 mt-0.5">{worker.headline}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Member of <strong>{worker.cooperativeName}</strong></span>
                  </p>
                </div>
              </div>

              <div className="text-right w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-medium block">Statutory Hourly Rate</span>
                <div className="text-2xl font-black text-slate-900 flex items-center justify-end">
                  <IndianRupee className="w-4 h-4 text-amber-600" />
                  <span>{worker.baseChargePerHour}</span>
                  <span className="text-xs text-slate-400 font-normal ml-1">/ hr</span>
                </div>
                <button
                  onClick={handleBookWorker}
                  className="mt-3 w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Book Service Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[11px] text-slate-400 block font-medium">Rating</span>
                <div className="flex items-center justify-center gap-1 text-base font-black text-slate-900 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{worker.rating}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[11px] text-slate-400 block font-medium">Experience</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{worker.experienceYears} Years</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[11px] text-slate-400 block font-medium">Completed Jobs</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{worker.completedJobsCount} Jobs</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[11px] text-slate-400 block font-medium">Availability</span>
                <span className="text-xs font-black uppercase text-emerald-700 mt-1 block">
                  ● {worker.availability}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Point Verification Checklist */}
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4">
            <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Institutional Cooperative 4-Point Verification</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Identity ✓</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Skill Proof ✓</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Workplace Audit ✓</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mobile OTP ✓</span>
              </div>
            </div>
          </div>

          {/* Bio & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900">About Artisan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{worker.bio}</p>
              <div className="pt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Location:</span> {worker.location.address}, {worker.location.city}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900">Verified Skills & Services</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {worker.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Shop / Workplace details if available */}
          {worker.shop && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Physical Workshop / Shop</h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={worker.shop.photoUrl}
                  alt={worker.shop.name}
                  className="w-full sm:w-48 h-32 rounded-2xl object-cover border border-slate-200"
                />
                <div className="space-y-1 text-xs">
                  <h4 className="text-base font-bold text-slate-900">{worker.shop.name}</h4>
                  <p className="text-slate-600">{worker.shop.address}</p>
                  <p className="text-slate-500">Established: {worker.shop.establishedYear}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Physically Inspected by Cooperative Field Officer
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
