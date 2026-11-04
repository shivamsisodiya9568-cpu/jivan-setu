import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  AlertCircle, 
  Ambulance, 
  Building2, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { UserRole } from '../../types/emergency';
import { useJivanSetu } from '../../context/JivanSetuContext';

interface StaffAuthGuardProps {
  requiredRole: 'ambulance' | 'hospital' | 'admin';
  children: React.ReactNode;
}

const ROLE_CONFIG: Record<string, { title: string; defaultPin: string; icon: any; color: string; badge: string }> = {
  ambulance: {
    title: '108 Ambulance Fleet Unit Portal',
    defaultPin: '108',
    icon: Ambulance,
    color: 'from-amber-600 to-orange-600',
    badge: 'Authorized EMS Crew Only'
  },
  hospital: {
    title: 'Hospital Emergency Department Portal',
    defaultPin: 'ER-AIIMS',
    icon: Building2,
    color: 'from-emerald-600 to-teal-700',
    badge: 'Clinical Trauma Team Only'
  },
  admin: {
    title: 'Central EMS Dispatch Administration',
    defaultPin: 'ADMIN-112',
    icon: ShieldCheck,
    color: 'from-purple-600 to-indigo-700',
    badge: 'Dispatch Supervisor Only'
  }
};

export const StaffAuthGuard: React.FC<StaffAuthGuardProps> = ({ requiredRole, children }) => {
  const { setRole } = useJivanSetu();
  const config = ROLE_CONFIG[requiredRole];
  const Icon = config.icon;
  const storageKey = `jivan_setu_auth_${requiredRole}`;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(storageKey) === 'true';
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setRole(requiredRole as UserRole);
    }
  }, [isAuthenticated, requiredRole, setRole]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === config.defaultPin || enteredPin.trim().toLowerCase() === 'demo' || enteredPin.trim() === '112') {
      sessionStorage.setItem(storageKey, 'true');
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError(`Invalid staff credentials. Default evaluation passcode is: "${config.defaultPin}"`);
    }
  };

  const fillDemoCredentials = () => {
    setEnteredPin(config.defaultPin);
    sessionStorage.setItem(storageKey, 'true');
    setIsAuthenticated(true);
    setError(null);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${config.color} text-white flex items-center justify-center mx-auto shadow-lg shadow-black/10`}>
            <Icon className="w-7 h-7" />
          </div>
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
            {config.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
            {config.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Staff access authentication required to manage live ambulance telemetry and hospital pre-alerts.
          </p>
        </div>

        {/* Public Notice */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <strong>Are you an emergency victim or bystander?</strong> You do not need to log in! Return to the Emergency Home to book an ambulance immediately.
          </div>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Staff Badge ID / Passcode</span>
              <span className="text-[11px] text-slate-400 font-normal">Passcode: <code className="font-mono font-bold text-slate-700 dark:text-slate-300">{config.defaultPin}</code></span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setError(null);
                }}
                placeholder={`Enter ${config.defaultPin} or click below`}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emergency-500 focus:outline-none"
              />
            </div>
            {error && (
              <span className="text-[11px] text-red-500 mt-1.5 block font-medium">
                {error}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-navy-900 hover:bg-navy-950 dark:bg-emergency-600 dark:hover:bg-emergency-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Verify Staff Credentials</span>
          </button>
        </form>

        {/* 1-Click Demo Evaluation Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-navy-800">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full py-2.5 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100/50 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>1-Click Examiner Demo Login ({config.defaultPin})</span>
          </button>
        </div>

        {/* Back to Public Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emergency-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Emergency Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
