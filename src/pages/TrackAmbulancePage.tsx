import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  Ambulance, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Copy, 
  FileText, 
  HeartPulse, 
  LifeBuoy, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  User 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { LeafletMap } from '../components/map/LeafletMap';

export const TrackAmbulancePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  const { reports, ambulances, hospitals, addToast, language } = useJivanSetu();

  // Selected ID state
  const [searchId, setSearchId] = useState<string>(queryId || (reports[0]?.id || ''));
  const [activeReportId, setActiveReportId] = useState<string>(queryId || (reports[0]?.id || ''));

  useEffect(() => {
    if (queryId) {
      setSearchId(queryId);
      setActiveReportId(queryId);
    } else if (reports.length > 0 && !activeReportId) {
      setSearchId(reports[0].id);
      setActiveReportId(reports[0].id);
    }
  }, [queryId, reports]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim();
    if (!clean) return;
    const found = reports.find(r => r.id.toLowerCase() === clean.toLowerCase());
    if (found) {
      setActiveReportId(found.id);
      setSearchParams({ id: found.id });
      addToast('info', 'Record Located', `Tracking Emergency ${found.id}`);
    } else {
      addToast('danger', 'Not Found', `No emergency request found matching: "${clean}"`);
    }
  };

  const selectPrebuiltId = (id: string) => {
    setSearchId(id);
    setActiveReportId(id);
    setSearchParams({ id });
  };

  const report = reports.find(r => r.id.toLowerCase() === activeReportId.toLowerCase()) || reports[0];
  const assignedAmb = ambulances.find(a => a.id === report?.assignedAmbulanceId) || ambulances[0];
  const assignedHosp = hospitals.find(h => h.id === report?.assignedHospitalId) || hospitals[0];

  const copyId = () => {
    if (report) {
      navigator.clipboard.writeText(report.id);
      addToast('success', 'Copied', `${report.id} copied to clipboard`);
    }
  };

  const steps = [
    { name: 'Request Received', done: true, current: report?.status === 'Received' },
    { name: 'Unit Assigned', done: ['Accepted', 'Ambulance Assigned', 'En Route', 'Arrived', 'Patient Transporting', 'Completed'].includes(report?.status || ''), current: report?.status === 'Accepted' || report?.status === 'Ambulance Assigned' },
    { name: 'En Route to Scene', done: ['En Route', 'Arrived', 'Patient Transporting', 'Completed'].includes(report?.status || ''), current: report?.status === 'En Route' },
    { name: 'Arrived at Scene', done: ['Arrived', 'Patient Transporting', 'Completed'].includes(report?.status || ''), current: report?.status === 'Arrived' },
    { name: 'Hospital Handover', done: report?.status === 'Completed', current: report?.status === 'Patient Transporting' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 shadow-sm transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Live Ambulance Dispatch Telemetry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white">
                Track Ambulance
              </h1>
            </div>
          </div>

          <a
            href="tel:112"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-red-500/20"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Hotline 112</span>
          </a>
        </div>

        {/* Search Bar / Lookup Section */}
        <div className="bg-white dark:bg-navy-900 p-5 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Emergency Request ID: e.g. JS-2026-XXXX"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emergency-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-950 dark:bg-emergency-600 dark:hover:bg-emergency-700 text-white font-extrabold text-xs uppercase tracking-wider shadow transition"
            >
              Lookup Tracking
            </button>
          </form>

          {/* Quick Select Buttons from Recent Reports */}
          {reports.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-semibold">Active Emergencies:</span>
              {reports.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectPrebuiltId(r.id)}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold transition ${
                    activeReportId === r.id
                      ? 'bg-emergency-50 dark:bg-emergency-950/60 border-emergency-500 text-emergency-600 dark:text-emergency-300'
                      : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {r.id}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Demo / Simulation Transparency Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>?? Academic Engineering Demo — Simulated GPS Telemetry:</strong>
            <p className="leading-relaxed">
              This live ambulance tracking is a functional prototype simulation. No commercial GPS fleet API is active, and no real-world vehicle has been dispatched. In any actual life-threatening medical situation, immediately call India’s National Emergency Number <strong>112</strong>.
            </p>
          </div>
        </div>

        {report ? (
          <>
            {/* Incident Header & Lifecycle Timeline */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-navy-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold text-navy-950 dark:text-white">
                      Request ID: <span className="font-mono text-emergency-600">{report.id}</span>
                    </h2>
                    <button onClick={copyId} title="Copy Request ID" className="text-slate-400 hover:text-slate-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Emergency Type: <strong className="text-slate-800 dark:text-slate-200">{report.emergencyType}</strong> • Registered: {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <PriorityBadge priority={report.priority} size="md" />
                  <Link
                    to={`/patient-info?id=${report.id}`}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 hover:bg-blue-100"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Add Patient Info</span>
                  </Link>
                </div>
              </div>

              {/* Lifecycle Stage Steps */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Dispatch Lifecycle Progress
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {steps.map((st, idx) => (
                    <div
                      key={st.name}
                      className={`p-3 rounded-2xl border text-center transition ${
                        st.current
                          ? 'bg-emergency-50 dark:bg-emergency-950/40 border-emergency-500 text-emergency-900 dark:text-emergency-200 ring-2 ring-emergency-500/20'
                          : st.done
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-400'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold">
                        {st.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="text-[10px] font-mono">{idx + 1}</span>
                        )}
                      </div>
                      <div className="text-xs font-bold">{st.name}</div>
                      {st.current && (
                        <span className="text-[9px] text-emergency-600 font-extrabold uppercase block mt-0.5 animate-pulse">
                          Current Stage
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map & Telemetry Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Map Column (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-navy-900 p-5 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-sm font-bold text-navy-950 dark:text-white">
                        Live Route Map (Victim, Ambulance, Hospital)
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-emergency-600 bg-emergency-50 dark:bg-emergency-950/40 px-2 py-0.5 rounded-md">
                      Simulated ETA: ~{report.etaMinutes || 4} Mins
                    </span>
                  </div>

                  <LeafletMap
                    emergencyLocation={report.location}
                    ambulanceLocation={assignedAmb?.currentLocation}
                    hospitalLocation={assignedHosp?.location}
                    height="340px"
                    zoom={14}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Incident Location</span>
                      <strong className="text-slate-900 dark:text-white block mt-0.5">{report.location.address}</strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Destination Hospital</span>
                      <strong className="text-slate-900 dark:text-white block mt-0.5">{assignedHosp.name}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambulance & Hospital Details (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Ambulance Unit Card */}
                <div className="bg-white dark:bg-navy-900 p-5 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                        <Ambulance className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-950 dark:text-white">
                          {assignedAmb.callSign}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {assignedAmb.vehicleNumber} • {assignedAmb.type}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`tel:${assignedAmb.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Crew</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Lead Paramedic</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{assignedAmb.paramedicName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Driver</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{assignedAmb.driverName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Base Hub</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{assignedAmb.baseStation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Equipment</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Defibrillator & O2 Ready</span>
                    </div>
                  </div>
                </div>

                {/* Patient Summary Card */}
                <div className="bg-white dark:bg-navy-900 p-5 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-red-500" />
                      <span>Current Patient Telemetry</span>
                    </h4>
                    <Link
                      to={`/patient-info?id=${report.id}`}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit Info ?
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Name & Age</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {report.patientName || 'Anonymous'} ({report.patientAge ? `${report.patientAge}y` : 'Age N/A'})
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Consciousness</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {report.consciousness}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Breathing</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {report.breathing}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Bleeding</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {report.severeBleeding}
                      </span>
                    </div>
                  </div>
                </div>

                {/* First Aid Quick Link */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <LifeBuoy className="w-4 h-4 text-amber-300" />
                    <span>Immediate First-Aid While Waiting</span>
                  </div>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    Access step-by-step guidance for CPR, severe bleeding compression, and stroke positioning while the ambulance is en route.
                  </p>
                  <Link
                    to="/first-aid"
                    className="inline-block mt-1 px-4 py-2 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow hover:bg-emerald-50 transition"
                  >
                    Open First Aid Guide ?
                  </Link>
                </div>

              </div>

            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800 p-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">No Emergency Record Selected</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please enter your Emergency Request ID above or initiate an SOS booking from the home screen.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emergency-600 text-white font-bold text-xs"
            >
              Go to Home Screen
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
