'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Briefcase,
  Store,
  FileCheck,
  CheckCircle2,
  Clock,
  Upload,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { WorkerDocument } from '@/types';

interface WorkerRegistrationWizardProps {
  onComplete?: () => void;
}

export const WorkerRegistrationWizard: React.FC<WorkerRegistrationWizardProps> = ({ onComplete }) => {
  const { registerWorker, cooperatives, serviceCategories, setCurrentRole } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: 'M. Senthil Nathan',
    mobile: '+91 94435 88123',
    email: 'senthil.electrician@example.com',
    address: '45, West Bouleward Road, Tiruchirappalli',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    // Step 2: Professional
    primaryCategory: 'Electrical',
    skills: ['Wiring Repair', 'Switchboard Repair', 'Fan Installation'],
    experienceYears: 6,
    serviceRadiusKm: 8,
    baseChargePerHour: 350,
    cooperativeId: 'coop-1',
    // Step 3: Shop
    hasShop: true,
    shopName: 'Nathan Electricals & Spares',
    shopAddress: '45, West Bouleward Road, Tiruchirappalli',
    shopPhotoUrl: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&auto=format&fit=crop&q=80',
    // Step 4: Documents uploaded state
    identityUploaded: true,
    skillUploaded: true,
    shopUploaded: true,
  });

  const [submittedWorkerId, setSubmittedWorkerId] = useState<string | null>(null);

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Create mock documents
      const docs: WorkerDocument[] = [
        {
          id: `doc-sub-1`,
          type: 'identity',
          name: 'Dummy Govt ID (Sample Aadhaar Redacted)',
          fileUrl: '/docs/sample_dummy_id.pdf',
          status: 'pending',
          uploadedAt: new Date().toISOString(),
          notes: 'Candidate submitted for platform verification',
        },
        {
          id: `doc-sub-2`,
          type: 'skill_certificate',
          name: 'Govt ITI Wireman Trade Certificate (Sample)',
          fileUrl: '/docs/sample_iti_cert.pdf',
          status: 'verified', // Pre-verified via cooperative tie-up
          uploadedAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'Trichy Cooperative Skill Committee',
          notes: 'Pre-vetted through National Skill Qualification Framework (NSQF)',
        },
        {
          id: `doc-sub-3`,
          type: 'shop_proof',
          name: 'Shop Corporation Registration (Sample)',
          fileUrl: '/docs/sample_shop_license.pdf',
          status: 'pending',
          uploadedAt: new Date().toISOString(),
        }
      ];

      const selectedCoop = cooperatives.find((c) => c.id === formData.cooperativeId);

      const registered = await registerWorker({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        avatar: formData.avatar,
        headline: `Certified ${formData.primaryCategory} Specialist`,
        bio: `${formData.experienceYears} years experienced local tradesperson. Member applicant with ${selectedCoop?.name || 'Cooperative Society'}.`,
        primaryCategory: formData.primaryCategory,
        skills: formData.skills,
        experienceYears: formData.experienceYears,
        serviceRadiusKm: formData.serviceRadiusKm,
        baseChargePerHour: formData.baseChargePerHour,
        cooperativeId: formData.cooperativeId,
        cooperativeName: selectedCoop?.name || 'Trichy Local Service Cooperative Society',
        documents: docs,
        shop: formData.hasShop ? {
          id: `shop-new`,
          name: formData.shopName,
          address: formData.shopAddress,
          photoUrl: formData.shopPhotoUrl,
          lat: 10.8271,
          lng: 78.6890,
          establishedYear: 2021,
          isShopVerified: false,
        } : undefined,
      });

      setSubmittedWorkerId(registered.id);
      setStep(5);
    }
  };

  const stepsHeader = [
    { num: 1, label: 'Personal', icon: <User className="w-4 h-4" /> },
    { num: 2, label: 'Trade & Skills', icon: <Briefcase className="w-4 h-4" /> },
    { num: 3, label: 'Workplace', icon: <Store className="w-4 h-4" /> },
    { num: 4, label: 'Documents', icon: <Upload className="w-4 h-4" /> },
    { num: 5, label: 'Verification', icon: <FileCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 md:p-8 text-white">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-saffron-500/20 text-saffron-400 border border-saffron-500/30">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
              Cooperative Onboarding
            </span>
            <h2 className="text-2xl font-black">Independent Worker Registration</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Join a certified local cooperative society, establish professional digital credentials, and receive local job bookings.
        </p>

        {/* Stepper Dots */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {stepsHeader.map((s) => (
            <div
              key={s.num}
              className={`p-2 rounded-xl border text-center transition-all ${
                step === s.num
                  ? 'bg-saffron-600 border-saffron-400 text-white'
                  : step > s.num
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-xs font-bold">
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 md:p-8">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-black text-slate-900">Step 1 — Personal Details</h3>
            <p className="text-xs text-slate-500">Provide your basic contact information and identity details.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number (For OTP)</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Affiliated Cooperative Society</label>
                <select
                  value={formData.cooperativeId}
                  onChange={(e) => setFormData({ ...formData, cooperativeId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                >
                  {cooperatives.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Details */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-black text-slate-900">Step 2 — Professional Skills</h3>
            <p className="text-xs text-slate-500">Define your primary service trade, skills, and service radius.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Trade Category</label>
                <select
                  value={formData.primaryCategory}
                  onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                >
                  {serviceCategories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.group})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 1 })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Operating Radius (km)</label>
                <input
                  type="number"
                  value={formData.serviceRadiusKm}
                  onChange={(e) => setFormData({ ...formData, serviceRadiusKm: parseInt(e.target.value) || 5 })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Base Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={formData.baseChargePerHour}
                  onChange={(e) => setFormData({ ...formData, baseChargePerHour: parseInt(e.target.value) || 300 })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Shop / Workplace Details */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-black text-slate-900">Step 3 — Shop / Workplace Details</h3>
            <p className="text-xs text-slate-500">
              Do you have a physical workshop or shop? If yes, provide details for customer trust verification.
            </p>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="hasShop"
                checked={formData.hasShop}
                onChange={(e) => setFormData({ ...formData, hasShop: e.target.checked })}
                className="w-4 h-4 text-saffron-600 rounded"
              />
              <label htmlFor="hasShop" className="text-xs font-bold text-slate-800">
                I operate a verified shop / workshop location
              </label>
            </div>

            {formData.hasShop && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shop / Workshop Name</label>
                  <input
                    type="text"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shop Address & Landmark</label>
                  <input
                    type="text"
                    value={formData.shopAddress}
                    onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Verification Documents (Dummy / Privacy Safe) */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-black text-slate-900">Step 4 — Verification Documents</h3>
            
            {/* Disclaimer Box required by Section 11 */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Prototype Demo Notice:</strong> Use sample/dummy documents only.
                Do NOT upload real Aadhaar numbers or government identity credentials. All uploaded documents are restricted to Admin audit and never visible to the public.
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">1. Identity Proof (Sample Govt ID)</div>
                  <div className="text-[11px] text-slate-500">sample_aadhaar_card_redacted.pdf (1.2 MB)</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  ✓ Uploaded (Dummy)
                </span>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">2. Trade / Skill Certification</div>
                  <div className="text-[11px] text-slate-500">iti_electrical_wireman_certificate.pdf (2.4 MB)</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  ✓ Uploaded (Dummy)
                </span>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">3. Shop / Municipal Business Proof</div>
                  <div className="text-[11px] text-slate-500">shop_trade_license_trichy.pdf (890 KB)</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  ✓ Uploaded (Dummy)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Verification Status Tracker (Section 11) */}
        {step === 5 && (
          <div className="space-y-6 text-center animate-in fade-in py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                Registration Submitted
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Application Under Cooperative Review
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your credentials have been routed to the Platform & Cooperative Verification Committee for formal audit.
              </p>
            </div>

            {/* Verification Status Table required by Section 11 */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 text-left">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Identity Verification</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>⏳ Pending Admin Audit</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Skill & Trade Verification</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Verified (Coop NSDC)</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Shop / Workplace Proof</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>⏳ Pending Inspection</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold text-slate-700">Mobile OTP Verification</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Verified (+91 OTP)</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-coop-50 rounded-xl border border-coop-200 text-xs text-coop-900 font-medium max-w-md mx-auto">
              Once the Platform Admin approves the remaining documents, the status will automatically upgrade to:
              <div className="font-black text-sm text-coop-800 mt-1">🟢 VERIFIED WORKER</div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCurrentRole('platform_admin')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
              >
                Switch to Platform Admin to Approve Application →
              </button>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        {step < 5 && (
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md shadow-saffron-500/20 transition flex items-center gap-1.5"
            >
              <span>{step === 4 ? 'Submit for Verification' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
