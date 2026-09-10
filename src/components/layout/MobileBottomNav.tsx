'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Compass,
  Activity,
  AlertTriangle,
  Shield,
  User,
  LayoutDashboard,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenEmergency?: () => void;
  onOpenProfile?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenEmergency,
}) => {
  const pathname = usePathname();
  const { currentRole, serviceRequests, currentUser } = useApp();
  const { t } = useLanguage();

  const hasActiveJob = serviceRequests.some(
    (r) =>
      r.status !== 'cancelled' &&
      r.status !== 'paid' &&
      (currentRole === 'customer' ? r.customerId === currentUser.id : true)
  );

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
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Explore Services */}
        <Link
          href="/services"
          className={`flex flex-col items-center justify-center p-1 transition ${
            pathname === '/services' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{t('services')}</span>
        </Link>

        {/* Dashboard */}
        <Link
          href={getDashboardLink()}
          className={`flex flex-col items-center justify-center p-1 transition ${
            pathname.includes('/dashboard') ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{t('dashboard')}</span>
        </Link>

        {/* Central SOS Emergency Button */}
        {onOpenEmergency ? (
          <button
            onClick={onOpenEmergency}
            aria-label="Emergency Breakdown Assistance"
            className="-mt-5 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 border-2 border-white transform active:scale-95 transition">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 mt-0.5">SOS</span>
          </button>
        ) : (
          <Link
            href="/customer/request-service?emergency=true"
            aria-label="Emergency Breakdown Assistance"
            className="-mt-5 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 border-2 border-white transform active:scale-95 transition">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 mt-0.5">SOS</span>
          </Link>
        )}

        {/* Bookings / Live Jobs */}
        <Link
          href={currentRole === 'worker' ? '/worker/jobs' : '/customer/bookings'}
          className={`flex flex-col items-center justify-center p-1 relative transition ${
            pathname.includes('/bookings') || pathname.includes('/jobs') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          {hasActiveJob && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          )}
          <Activity className={`w-5 h-5 mb-0.5 ${hasActiveJob ? 'text-blue-600' : ''}`} />
          <span className="text-[10px] font-semibold">Jobs</span>
        </Link>

        {/* Profile / Account */}
        <Link
          href={currentRole === 'worker' ? '/worker/profile' : '/customer/profile'}
          className={`flex flex-col items-center justify-center p-1 transition ${
            pathname.includes('/profile') ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{t('profile')}</span>
        </Link>
      </div>
    </nav>
  );
};
