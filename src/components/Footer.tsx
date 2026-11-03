import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldAlert, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { translations } from '../data/translations';

export const Footer: React.FC = () => {
  const { language } = useJivanSetu();
  const t = translations[language];

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 text-sm">
      {/* Top Banner: Medical & Legal Safety */}
      <div className="bg-navy-900 border-b border-navy-800/60 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              Official Indian Emergency Services: Dial 112 for All Emergencies | 108 for Medical Ambulance | 102 for Maternity / Infant Care
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              B.Tech Academic Capstone Project
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Prototype v2.0</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Vision */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emergency-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                JIVAN <span className="text-emergency-500">SETU</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "{t.brandTagline}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              A synchronized medical coordination platform connecting bystanders, paramedics, and hospital emergency trauma teams through real-time telemetry.
            </p>
            <div className="pt-2">
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emergency-600/20 border border-emergency-500/40 text-emergency-400 font-bold text-xs hover:bg-emergency-600 hover:text-white transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Emergency Hotline: 112
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/report" className="hover:text-emergency-400 transition">
                  Emergency Incident Reporting
                </Link>
              </li>
              <li>
                <Link to="/first-aid" className="hover:text-emerald-400 transition">
                  Bilingual First-Aid Protocols
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-amber-400 transition">
                  AI Emergency Assistant (SBAR)
                </Link>
              </li>
              <li>
                <Link to="/routes" className="hover:text-blue-400 transition">
                  OpenStreetMap Live Route Tracking
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-purple-400 transition font-semibold text-amber-300">
                  9-Step Evaluation Demo Walkthrough
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Stakeholder Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/ambulance" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  108 Ambulance EMS Dashboard
                </Link>
              </li>
              <li>
                <Link to="/hospital" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Hospital ER Trauma Bay Console
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Central Command & Dispatch Hub
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block pt-1">
                  Role-based access simulation allows seamless testing of all roles during examination.
                </span>
              </li>
            </ul>
          </div>

          {/* Academic Project Credits & Safety Notice */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Academic & Safety Notice
            </h4>
            <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 text-xs space-y-2 text-slate-400">
              <p>
                <strong>Academic Scope:</strong> Developed by Second-Year B.Tech Computer Science & Engineering student.
              </p>
              <p className="text-[11px] text-slate-400">
                Data presented in this prototype is simulated for research, coordination modeling, and academic demonstration.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-10 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} JIVAN SETU Emergency Coordination Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Responsive Web Engineering</span>
            <span>•</span>
            <span>TypeScript + Tailwind + React</span>
            <span>•</span>
            <span>OpenStreetMap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
