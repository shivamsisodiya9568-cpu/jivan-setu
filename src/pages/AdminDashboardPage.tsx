import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  Ambulance, 
  BarChart3, 
  Building2, 
  Download, 
  Filter, 
  HeartPulse, 
  MapPin, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { PriorityLevel } from '../types/emergency';

export const AdminDashboardPage: React.FC = () => {
  const { reports, ambulances, hospitals, resetAllData, addToast } = useJivanSetu();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'requests' | 'fleet' | 'hospitals'>('requests');

  // Filtered emergency requests
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.emergencyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Analytics Stats
  const totalReports = reports.length;
  const criticalCount = reports.filter(r => r.priority === 'RED').length;
  const urgentCount = reports.filter(r => r.priority === 'YELLOW').length;
  const greenCount = reports.filter(r => r.priority === 'GREEN').length;
  const activeDispatches = reports.filter(r => r.status !== 'Completed' && r.status !== 'Rejected').length;

  const exportCSV = () => {
    const headerStr = 'ID,CreatedAt,Reporter,Phone,Type,Priority,Status,Location,Victims\n';
    const rows = filteredReports.map(r => 
      `"${r.id}","${r.createdAt}","${r.reporterName}","${r.reporterPhone}","${r.emergencyType}","${r.priority}","${r.status}","${r.location.address.replace(/"/g, '""')}","${r.victimCount}"`
    );
    const blob = new Blob([headerStr + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jivan_setu_emergency_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    addToast('success', 'CSV Export Complete', 'Downloaded emergency incident records.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Hub Header */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
                  State Emergency Response Command Hub
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Centralized telemetry, fleet allocation, hospital network status, and operational intelligence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={resetAllData}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
              title="Reset state to initial sample emergencies"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Requests Logged</span>
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white mt-1">{totalReports}</div>
            <span className="text-[11px] text-purple-600 font-semibold">{activeDispatches} actively en route</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Priority Breakdown</span>
            <div className="flex items-center gap-2 mt-1.5 text-xs font-bold">
              <span className="text-red-600">{criticalCount} RED</span>
              <span>•</span>
              <span className="text-amber-500">{urgentCount} YEL</span>
              <span>•</span>
              <span className="text-emerald-500">{greenCount} GRN</span>
            </div>
            <span className="text-[11px] text-slate-400">Deterministic Triage Engine</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">108 Fleet Readiness</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {ambulances.filter(a => a.status === 'Available').length} / {ambulances.length} Units Free
            </div>
            <span className="text-[11px] text-slate-400">ALS & BLS Ready</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hospital Network</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{hospitals.length} Centers</div>
            <span className="text-[11px] text-slate-400">AIIMS, Safdarjung, RML</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-navy-800 pb-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'requests'
                ? 'bg-emergency-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            Emergency History & Triage ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'fleet'
                ? 'bg-emergency-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            Ambulance Fleet Status ({ambulances.length})
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'hospitals'
                ? 'bg-emergency-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            Hospitals Network ({hospitals.length})
          </button>
        </div>

        {/* TAB 1: EMERGENCY REQUESTS TABLE */}
        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm overflow-hidden">
            
            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-navy-800 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, caller, location, or type..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="RED">RED - Critical</option>
                  <option value="YELLOW">YELLOW - Urgent</option>
                  <option value="GREEN">GREEN - Stable</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Received">Received</option>
                  <option value="Accepted">Accepted</option>
                  <option value="En Route">En Route</option>
                  <option value="Arrived">Arrived</option>
                  <option value="Patient Transporting">Transporting</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-navy-950 text-slate-500 border-b border-slate-200 dark:border-navy-800 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5">Incident Type</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Reporter & Location</th>
                    <th className="p-3.5">Assigned Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                        <td className="p-3.5 font-mono font-bold text-navy-950 dark:text-white">{r.id}</td>
                        <td className="p-3.5 text-slate-500">{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{r.emergencyType}</td>
                        <td className="p-3.5">
                          <PriorityBadge priority={r.priority} size="sm" />
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold px-2 py-0.5 rounded uppercase text-[10px] bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <strong className="block text-slate-800 dark:text-slate-200">{r.reporterName}</strong>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{r.location.address}</span>
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono">
                          {r.assignedAmbulanceId || 'Unassigned'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No emergency incident records match the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: AMBULANCE FLEET */}
        {activeTab === 'fleet' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ambulances.map((amb) => (
              <div key={amb.id} className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ambulance className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-bold text-navy-950 dark:text-white">{amb.callSign}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    amb.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {amb.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div><strong>Plate:</strong> {amb.vehicleNumber}</div>
                  <div><strong>Type:</strong> {amb.type}</div>
                  <div><strong>Paramedic:</strong> {amb.paramedicName}</div>
                  <div><strong>Driver:</strong> {amb.driverName}</div>
                  <div><strong>Phone:</strong> {amb.phone}</div>
                  <div><strong>Base:</strong> {amb.baseStation}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-navy-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Onboard Equipment</span>
                  <div className="flex flex-wrap gap-1">
                    {amb.equipment.slice(0, 3).map((eq, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: HOSPITAL NETWORK */}
        {activeTab === 'hospitals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hospitals.map((hosp) => (
              <div key={hosp.id} className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-navy-950 dark:text-white">{hosp.name}</h4>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div><strong>Category:</strong> {hosp.category}</div>
                  <div><strong>Emergency Phone:</strong> {hosp.emergencyContact}</div>
                  <div><strong>Hotline:</strong> {hosp.traumaHotline}</div>
                  <div><strong>ICU Capacity:</strong> {hosp.availableIcuBeds} / {hosp.totalIcuBeds} Beds Free</div>
                  <div><strong>Open Trauma Bays:</strong> {hosp.availableTraumaBays}</div>
                  <div><strong>Address:</strong> {hosp.location.address}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-navy-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Specialties</span>
                  <div className="flex flex-wrap gap-1">
                    {hosp.specialties.slice(0, 3).map((sp, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
