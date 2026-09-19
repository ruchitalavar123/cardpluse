'use client';

import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { HeaderBar } from '../components/HeaderBar';
import { SuperAdminView } from '../components/SuperAdminView';
import { TenantView } from '../components/TenantView';
import { SchoolView } from '../components/SchoolView';
import { StudentFormView } from '../components/StudentFormView';
import { ShieldCheck, Printer } from 'lucide-react';

function DashboardContent() {
  const { role } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
      {role === 'super_admin' && <SuperAdminView />}
      {role === 'tenant' && <TenantView />}
      {role === 'school' && <SchoolView />}
      {role === 'student' && <StudentFormView />}
    </main>
  );
}

function DashboardFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 py-5 mt-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="font-extrabold text-[#E12836]">YASH ENTERPRISES</span>
          <span className="text-slate-400 font-normal">| ID Management System</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Printer className="w-3.5 h-3.5 text-[#E12836]" /> Commercial ID Platform
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Ready for Production POC
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-[#E12836] selection:text-white">
        <HeaderBar />
        <DashboardContent />
        <DashboardFooter />
      </div>
    </AppProvider>
  );
}
