'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Building2, GraduationCap, User, RefreshCw, CreditCard } from 'lucide-react';

export const HeaderBar: React.FC = () => {
  const {
    role,
    setRole,
    resetToDefaults,
  } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 text-slate-900 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
        {/* Left: Fixed Brand Identity (Never wraps, never squishes, never shifts) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#E12836] text-white flex items-center justify-center shadow-xs shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 whitespace-nowrap">
                YASH ENTERPRISES
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                POC Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap hidden sm:block">
              Commercial ID Card Production & Management Hub
            </p>
          </div>
        </div>

        {/* Right: Fixed Segmented Role Controller (Strictly identical size, position & alignment across all modules) */}
        <div className="flex items-center gap-2 shrink-0">
          <nav className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex items-center gap-1 shadow-xs" aria-label="Module Navigation">
            <button
              onClick={() => setRole('super_admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'super_admin'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 transition-colors duration-200 ${role === 'super_admin' ? 'text-[#E12836]' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">Super Admin</span>
            </button>

            <button
              onClick={() => setRole('tenant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'tenant'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 transition-colors duration-200 ${role === 'tenant' ? 'text-[#E12836]' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">Tenant (Admin)</span>
            </button>

            <button
              onClick={() => setRole('school')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'school'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GraduationCap className={`w-3.5 h-3.5 transition-colors duration-200 ${role === 'school' ? 'text-[#E12836]' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">School / College</span>
            </button>

            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'student'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <User className={`w-3.5 h-3.5 transition-colors duration-200 ${role === 'student' ? 'text-[#E12836]' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">Public Student Form</span>
            </button>
          </nav>

          {/* Fixed Reset Mock Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset prototype state to default data?')) {
                resetToDefaults();
              }
            }}
            title="Reset Mock Data"
            className="p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-colors shadow-xs shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
