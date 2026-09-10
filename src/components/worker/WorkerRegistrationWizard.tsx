'use client';

import React, { useState, useRef } from 'react';
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
  Camera,
  Image as ImageIcon,
  Eye,
  Trash2,
  FileText,
  X,
  RefreshCw,
} from 'lucide-react';
import { WorkerDocument } from '@/types';
import { uploadDocumentApi } from '@/lib/api';

interface WorkerRegistrationWizardProps {
  onComplete?: () => void;
}

interface UploadedDocItem {
  id: string;
  name: string;
  fileUrl: string;
  previewUrl?: string;
  type: 'identity' | 'skill_certificate' | 'shop_proof';
  sizeFormatted: string;
  uploadedAt: string;
  status: 'pending' | 'verified';
  isCustom: boolean;
}

export const WorkerRegistrationWizard: React.FC<WorkerRegistrationWizardProps> = ({ onComplete }) => {
  const { registerWorker, cooperatives, serviceCategories, setCurrentRole } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: 'M. Senthil Nathan',
    mobile: '+91 94435 88123',
    email: 'senthil.electrician@example.com',
    address: 'Avadi Main Road, Avadi',
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
    shopAddress: 'Avadi Main Road, Avadi',
    shopPhotoUrl: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&auto=format&fit=crop&q=80',
    // Step 4: Documents uploaded state
    identityUploaded: true,
    skillUploaded: true,
    shopUploaded: true,
  });

  // Real Uploaded Document States
  const [identityDoc, setIdentityDoc] = useState<UploadedDocItem>({
    id: 'doc-sub-1',
    name: 'Sample_Aadhaar_Card_Redacted.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&auto=format&fit=crop&q=80',
    type: 'identity',
    sizeFormatted: '840 KB',
    uploadedAt: new Date().toISOString(),
    status: 'pending',
    isCustom: false,
  });

  const [skillDoc, setSkillDoc] = useState<UploadedDocItem>({
    id: 'doc-sub-2',
    name: 'Govt_ITI_Wireman_Trade_Certificate.pdf',
    fileUrl: '/docs/sample_iti_cert.pdf',
    type: 'skill_certificate',
    sizeFormatted: '1.4 MB',
    uploadedAt: new Date().toISOString(),
    status: 'verified',
    isCustom: false,
  });

  const [shopDoc, setShopDoc] = useState<UploadedDocItem>({
    id: 'doc-sub-3',
    name: 'Chennai_Corporation_Shop_Registration.pdf',
    fileUrl: '/docs/sample_shop_license.pdf',
    type: 'shop_proof',
    sizeFormatted: '620 KB',
    uploadedAt: new Date().toISOString(),
    status: 'pending',
    isCustom: false,
  });

  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [previewModalDoc, setPreviewModalDoc] = useState<{ name: string; url: string } | null>(null);

  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const aadhaarCameraRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const shopInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: 'identity' | 'skill_certificate' | 'shop_proof'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(docType);
    try {
      const objectUrl = URL.createObjectURL(file);
      let targetUrl = objectUrl;

      try {
        const uploadRes = await uploadDocumentApi(file);
        if (uploadRes.url) {
          targetUrl = uploadRes.url;
        }
      } catch (apiErr) {
        console.warn('Backend document upload failed, using local object preview:', apiErr);
      }

      const isImg = file.type.startsWith('image/');
      const updatedDoc: UploadedDocItem = {
        id: `doc-${Date.now()}`,
        name: file.name,
        fileUrl: targetUrl,
        previewUrl: isImg ? objectUrl : undefined,
        type: docType,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        status: docType === 'skill_certificate' ? 'verified' : 'pending',
        isCustom: true,
      };

      if (docType === 'identity') setIdentityDoc(updatedDoc);
      if (docType === 'skill_certificate') setSkillDoc(updatedDoc);
      if (docType === 'shop_proof') setShopDoc(updatedDoc);
    } finally {
      setUploadingType(null);
    }
  };

  const [submittedWorkerId, setSubmittedWorkerId] = useState<string | null>(null);

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Assemble documents from actual uploads
      const docs: WorkerDocument[] = [
        {
          id: identityDoc.id,
          type: 'identity',
          name: identityDoc.name,
          fileUrl: identityDoc.fileUrl,
          status: identityDoc.status,
          uploadedAt: identityDoc.uploadedAt,
          notes: identityDoc.isCustom
            ? 'Worker submitted live document / Aadhaar photo for verification'
            : 'Pre-loaded verified specimen ID for demo',
        },
        {
          id: skillDoc.id,
          type: 'skill_certificate',
          name: skillDoc.name,
          fileUrl: skillDoc.fileUrl,
          status: skillDoc.status,
          uploadedAt: skillDoc.uploadedAt,
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'Chennai Cooperative Skill Committee',
          notes: 'Pre-vetted through National Skill Qualification Framework (NSQF)',
        },
        {
          id: shopDoc.id,
          type: 'shop_proof',
          name: shopDoc.name,
          fileUrl: shopDoc.fileUrl,
          status: shopDoc.status,
          uploadedAt: shopDoc.uploadedAt,
          notes: 'Shop location verification document',
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
        cooperativeName: selectedCoop?.name || 'Chennai Central Service Cooperative Society',
        documents: docs,
        shop: formData.hasShop ? {
          id: `shop-new`,
          name: formData.shopName,
          address: formData.shopAddress,
          photoUrl: formData.shopPhotoUrl,
          lat: 13.0418,
          lng: 80.2341,
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

            <div className="space-y-4">
              {/* 1. Aadhaar Card / Identity Proof */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 hover:border-saffron-300 bg-white transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-saffron-50 text-saffron-600 border border-saffron-200 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                        <span>1. Aadhaar Card / Identity Photo</span>
                        {identityDoc.isCustom && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Live Uploaded
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {identityDoc.name} ({identityDoc.sizeFormatted})
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {identityDoc.previewUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewModalDoc({ name: identityDoc.name, url: identityDoc.previewUrl || identityDoc.fileUrl })}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Photo</span>
                      </button>
                    )}

                    <input
                      ref={aadhaarInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'identity')}
                    />
                    <input
                      ref={aadhaarCameraRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'identity')}
                    />

                    <button
                      type="button"
                      disabled={uploadingType === 'identity'}
                      onClick={() => aadhaarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      {uploadingType === 'identity' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{identityDoc.isCustom ? 'Change Photo' : 'Upload Aadhaar Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => aadhaarCameraRef.current?.click()}
                      title="Take Photo with Camera"
                      className="p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Live Image Preview Bar */}
                {identityDoc.previewUrl && (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <img
                      src={identityDoc.previewUrl}
                      alt="Aadhaar Preview"
                      className="w-14 h-10 object-cover rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                      onClick={() => setPreviewModalDoc({ name: identityDoc.name, url: identityDoc.previewUrl || identityDoc.fileUrl })}
                    />
                    <div className="text-[11px] text-slate-600 min-w-0 flex-1 truncate">
                      <span className="font-semibold text-emerald-700">✓ Ready for Admin audit:</span> Photo verified & stored safely in local cooperative repository.
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Trade / Skill Certification */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 hover:border-saffron-300 bg-white transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                        <span>2. Trade / Skill Certification</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          ✓ Cooperative Tie-up
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {skillDoc.name} ({skillDoc.sizeFormatted})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={skillInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'skill_certificate')}
                    />
                    <button
                      type="button"
                      disabled={uploadingType === 'skill_certificate'}
                      onClick={() => skillInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      {uploadingType === 'skill_certificate' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{skillDoc.isCustom ? 'Replace Cert' : 'Upload Certificate'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Shop / Workplace Proof */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 hover:border-saffron-300 bg-white transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">3. Shop / Municipal Trade Proof</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {shopDoc.name} ({shopDoc.sizeFormatted})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={shopInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'shop_proof')}
                    />
                    <button
                      type="button"
                      disabled={uploadingType === 'shop_proof'}
                      onClick={() => shopInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      {uploadingType === 'shop_proof' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{shopDoc.isCustom ? 'Replace Proof' : 'Upload Proof'}</span>
                    </button>
                  </div>
                </div>
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

      {/* Uploaded Document / Aadhaar Photo Preview Modal */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div className="font-bold text-sm text-slate-900">{previewModalDoc.name}</div>
              </div>
              <button
                onClick={() => setPreviewModalDoc(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-center min-h-[260px] max-h-[450px] overflow-hidden">
              <img
                src={previewModalDoc.url}
                alt={previewModalDoc.name}
                className="max-h-80 w-auto rounded-xl shadow-md object-contain"
                onError={(e) => {
                  // Fallback for PDF or broken link
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="text-center p-4 text-xs text-slate-500 space-y-2">
                <div className="font-bold text-slate-700">Aadhaar / Credential File Document</div>
                <div className="text-[11px] text-slate-400">File location: {previewModalDoc.url}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                🔒 Privacy Protected • Restricted to Verification Committee Audit
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
