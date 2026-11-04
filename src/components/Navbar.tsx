import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  AlertOctagon, 
  Ambulance, 
  Building2, 
  ChevronDown, 
  Compass, 
  Globe2, 
  HeartPulse, 
  LifeBuoy, 
  Menu, 
  Navigation,
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope,
  Users, 
  X 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { translations } from '../data/translations';
import { UserRole } from '../types/emergency';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { role, setRole, language, setLanguage } = useJivanSetu();
  const location = useLocation();
  const t = translations[language];

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string }> = {
    bystander: { label: 'Bystander / Public', icon: Users, color: 'text-blue-500' },
    ambulance: { label: 'Ambulance Unit (108)', icon: Ambulance, color: 'text-amber-500' },
    hospital: { label: 'Hospital ER Doctor', icon: Building2, color: 'text-emerald-500' },
    admin: { label: 'System Admin Dispatch', icon: ShieldCheck, color: 'text-purple-500' }
  };

  const currentRoleConfig = roleLabels[role];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md border-b border-slate-200 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emergency-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-navy-900 dark:text-white">
                  JIVAN <span className="text-emergency-600">SETU</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emergency-100 text-emergency-700 dark:bg-emergency-900/40 dark:text-emergency-300">
                  EMS
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Smart Emergency Response Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'text-emergency-600 dark:text-emergency-400 font-semibold bg-red-50 dark:bg-red-950/30' 
                  : 'hover:text-emergency-600 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              {t.nav.home}
            </Link>

            <Link
              to="/first-aid"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/first-aid'
                  ? 'text-emergency-600 dark:text-emergency-400 font-semibold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-emergency-600 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <LifeBuoy className="w-4 h-4 text-emerald-500" />
              {t.nav.firstAid}
            </Link>

            <Link
              to="/patient-info"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/patient-info'
                  ? 'text-emergency-600 dark:text-emergency-400 font-semibold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-emergency-600 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-blue-500" />
              Patient Info
            </Link>

            <Link
              to="/track"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/track'
                  ? 'text-emergency-600 dark:text-emergency-400 font-semibold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-emergency-600 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <Navigation className="w-4 h-4 text-amber-500" />
              Track Ambulance
            </Link>

            <Link
              to="/ai-assistant"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/ai-assistant'
                  ? 'text-emergency-600 dark:text-emergency-400 font-semibold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-emergency-600 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t.nav.aiAssistant}
            </Link>

            <Link
              to="/routes"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/routes'
                  ? 'text-emergency-600 dark:text-emergency-400 font-semibold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-emergency-600 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-500" />
              {t.nav.routeMap}
            </Link>

            <div className="h-5 w-px bg-slate-200 dark:bg-navy-800 mx-1" />

            {/* Portal Links */}
            <Link
              to="/ambulance"
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                location.pathname === '/ambulance'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Ambulance className="w-3.5 h-3.5 text-amber-600" />
              108 EMS
            </Link>

            <Link
              to="/hospital"
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                location.pathname === '/hospital'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              Hospital ER
            </Link>

            <Link
              to="/admin"
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
                  : 'hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              Admin
            </Link>
          </nav>

          {/* Right Action Tools: Language, Role Switcher, Emergency CTA */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 text-xs font-semibold flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors text-slate-700 dark:text-slate-200"
              title="Toggle Hindi / English"
            >
              <Globe2 className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Role Demo Quick-Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold flex items-center gap-1.5 hover:border-slate-300 dark:hover:border-navy-600 transition-all text-slate-800 dark:text-slate-200"
              >
                <currentRoleConfig.icon className={`w-3.5 h-3.5 ${currentRoleConfig.color}`} />
                <span className="max-w-[130px] truncate">{currentRoleConfig.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-navy-900 shadow-xl border border-slate-200 dark:border-navy-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Switch Active Persona (Demo)
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                    const item = roleLabels[r];
                    const Icon = item.icon;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                          role === r
                            ? 'bg-emergency-50 dark:bg-emergency-950/40 text-emergency-700 dark:text-emergency-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 9-Step Faculty Demo Walkthrough */}
            <Link
              to="/demo"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition shadow-sm"
              title="Launch Guided Evaluation Flow for B.Tech Faculty"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Wizard</span>
            </Link>

            {/* Primary Report CTA */}
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <AlertOctagon className="w-4 h-4 stroke-[2.5] animate-pulse" />
              <span className="tracking-wide uppercase">Report Emergency</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200 dark:border-navy-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-800 dark:text-slate-200"
            >
              {t.nav.home}
            </Link>
            <Link
              to="/first-aid"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <LifeBuoy className="w-4 h-4 text-emerald-500" />
              {t.nav.firstAid}
            </Link>
            <Link
              to="/patient-info"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4 text-blue-500" />
              Patient Info
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4 text-amber-500" />
              Track Ambulance
            </Link>
            <Link
              to="/ai-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t.nav.aiAssistant}
            </Link>
            <Link
              to="/routes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-blue-500" />
              {t.nav.routeMap}
            </Link>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Role Dashboards
            </div>
            <Link
              to="/ambulance"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-300"
            >
              <Ambulance className="w-4 h-4" />
              Ambulance Dispatch Portal
            </Link>
            <Link
              to="/hospital"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
            >
              <Building2 className="w-4 h-4" />
              Hospital Trauma ER Portal
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-300"
            >
              <Activity className="w-4 h-4" />
              Command Center Admin
            </Link>
            <Link
              to="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 bg-amber-500 text-white rounded-lg shadow"
            >
              <Sparkles className="w-4 h-4" />
              Guided College Demo Wizard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
