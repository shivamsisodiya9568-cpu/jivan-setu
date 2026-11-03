import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  AlertOctagon, 
  Ambulance, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Compass, 
  FileText, 
  Globe2, 
  HeartPulse, 
  Mic, 
  PhoneCall, 
  Route, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { translations } from '../data/translations';
import { PriorityBadge } from '../components/common/PriorityBadge';

export const LandingPage: React.FC = () => {
  const { language, reports } = useJivanSetu();
  const t = translations[language];

  const criticalCount = reports.filter(r => r.priority === 'RED').length;
  const activeDispatches = reports.filter(r => r.status !== 'Completed' && r.status !== 'Rejected').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 selection:bg-red-500/20 selection:text-red-600">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28 border-b border-slate-200 dark:border-navy-800">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emergency-600/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emergency-100 dark:bg-emergency-950/60 border border-emergency-200 dark:border-emergency-800/80 text-emergency-700 dark:text-emergency-300 text-xs font-bold tracking-wide animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emergency-600" />
                <span>Next-Gen Smart Emergency Medical Coordination</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-950 dark:text-white leading-[1.15]">
                {t.hero.heading.split('.')[0]}.
                <span className="block bg-gradient-to-r from-emergency-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                  {t.hero.heading.split('.')[1] || 'Every Life Counts.'}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t.hero.subheading}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/report"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-base shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <AlertOctagon className="w-5 h-5 animate-pulse" />
                  <span>{t.hero.reportBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900/90 hover:bg-slate-50 dark:hover:bg-navy-800 text-navy-900 dark:text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <Compass className="w-4 h-4 text-blue-500" />
                  <span>{t.hero.exploreBtn}</span>
                </a>

                <Link
                  to="/demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 dark:hover:bg-amber-900/40 transition shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Interactive 9-Step Demo</span>
                </Link>
              </div>

              {/* Live Status Ticker */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>108 Fleet Dispatched: <strong className="text-slate-800 dark:text-slate-200">{activeDispatches} Active</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>Critical Cases Handled: <strong className="text-slate-800 dark:text-slate-200">{criticalCount} In Flight</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Dial <strong className="text-emergency-600 font-bold">112</strong> for immediate voice assistance</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic / Telemetry Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Card */}
                <div className="rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-2xl p-6 relative overflow-hidden backdrop-blur">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emergency-500 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
                        Live Emergency Coordination Telemetry
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                      ID: JS-2026-9041
                    </span>
                  </div>

                  {/* Visual Simulation Elements */}
                  <div className="py-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Incident Type</span>
                        <h4 className="text-base font-bold text-navy-950 dark:text-white">
                          Highway Collision (Polytrauma)
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Safdarjung Flyover, Ring Road Northbound
                        </p>
                      </div>
                      <PriorityBadge priority="RED" size="sm" />
                    </div>

                    {/* Progress Track */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Ambulance className="w-4 h-4 text-emergency-600 animate-pulse" />
                          Eagle-1 ALS Ambulance
                        </span>
                        <span className="text-emergency-600 dark:text-emergency-400 font-extrabold font-mono">
                          ETA ~ 4 mins
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-navy-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-emergency-600 to-amber-500 h-2 rounded-full w-3/4 animate-pulse" />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Dispatched</span>
                        <span className="font-bold text-navy-900 dark:text-slate-200">En Route to Patient</span>
                        <span>AIIMS Apex Trauma</span>
                      </div>
                    </div>

                    {/* Hospital Pre-Alert Confirmation */}
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <strong className="block font-semibold">Hospital Pre-Alert Acknowledged</strong>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Trauma Bay 1 cleared • 2x O- Blood Reserved</span>
                        </div>
                      </div>
                      <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    </div>

                    {/* Equipment Checklist */}
                    <div className="text-xs space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Ambulance Equipment Recommended:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-[11px] font-medium">
                          Zoll Defibrillator
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-[11px] font-medium">
                          Tourniquet Trauma Pack
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 text-[11px] font-medium">
                          Cervical Collar
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 text-[11px] font-medium">
                          High-Flow O2
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px]">Synchronized across all 4 stakeholder dashboards</span>
                    <Link to="/ambulance" className="text-emergency-600 font-bold hover:underline flex items-center gap-1">
                      View EMS Console <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-5 bg-white dark:bg-navy-800 p-3 rounded-xl border border-slate-200 dark:border-navy-700 shadow-xl hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Response Golden Hour</span>
                    <strong className="text-xs text-navy-950 dark:text-white">Save 8–15 Mins Preparation</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE CRITICAL PROBLEM IN EMERGENCY RESPONSE */}
      <section className="py-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emergency-600 dark:text-emergency-400">
              The Emergency Care Bottleneck
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 dark:text-white mt-1">
              Why Traditional Emergency Response Loses Vital Minutes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              In trauma and cardiac emergencies, the first 60 minutes ("The Golden Hour") determine patient survival. Traditional voice-only dispatch systems suffer from critical information gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-red-300 dark:hover:border-red-900/50 transition">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-2">
                Ambulance Dispatch Delays
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Callers struggle under severe panic to describe exact landmarks and GPS coordinates, adding 5–10 minutes of unnecessary delay to vehicle arrival.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-red-300 dark:hover:border-red-900/50 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-2">
                Lack of Advance Patient Data
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Paramedics arrive with zero knowledge about patient consciousness, breathing pattern, or active arterial bleeding until physically touching the victim.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-red-300 dark:hover:border-red-900/50 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-2">
                Equipment Mismatch
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ALS (Advanced Life Support) vs BLS units are dispatched haphazardly without structured pre-assessment of equipment needs (AED, ventilator, suction).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-red-300 dark:hover:border-red-900/50 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-2">
                Unprepared Hospital ER
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Emergency room staff often learn about severe polytrauma only when the stretcher rolls through the entrance doors, delaying blood matching and OR setup.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR CONNECTED SOLUTION: JIVAN SETU */}
      <section className="py-16 bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              The Connected Paradigm
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 dark:text-white mt-1">
              JIVAN SETU: Bridging the Four Critical Pillars
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              JIVAN SETU replaces fragmented telephone chains with a unified, real-time digital coordination loop connecting every actor in the chain of survival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs mb-3">1</div>
              <Users className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 dark:text-white">Bystander / Victim</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Submits structured questionnaire with 1-click GPS detection, receives instant step-by-step first-aid guidance.
              </p>
            </div>

            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center text-xs mb-3">2</div>
              <Sparkles className="w-6 h-6 text-red-500 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 dark:text-white">Smart Priority Engine</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Organizes clinical findings into RED / YELLOW / GREEN priority categories and formulates SBAR clinical summaries.
              </p>
            </div>

            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs mb-3">3</div>
              <Ambulance className="w-6 h-6 text-amber-500 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 dark:text-white">Ambulance EMS 108</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Receives telemetry on route, prepares recommended equipment, updates live ETA, and activates hospital pre-alert.
              </p>
            </div>

            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs mb-3">4</div>
              <Building2 className="w-6 h-6 text-emerald-500 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 dark:text-white">Hospital Trauma ER</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Acknowledges incoming trauma alert, readies surgical bays, cross-matches blood, and eliminates ER admission bottleneck.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES SHOWCASE */}
      <section className="py-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emergency-600 dark:text-emergency-400">
              Engineered Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 dark:text-white mt-1">
              Comprehensive Features for High-Stakes Response
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              Every feature in JIVAN SETU addresses a specific point of failure in pre-hospital emergency care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <FileText className="w-8 h-8 text-emergency-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                Smart Emergency Questionnaire
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Streamlined mobile-friendly form capturing consciousness (AVPU), breathing patterns, active arterial bleeding, and suspected fractures within 45 seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <Sparkles className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                AI Emergency Assistant
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive conversational assistant with strict clinical guardrails, capable of guiding users through CPR, bleeding pressure, and drafting SBAR handovers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <Activity className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                Smart Patient Priority Matrix
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Deterministic clinical rules engine categorizing cases into RED (Critical), YELLOW (Urgent), and GREEN (Lower Urgency) without arbitrary downgrading.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <HeartPulse className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                Bilingual First-Aid Protocols
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Medically reviewed first-aid actions for CPR, Choking, Severe Bleeding, Burns, and Stroke in English and Hindi with voice readout support.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <Stethoscope className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                Ambulance Equipment Recommender
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically suggests tailored ALS / BLS equipment checklists (Defibrillator, Intubation Kit, Vacuum Splints, Cervical Collars) to the responding crew.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <Building2 className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                Hospital Pre-Alert Console
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sends advance digital trauma alerts to destination emergency departments with ETA, vital signs summary, and required bay setup.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <Route className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                OpenStreetMap Route Tracking
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Live interactive Leaflet map rendering Ambulance location, Incident site, and Hospital trauma center with route calculation and distance metrics.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <Mic className="w-8 h-8 text-cyan-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                Voice Assistant & Dictation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Speech-to-text input enables agitated bystanders to describe incidents hands-free in their native dialect during critical moments.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:shadow-md transition">
              <Globe2 className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1.5">
                Bilingual Multilingual Support
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant toggling between English and Hindi across the entire platform ensuring rapid accessibility for diverse Indian populations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. VISUAL WORKFLOW SECTION */}
      <section id="how-it-works" className="py-16 bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              End-to-End Operational Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 dark:text-white mt-1">
              How JIVAN SETU Operates in an Emergency
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              Step-by-step lifecycle from bystander report to hospital emergency department admission.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              
              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-emergency-600 text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow">
                  1
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white mb-1">
                  Incident Report
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bystander logs location, emergency category, and victim count in 30 seconds.
                </p>
              </div>

              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow">
                  2
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white mb-1">
                  Vital Observations
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Quick questionnaire evaluates consciousness, breathing, and hemorrhage.
                </p>
              </div>

              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow">
                  3
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white mb-1">
                  Smart Priority (RED)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Deterministic algorithm stratifies urgency and formulates SBAR clinical summary.
                </p>
              </div>

              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow">
                  4
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white mb-1">
                  Ambulance Dispatch
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Nearest ALS/BLS crew accepts call, reviews equipment, and navigates via live GPS.
                </p>
              </div>

              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow">
                  5
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white mb-1">
                  Hospital Pre-Alert
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Trauma center readies resuscitation bay and blood before ambulance arrival.
                </p>
              </div>

            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Experience the Interactive 9-Step Demo Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & EMERGENCY REMINDER */}
      <section className="py-16 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Emergency Services Coordination Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience the Future of Emergency Healthcare?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Test the live prototype right now by filing a simulated incident or switching across our role dashboards for Ambulances, Hospitals, and System Administrators.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/report"
              className="px-6 py-3.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-sm shadow-xl shadow-red-500/30 hover:scale-105 transition"
            >
              Simulate Emergency Incident
            </Link>
            <Link
              to="/ambulance"
              className="px-5 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 font-semibold text-sm transition"
            >
              Open Ambulance 108 Console
            </Link>
            <Link
              to="/hospital"
              className="px-5 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 font-semibold text-sm transition"
            >
              Open Hospital ER Console
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
