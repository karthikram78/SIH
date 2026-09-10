'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
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
  RefreshCw,
  LogOut,
  LogIn,
  Lock,
  Globe,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  onOpenEmergency?: () => void;
  onOpenWeightsConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergency, onOpenWeightsConfig }) => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
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
    isAuthenticated,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) => !n.read && (n.targetRole === currentRole || !n.targetRole)
  );

  const locations = [
    {
      name: 'Avadi Service Area',
      lat: 13.1147,
      lng: 80.1048,
      address: 'Avadi Main Road, Avadi',
      city: 'Avadi',
      pincode: '600054',
    },
  ];

  const getDashboardLink = () => {
    switch (currentRole) {
      case 'worker':
        return '/worker/dashboard';
      case 'cooperative_admin':
        return '/cooperative/dashboard';
      case 'platform_admin':
        return '/admin/dashboard';
      case 'customer':
      default:
        return '/customer/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Ministry, Language & Live Backend Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">SIH 2026 / SIH26089</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Ministry of Cooperation</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              <Globe className="w-3 h-3 text-amber-400" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  language === 'ta' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Live Backend Indicator */}
            {isBackendConnected ? (
              <div
                title="FastAPI REST API connected and responding at http://127.0.0.1:8000"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono shadow-xs cursor-default"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">Backend Live</span>
              </div>
            ) : (
              <div
                title="FastAPI offline or starting up. Local fallback enabled."
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[11px]"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Demo Data Mode</span>
              </div>
            )}

            {/* Sync Backend Data Button */}
            <button
              onClick={refreshFromBackend}
              disabled={backendLoading}
              title="Sync latest records from FastAPI backend"
              className="flex items-center gap-1 hover:text-white transition-colors text-xs text-slate-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 text-amber-400 ${backendLoading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <button
              onClick={resetDemoData}
              title="Reset sample data in database"
              className="flex items-center gap-1 hover:text-white transition-colors text-xs text-amber-400 hover:text-amber-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="Avadi Connect Logo"
              className="h-11 w-auto object-contain rounded-lg drop-shadow-xs transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  {t('brandName')}
                </span>
                <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                  Cooperative Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Center Public Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/about' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('about')}
            </Link>
            <Link
              href="/services"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/services' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('services')}
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/how-it-works' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('howItWorks')}
            </Link>
            <Link
              href={getDashboardLink()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname.includes('/dashboard') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('dashboard')}</span>
            </Link>
          </nav>

          {/* Location Selector (Simulated GPS) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-medium truncate max-w-[150px]">
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
                    <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 🚨 Emergency Button */}
            {onOpenEmergency ? (
              <button
                onClick={onOpenEmergency}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">{t('needHelpNow')}</span>
                <span className="sm:hidden">Help</span>
              </button>
            ) : (
              <Link
                href="/customer/request-service?emergency=true"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">{t('needHelpNow')}</span>
                <span className="sm:hidden">Help</span>
              </Link>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-ping"></span>
                )}
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white"></span>
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
                            {notif.type === 'verification' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
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

            {/* Active User Info & Auth Controls */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden xl:block">
                <div className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                  {currentRole === 'customer' && (currentUser.name || 'Priya Sharma')}
                  {currentRole === 'worker' && (currentWorker.name || 'Arun Kumar')}
                  {currentRole === 'cooperative_admin' && 'Chennai Coop Admin'}
                  {currentRole === 'platform_admin' && 'Central Admin Desk'}
                </div>
                <div className="text-[10px] text-amber-600 font-medium capitalize">
                  {currentRole.replace('_', ' ')}
                </div>
              </div>

              {/* Role Switcher or Locked Role indicator */}
              {isAuthenticated ? (
                <div
                  title={`Signed in as ${currentRole.replace('_', ' ')}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800"
                >
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span className="capitalize hidden md:inline">{currentRole.replace('_', ' ')}</span>
                </div>
              ) : (
                <select
                  value={currentRole}
                  aria-label="Switch User Persona Role"
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="text-xs font-semibold bg-slate-100 border border-slate-300 rounded-xl px-2 py-1 text-slate-800 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer hidden md:block"
                >
                  <option value="customer">👤 Customer</option>
                  <option value="worker">👨‍🔧 Worker</option>
                  <option value="cooperative_admin">🤝 Cooperative</option>
                  <option value="platform_admin">🛡️ Admin</option>
                </select>
              )}

              {/* Auth links or Logout */}
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  title="Sign Out of Session"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition border border-rose-200 shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition border border-slate-300"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('login')}</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white transition shadow-sm"
                  >
                    <span>{t('register')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
