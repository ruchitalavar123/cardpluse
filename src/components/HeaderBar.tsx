'use client';

import React from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { Shield, Building2, GraduationCap, User, RefreshCw, Layers } from 'lucide-react';

export const HeaderBar: React.FC = () => {
  const { role, setRole, activeTenantId, setActiveTenantId, tenants, activeSchoolId, setActiveSchoolId, schools, resetToDefaults } = useApp();

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const activeSchool = schools.find(s => s.id === activeSchoolId) || schools[0];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-white shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Platform Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                CardPulse SaaS
              </h1>
              <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Interactive POC Demo
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-Tenant ID Generation Engine</p>
          </div>
        </div>

        {/* Role Switcher & Tenant / School Context Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role selector pill */}
          <div className="bg-slate-800/90 border border-slate-700 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setRole('super_admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'super_admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Super Admin
            </button>

            <button
              onClick={() => setRole('tenant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'tenant'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Tenant (Admin)
            </button>

            <button
              onClick={() => setRole('school')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'school'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              School / College
            </button>

            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'student'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Public Student Form
            </button>
          </div>

          {/* Context selects */}
          {role === 'tenant' && (
            <select
              value={activeTenantId}
              onChange={e => setActiveTenantId(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>
                  🏢 {t.name}
                </option>
              ))}
            </select>
          )}

          {role === 'school' && (
            <select
              value={activeSchoolId}
              onChange={e => setActiveSchoolId(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>
                  🏫 {s.name}
                </option>
              ))}
            </select>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset demo data to default sample state?')) resetToDefaults();
            }}
            title="Reset sample data"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
