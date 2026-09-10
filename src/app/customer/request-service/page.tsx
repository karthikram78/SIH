'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { AIServiceAnalysis } from '@/types';
import { analyzeServiceRequest } from '@/lib/aiServiceParser';
import {
  Sparkles,
  MapPin,
  Wrench,
  Clock,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
} from 'lucide-react';

export default function RequestServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Plumbing';
  const initialEmergency = searchParams.get('emergency') === 'true';

  const {
    serviceCategories,
    userLocation,
    workers,
    createServiceRequest,
    currentUser,
  } = useApp();

  const [category, setCategory] = useState(initialCategory);
  const [skill, setSkill] = useState('');
  const [problem, setProblem] = useState(initialEmergency ? 'URGENT: Emergency roadside/household breakdown' : 'Kitchen tap is leaking and pipe needs replacement');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'emergency'>(initialEmergency ? 'emergency' : 'medium');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIServiceAnalysis | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Available skills based on category
  const activeCategory = serviceCategories.find((c) => c.name.toLowerCase() === category.toLowerCase()) || serviceCategories[0];

  useEffect(() => {
    if (activeCategory && activeCategory.skills.length > 0 && !skill) {
      setSkill(activeCategory.skills[0]);
    }
  }, [activeCategory, skill]);

  const handleAIAnalyze = async () => {
    if (!problem.trim()) return;
    setAiAnalyzing(true);
    try {
      const res = analyzeServiceRequest(problem);
      setAiResult(res);
      setCategory(res.detectedService);
      setSkill(res.requiredSkill);
      setUrgency(res.urgency);
    } catch {
      // Fallback
    } finally {
      setAiAnalyzing(false);
    }
  };

  const estimatedAmount = activeCategory ? activeCategory.basePrice : 400;
  const workerCut = Math.round(estimatedAmount * 0.85);
  const coopCut = Math.round(estimatedAmount * 0.10);
  const platformCut = Math.round(estimatedAmount * 0.05);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const req = await createServiceRequest({
        category,
        skill: skill || (activeCategory?.skills[0] || category),
        problem,
        urgency,
        isEmergency: urgency === 'emergency',
        amount: estimatedAmount,
        matchScore: 94,
        matchReasons: ['Skill match', 'Geographic proximity', 'Cooperative vetted'],
      });
      router.push(`/customer/bookings/${req.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>AI-Assisted Dispatch</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mt-2">Request a Cooperative Service</h1>
              <p className="text-sm text-slate-600 mt-1">
                Describe your requirement or let our AI automatically map the exact trade skill and nearest available worker.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              {/* Step 1: Natural Language Problem Description */}
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-900 flex items-center justify-between">
                  <span>Describe the problem / requirement</span>
                  <span className="text-xs font-normal text-slate-500">Plain English or தமிழ்</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g. My bathroom tap is leaking or My bike tyre is punctured..."
                    className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAIAnalyze}
                    disabled={aiAnalyzing || !problem.trim()}
                    className="absolute right-3 bottom-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{aiAnalyzing ? 'Analyzing...' : 'Auto-Classify with AI'}</span>
                  </button>
                </div>

                {/* AI Result Card */}
                {aiResult && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 animate-in fade-in">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>AI Classification: {aiResult.detectedService} ({aiResult.requiredSkill})</span>
                    </div>
                    <p className="text-slate-600">{aiResult.reasoning}</p>
                  </div>
                )}
              </div>

              {/* Step 2: Category & Skill */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Trade Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const cat = serviceCategories.find((c) => c.name === e.target.value);
                      if (cat && cat.skills[0]) setSkill(cat.skills[0]);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  >
                    {serviceCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} ({cat.group})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Specific Skill Required</label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  >
                    {activeCategory?.skills.map((s, idx) => (
                      <option key={idx} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Urgency Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Urgency Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['low', 'medium', 'high', 'emergency'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`p-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                        urgency === lvl
                          ? lvl === 'emergency'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md animate-pulse'
                            : 'bg-amber-600 text-white border-amber-600 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl === 'emergency' && '🚨 '}
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Location confirmation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Service Address (Auto-Detected GPS)</span>
                  <p className="text-slate-600 mt-0.5">{userLocation.address}, {userLocation.city} - {userLocation.pincode}</p>
                </div>
              </div>

              {/* Step 5: Transparent Pricing Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold">Estimated Statutory Amount</span>
                  </div>
                  <span className="text-lg font-black text-amber-400">₹{estimatedAmount}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block">Worker (85%)</span>
                    <span className="font-bold text-emerald-400">₹{workerCut}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block">Coop Welfare (10%)</span>
                    <span className="font-bold text-amber-400">₹{coopCut}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block">Platform (5%)</span>
                    <span className="font-bold text-slate-300">₹{platformCut}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-sm shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Dispatching Request...' : 'Confirm & Request Verified Worker'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
