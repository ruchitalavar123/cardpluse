'use client';

import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { HeaderBar } from '../components/HeaderBar';
import { SuperAdminView } from '../components/SuperAdminView';
import { TenantView } from '../components/TenantView';
import { SchoolView } from '../components/SchoolView';
import { StudentFormView } from '../components/StudentFormView';

function DashboardContent() {
  const { role } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {role === 'super_admin' && <SuperAdminView />}
      {role === 'tenant' && <TenantView />}
      {role === 'school' && <SchoolView />}
      {role === 'student' && <StudentFormView />}
    </main>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black">
        <HeaderBar />
        <DashboardContent />
      </div>
    </AppProvider>
  );
}
