'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { PlatformAdminView } from '@/components/admin/PlatformAdminView';

export default function AdminWorkerVerificationPage() {
  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1">
          <PlatformAdminView />
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
