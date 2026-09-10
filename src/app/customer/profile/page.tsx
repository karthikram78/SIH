'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Calendar,
  Save,
  ShieldCheck,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { currentUser, setCurrentUser, userLocation, setUserLocation } = useApp();

  const [name, setName] = useState(currentUser.name || 'Priya Sharma');
  const [mobile, setMobile] = useState(currentUser.mobile || '+91 98421 77312');
  const [email, setEmail] = useState(currentUser.email || 'priya.sharma@example.com');
  const [address, setAddress] = useState(userLocation.address || 'Flat 302, Cauvery Heights, Usman Road, T. Nagar');
  const [city, setCity] = useState(userLocation.city || 'Chennai');
  const [pincode, setPincode] = useState(userLocation.pincode || '600017');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      mobile,
      email,
      location: {
        ...userLocation,
        address,
        city,
        pincode,
      },
    });
    setUserLocation({
      ...userLocation,
      address,
      city,
      pincode,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <RoleGuard allowedRoles={['customer', 'platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Customer Profile</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage your personal contact info and default service locations in Chennai.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400"
              />
              <div>
                <h2 className="text-xl font-black text-slate-900">{name}</h2>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Verified Consumer Member
                </span>
              </div>
            </div>

            {savedMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile information updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mobile Number</span>
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700">Service Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">PIN Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
