'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  ShieldCheck,
  AlertCircle,
  MapPin,
  Bell,
  RotateCcw,
  User,
  Briefcase,
  Users,
  ShieldAlert,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Server,
} from 'lucide-react';

interface NavbarProps {
  onOpenEmergency: () => void;
  onOpenWeightsConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergency, onOpenWeightsConfig }) => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    currentWorker,
    notifications,
    markNotificationRead,
    resetDemoData,
    userLocation,
    setUserLocation,
    isBackendConnected,
    backendLoading,
    refreshFromBackend,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) => !n.read && (n.targetRole === currentRole || !n.targetRole)
  );

  const locations = [
    {
      name: 'Thillai Nagar (Central)',
      lat: 10.8271,
      lng: 78.6890,
      address: 'Cauvery Heights, Thillai Nagar 7th Cross',
      city: 'Tiruchirappalli',
      pincode: '620018',
    },
    {
      name: 'Tennur High Road',
      lat: 10.8350,
      lng: 78.6940,
      address: '18, Tennur High Road',
      city: 'Tiruchirappalli',
      pincode: '620017',
    },
    {
      name: 'Cantonment / Bus Stand',
      lat: 10.8190,
      lng: 78.6850,
      address: 'Bharathiyar Salai, Cantonment',
      city: 'Tiruchirappalli',
      pincode: '620001',
    },
    {
      name: 'Woraiyur Heritage',
      lat: 10.8290,
      lng: 78.6810,
      address: 'Salai Road, Woraiyur',
      city: 'Tiruchirappalli',
      pincode: '620003',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Ministry, Live Backend & Cooperative Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">SIH 2024 / SIH26089</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Ministry of Cooperation</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {/* Live Backend Indicator */}
            {isBackendConnected ? (
              <div
                title="FastAPI REST API connected and responding at http://127.0.0.1:8000"
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono shadow-xs cursor-default"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">Backend Live (Port 8000)</span>
              </div>
            ) : (
              <div
                title="Backend server offline. Using local simulated data mode."
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[11px]"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Offline Demo Mode</span>
              </div>
            )}

            {/* Sync Backend Data Button */}
            <button
              onClick={refreshFromBackend}
              disabled={backendLoading}
              title="Sync latest records from FastAPI backend"
              className="flex items-center gap-1 hover:text-white transition-colors text-xs text-slate-300 hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 text-brand-400 ${backendLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <button
              onClick={resetDemoData}
              title="Reset sample data in database"
              className="flex items-center gap-1 hover:text-white transition-colors text-xs text-amber-400 hover:text-amber-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-saffron-500/20 font-bold text-xl">
              NS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Namma <span className="text-saffron-600">Sevai</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-coop-100 text-coop-800 border border-coop-300">
                  Cooperative Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium tracking-wide">
                Connecting Skills with Community Needs
              </p>
            </div>
          </div>

          {/* Location Selector (Simulated GPS) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-saffron-600" />
              <span className="font-medium truncate max-w-[170px]">
                {userLocation.address.split(',')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLocationPicker && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                  Select Simulated GPS Location
                </div>
                {locations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserLocation({
                        lat: loc.lat,
                        lng: loc.lng,
                        address: loc.address,
                        city: loc.city,
                        pincode: loc.pincode,
                      });
                      setShowLocationPicker(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start gap-2 border-b border-slate-50 last:border-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-saffron-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">{loc.name}</div>
                      <div className="text-[11px] text-slate-500">{loc.address}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* 🚨 Emergency Button */}
            <button
              onClick={onOpenEmergency}
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>🚨 Need Help Now</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-saffron-500 ring-2 ring-white animate-ping"></span>
                )}
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-saffron-500 ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {unreadNotifications.length} unread
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {unreadNotifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      unreadNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className="p-3 hover:bg-slate-50 cursor-pointer transition text-xs"
                        >
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            {notif.type === 'job' && <Briefcase className="w-3.5 h-3.5 text-blue-600" />}
                            {notif.type === 'verification' && <ShieldCheck className="w-3.5 h-3.5 text-coop-600" />}
                            {notif.type === 'alert' && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                            <span>{notif.title}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-block">{notif.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active User Avatar & Role Switcher Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">
                  {currentRole === 'customer' && currentUser.name}
                  {currentRole === 'worker' && currentWorker.name}
                  {currentRole === 'cooperative_admin' && 'Trichy Coop Admin'}
                  {currentRole === 'platform_admin' && 'Platform Admin (Govt)'}
                </div>
                <div className="text-[10px] text-saffron-600 font-medium capitalize">
                  {currentRole.replace('_', ' ')}
                </div>
              </div>

              <select
                value={currentRole}
                aria-label="Switch User Persona Role"
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="text-xs font-semibold bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 hover:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 cursor-pointer"
              >
                <option value="customer">👤 Customer View</option>
                <option value="worker">👨‍🔧 Worker View (Arun Kumar)</option>
                <option value="cooperative_admin">🤝 Cooperative Admin</option>
                <option value="platform_admin">🛡️ Platform Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
