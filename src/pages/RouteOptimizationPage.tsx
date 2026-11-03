import React, { useState } from 'react';
import { 
  AlertCircle, 
  Ambulance, 
  Building2, 
  Compass, 
  Info, 
  MapPin, 
  Navigation, 
  Radio, 
  Route, 
  ShieldAlert, 
  TrafficCone, 
  Zap 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { PriorityBadge } from '../components/common/PriorityBadge';

export const RouteOptimizationPage: React.FC = () => {
  const { reports, ambulances, hospitals } = useJivanSetu();
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');

  const report = reports.find(r => r.id === selectedReportId) || reports[0];
  const assignedAmb = ambulances.find(a => a.id === report?.assignedAmbulanceId) || ambulances[0];
  const assignedHosp = hospitals.find(h => h.id === report?.assignedHospitalId) || hospitals[0];

  // Route metrics (simulated realistic telemetry)
  const ambulanceToSceneDist = 1.4; // km
  const ambulanceToSceneTime = 3.5; // mins
  const sceneToHospDist = 2.8; // km
  const sceneToHospTime = 6.2; // mins
  const totalDist = (ambulanceToSceneDist + sceneToHospDist).toFixed(1);
  const totalTime = Math.round(ambulanceToSceneTime + sceneToHospTime);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
                  Intelligent Route Optimization & Corridor Tracking
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  OpenStreetMap Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live waypoint tracking: Ambulance Depot ➔ Incident Ground ➔ Trauma ER Corridor.
              </p>
            </div>
          </div>

          {/* Incident Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Track Incident:</span>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono font-bold"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.emergencyType} - {r.priority})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Traffic Signal Smart Corridor Disclaimer Notice (Mandatory Requirement) */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold">
            <TrafficCone className="w-4 h-4 text-amber-600" />
            <span>Smart City Emergency Green-Corridor Architecture Notice:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            <strong>System Clarification:</strong> Emergency traffic signal preemption is presented as a planned architectural integration with municipal smart-city ITMS (Intelligent Traffic Management Systems). JIVAN SETU does NOT claim to independently control public municipal traffic lights directly without municipal traffic police authorization.
          </p>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ambulance to Scene</span>
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white mt-1">{ambulanceToSceneDist} km</div>
            <span className="text-[11px] text-emergency-600 font-semibold">ETA ~ {ambulanceToSceneTime} mins</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scene to Hospital</span>
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white mt-1">{sceneToHospDist} km</div>
            <span className="text-[11px] text-blue-600 font-semibold">Transit ~ {sceneToHospTime} mins</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Route Corridor</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{totalDist} km</div>
            <span className="text-[11px] text-slate-400">Total time ~ {totalTime} mins</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Traffic Congestion</span>
            <div className="text-2xl font-extrabold text-amber-500 mt-1">Moderate</div>
            <span className="text-[11px] text-slate-400">Dynamic routing active</span>
          </div>
        </div>

        {/* Main Map & Waypoint Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Map View (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-2">
                <Route className="w-4 h-4 text-blue-500" />
                <span>Geospatial Waypoints on OpenStreetMap</span>
              </h3>
              {report && <PriorityBadge priority={report.priority} size="sm" />}
            </div>

            <LeafletMap
              emergencyLocation={report?.location}
              ambulanceLocation={assignedAmb?.currentLocation}
              hospitalLocation={assignedHosp?.location}
              height="450px"
              zoom={13}
            />

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-navy-800 border-2 border-sky-400" /> 🚑 Ambulance ({assignedAmb?.callSign})
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-red-600 border-2 border-white" /> 📍 Incident ({report?.id})
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white" /> 🏥 Hospital ({assignedHosp?.shortName})
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Real-time GPS Lat/Lng</span>
            </div>
          </div>

          {/* Waypoint Steps & Telemetry (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Three-Point Transit Corridor
              </h3>

              {/* Waypoint 1: Ambulance */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  A
                </div>
                <div className="text-xs">
                  <strong className="block text-navy-950 dark:text-white">Ambulance Base Station</strong>
                  <span className="text-slate-500">{assignedAmb.baseStation}</span>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                    Status: {assignedAmb.status}
                  </div>
                </div>
              </div>

              {/* Waypoint 2: Incident */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                  B
                </div>
                <div className="text-xs">
                  <strong className="block text-red-900 dark:text-red-200">Incident Location</strong>
                  <span className="text-slate-600 dark:text-slate-400">{report.location.address}</span>
                  <div className="text-[10px] text-red-600 font-bold mt-1">
                    Priority: {report.priority} • {report.victimCount} Casualty(ies)
                  </div>
                </div>
              </div>

              {/* Waypoint 3: Hospital */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  C
                </div>
                <div className="text-xs">
                  <strong className="block text-emerald-900 dark:text-emerald-200">Destination Hospital ER</strong>
                  <span className="text-slate-600 dark:text-slate-400">{assignedHosp.name}</span>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                    Trauma Bay Pre-Alert: {report.hospitalPreAlertAcknowledged ? 'Acknowledged' : 'Active'}
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Smart Corridor Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-white border border-navy-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Zap className="w-4 h-4" />
                <span>Simulated Smart Traffic Signal Priority</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                In next-generation smart cities, JIVAN SETU broadcasts vehicle GPS telemetry to authorized municipal traffic control servers to extend green light intervals along the ambulance transit vector.
              </p>
              <div className="text-[10px] text-slate-400 border-t border-navy-800 pt-2">
                Planned Future API Integration • IoT Beacon Ready
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
