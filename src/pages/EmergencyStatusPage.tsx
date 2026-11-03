import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  Ambulance, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Copy, 
  HeartPulse, 
  LifeBuoy, 
  MapPin, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles, 
  Stethoscope 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { LeafletMap } from '../components/map/LeafletMap';
import { FIRST_AID_PROTOCOLS } from '../data/firstAidData';

export const EmergencyStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { reports, ambulances, hospitals, addToast, language } = useJivanSetu();

  const report = reports.find(r => r.id === id) || reports[0];
  const assignedAmb = ambulances.find(a => a.id === report?.assignedAmbulanceId) || ambulances[0];
  const assignedHosp = hospitals.find(h => h.id === report?.assignedHospitalId) || hospitals[0];

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Emergency Record Not Found</h2>
          <Link to="/report" className="inline-block px-4 py-2 bg-emergency-600 text-white rounded-lg text-xs font-bold">
            Report New Incident
          </Link>
        </div>
      </div>
    );
  }

  // Find relevant first aid protocol for bystander to read while waiting
  let matchedProtocol = FIRST_AID_PROTOCOLS[0];
  if (report.emergencyType.includes('Cardiac') || report.breathing === 'Not Breathing') {
    matchedProtocol = FIRST_AID_PROTOCOLS.find(p => p.id === 'cpr') || FIRST_AID_PROTOCOLS[0];
  } else if (report.severeBleeding.startsWith('Severe') || report.severeBleeding.startsWith('Moderate')) {
    matchedProtocol = FIRST_AID_PROTOCOLS.find(p => p.id === 'severe-bleeding') || FIRST_AID_PROTOCOLS[0];
  } else if (report.emergencyType.includes('Burn')) {
    matchedProtocol = FIRST_AID_PROTOCOLS.find(p => p.id === 'burns') || FIRST_AID_PROTOCOLS[0];
  } else if (report.emergencyType.includes('Stroke')) {
    matchedProtocol = FIRST_AID_PROTOCOLS.find(p => p.id === 'stroke') || FIRST_AID_PROTOCOLS[0];
  } else if (report.emergencyType.includes('Fracture') || report.suspectedInjuries.some(i => i.includes('Spine'))) {
    matchedProtocol = FIRST_AID_PROTOCOLS.find(p => p.id === 'fractures') || FIRST_AID_PROTOCOLS[0];
  }

  const copyId = () => {
    navigator.clipboard.writeText(report.id);
    addToast('success', 'Incident ID Copied', `${report.id} copied to clipboard.`);
  };

  const steps = [
    { name: 'Incident Received', done: true, current: report.status === 'Received' },
    { name: 'Ambulance Assigned', done: ['Accepted', 'Ambulance Assigned', 'En Route', 'Arrived', 'Patient Transporting', 'Completed'].includes(report.status), current: report.status === 'Accepted' || report.status === 'Ambulance Assigned' },
    { name: 'Unit En Route', done: ['En Route', 'Arrived', 'Patient Transporting', 'Completed'].includes(report.status), current: report.status === 'En Route' },
    { name: 'Arrived at Scene', done: ['Arrived', 'Patient Transporting', 'Completed'].includes(report.status), current: report.status === 'Arrived' },
    { name: 'Hospital Handover', done: report.status === 'Completed', current: report.status === 'Patient Transporting' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
                  Live Emergency Tracking
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                  {report.id}
                </span>
                <button onClick={copyId} title="Copy Incident ID" className="text-slate-400 hover:text-slate-600">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transmitted on {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Reporter: {report.reporterName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PriorityBadge priority={report.priority} size="md" />
            <a
              href="tel:112"
              className="px-4 py-2 rounded-xl bg-emergency-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow hover:bg-emergency-700"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112 Help</span>
            </a>
          </div>
        </div>

        {/* Status Tracker Bar */}
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Response Status Lifecycle
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((st, idx) => (
              <div
                key={st.name}
                className={`p-3 rounded-xl border text-center relative ${
                  st.current
                    ? 'bg-emergency-50 dark:bg-emergency-950/40 border-emergency-500 text-emergency-900 dark:text-emergency-200 ring-2 ring-emergency-500/30'
                    : st.done
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold">
                  {st.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <span className="text-[11px] font-mono">{idx + 1}</span>
                  )}
                </div>
                <div className="text-xs font-bold">{st.name}</div>
                {st.current && (
                  <span className="text-[10px] text-emergency-600 font-extrabold uppercase block mt-0.5 animate-pulse">
                    Current Stage
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grid: Left Column (Map & Tracking) | Right Column (Actions & Guidance) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live Map & Dispatch Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Map */}
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-navy-950 dark:text-white">
                    Live Route & Location Telemetry
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-emergency-600">
                  ETA ~ {report.etaMinutes || 5} Mins
                </span>
              </div>

              <LeafletMap
                emergencyLocation={report.location}
                ambulanceLocation={assignedAmb?.currentLocation}
                hospitalLocation={assignedHosp?.location}
                height="320px"
                zoom={14}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Incident Location</span>
                  <strong className="text-navy-950 dark:text-white block mt-0.5">{report.location.address}</strong>
                  {report.location.landmark && (
                    <span className="text-[11px] text-slate-500">Landmark: {report.location.landmark}</span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Destination Hospital</span>
                  <strong className="text-navy-950 dark:text-white block mt-0.5">{assignedHosp.name}</strong>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Apex Level 1 Trauma Center • ER Pre-Alert Active
                  </span>
                </div>
              </div>
            </div>

            {/* Ambulance Unit Telemetry Card */}
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                    <Ambulance className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-950 dark:text-white">
                      {assignedAmb.callSign}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Vehicle: {assignedAmb.vehicleNumber} • {assignedAmb.type}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${assignedAmb.phone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Crew</span>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Lead Paramedic</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{assignedAmb.paramedicName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pilot / Driver</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{assignedAmb.driverName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Base Station</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{assignedAmb.baseStation}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Triage Assessment & Immediate First-Aid (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Triage Findings Summary */}
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emergency-600" />
                  <span>Preliminary Urgency Evaluation</span>
                </h3>
                <PriorityBadge priority={report.priority} size="sm" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs space-y-2">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {report.priorityReason}
                </p>

                {report.warningSigns.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-navy-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-red-500">Reported Red Flags:</span>
                    {report.warningSigns.map((w, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-red-600 dark:text-red-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hospital Pre-Alert Confirmation */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Hospital ER Pre-Alert Transmitted</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  {report.hospitalPreparationNotes || 'Emergency physician on duty has been notified. Resuscitation bay and diagnostic team cleared.'}
                </p>
              </div>
            </div>

            {/* Crucial First-Aid to do WHILE waiting */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-950 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <LifeBuoy className="w-5 h-5 animate-spin" />
                  <span>While Ambulance is En Route</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Action Steps
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-navy-950 dark:text-white">
                  {language === 'hi' ? matchedProtocol.titleHi : matchedProtocol.titleEn}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'hi' ? matchedProtocol.summaryHi : matchedProtocol.summaryEn}
                </p>
              </div>

              {/* Immediate Steps List */}
              <div className="space-y-2">
                {(language === 'hi' ? matchedProtocol.immediateStepsHi : matchedProtocol.immediateStepsEn).slice(0, 3).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
                <Link
                  to="/first-aid"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  View Complete First-Aid Guide <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>
                <Link
                  to="/ai-assistant"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Ask AI Assistant
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
