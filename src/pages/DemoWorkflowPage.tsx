import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  AlertOctagon, 
  Ambulance, 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  Check, 
  CheckCircle2, 
  FileText, 
  Play, 
  RefreshCw, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { LeafletMap } from '../components/map/LeafletMap';

export const DemoWorkflowPage: React.FC = () => {
  const { reports, ambulances, hospitals, updateStatus, acknowledgeHospitalPreAlert, addToast, resetAllData } = useJivanSetu();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);

  // Focus on the primary demo report: JS-2026-9041
  const report = reports[0];
  const amb = ambulances[0];
  const hosp = hospitals[0];

  const demoSteps = [
    {
      step: 1,
      title: 'Bystander Submits Emergency Report',
      actor: 'Public Bystander (Vikram Mehta)',
      description: 'A witness reports a high-speed motorcycle accident near Safdarjung Flyover with 2 injured victims, head trauma, and severe bleeding.',
      systemAction: 'Collects vital observations (AVPU, breathing, hemorrhage) & captures browser GPS coordinates.',
      statusTarget: 'Received'
    },
    {
      step: 2,
      title: 'System Generates Unique Emergency Request ID',
      actor: 'JIVAN SETU Gateway',
      description: `Generates encrypted incident tracking ID "${report?.id || 'JS-2026-9041'}" and creates an immutable audit trail entry.`,
      systemAction: 'Persists record into local database and broadcasts state to EMS and ER queues.',
      statusTarget: 'Received'
    },
    {
      step: 3,
      title: 'Deterministic Smart Patient Priority & SBAR',
      actor: 'Clinical Triage Engine',
      description: 'Because patient has altered consciousness and severe bleeding, algorithm assigns RED – CRITICAL priority with prominent disclaimers.',
      systemAction: 'Generates structured SBAR patient handover summary and recommends ALS Defibrillator + Tourniquet equipment.',
      statusTarget: 'Received'
    },
    {
      step: 4,
      title: 'Ambulance Dashboard Receives Telemetry',
      actor: '108 EMS Eagle-1 ALS Crew',
      description: 'Responding paramedic receives priority badge, patient clinical flags, and equipment recommendations on the vehicle tablet.',
      systemAction: 'Matches nearest available Advanced Life Support unit (Eagle-1 ALS) located 1.4 km away.',
      statusTarget: 'Received'
    },
    {
      step: 5,
      title: 'Ambulance Personnel Accept Assignment',
      actor: 'Paramedic Ritu Vashishta',
      description: 'Paramedic reviews critical RED flags and clicks "Accept Assignment", changing status to Accepted.',
      systemAction: 'Notifies caller tracking interface that an ambulance crew is mobilized.',
      statusTarget: 'Accepted'
    },
    {
      step: 6,
      title: 'Ambulance Status Advances to "En Route"',
      actor: 'Driver Rajesh Kumar',
      description: 'Siren activated, GPS tracking calculates a 4-minute ETA to the Safdarjung Flyover incident scene.',
      systemAction: 'Starts live corridor route navigation and updates bystander map.',
      statusTarget: 'En Route'
    },
    {
      step: 7,
      title: 'Hospital Emergency Department Receives Pre-Alert',
      actor: 'AIIMS Apex Trauma Center',
      description: 'Trauma ER console sounds an advance digital chime, displaying incoming patient SBAR vitals and estimated arrival.',
      systemAction: 'Eliminates ER admission surprise; prompts charge nurse to clear a trauma resuscitation bay.',
      statusTarget: 'En Route'
    },
    {
      step: 8,
      title: 'Hospital Acknowledges Pre-Alert & Readies Bay',
      actor: 'ER Charge Nurse / On-Duty Physician',
      description: 'Hospital acknowledges pre-alert: Resuscitation Bay 1 cleared, CT team alerted, and 2 units O-negative blood reserved.',
      systemAction: 'Sets hospitalPreAlertAcknowledged = true, reassuring ambulance crew while en route.',
      statusTarget: 'Patient Transporting'
    },
    {
      step: 9,
      title: 'Patient Handover Completed at Trauma Center',
      actor: 'Hospital ER Team & Paramedics',
      description: 'Patient arrives at AIIMS Trauma Bay 1. Paramedic hands over physical vitals, and the case is closed in the system.',
      systemAction: 'Logs total turnaround time, frees the ambulance back to "Available", and archives the incident record.',
      statusTarget: 'Completed'
    }
  ];

  const currentStepData = demoSteps[currentStep - 1];

  const executeCurrentStepAction = () => {
    if (!report) return;

    if (currentStep === 5) {
      updateStatus(report.id, 'Accepted', 'Eagle-1 Paramedic', 'Demo: Crew accepted dispatch.');
    } else if (currentStep === 6) {
      updateStatus(report.id, 'En Route', 'Eagle-1 Driver', 'Demo: Ambulance en route with siren.');
    } else if (currentStep === 7) {
      updateStatus(report.id, 'En Route', 'EMS Gateway', 'Demo: Hospital pre-alert triggered.', {
        hospitalPreAlertSent: true
      });
    } else if (currentStep === 8) {
      acknowledgeHospitalPreAlert(report.id, 'Demo: Trauma Bay 1 cleared and ready.', [
        'Trauma Bay 1',
        'O- Blood Cross-match',
        'Head CT Ready'
      ]);
      updateStatus(report.id, 'Patient Transporting', 'Eagle-1 Crew', 'Demo: Transporting victim to AIIMS.');
    } else if (currentStep === 9) {
      updateStatus(report.id, 'Completed', 'AIIMS Trauma Team', 'Demo: Patient handover completed.');
    }
  };

  const nextStep = () => {
    executeCurrentStepAction();
    if (currentStep < 9) {
      setCurrentStep(prev => prev + 1);
    } else {
      addToast('success', 'Demonstration Finished', 'All 9 stages of the JIVAN SETU workflow demonstrated successfully!');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetWorkflow = () => {
    resetAllData();
    setCurrentStep(1);
    setIsPlayingAuto(false);
    addToast('info', 'Demo Reset', 'Reset back to Step 1.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Presentation Header */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
                  9-Step Academic Demonstration Wizard
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Faculty Presentation Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Step-by-step walkthrough demonstrating how JIVAN SETU bridges the emergency response lifecycle.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetWorkflow}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider">
              Step {currentStep} of 9: {currentStepData.title}
            </span>
            <span className="font-mono font-bold text-emergency-600">
              {Math.round((currentStep / 9) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-navy-950 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emergency-600 via-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 9) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 text-center pt-1">
            {demoSteps.map((st) => (
              <button
                key={st.step}
                onClick={() => setCurrentStep(st.step)}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                  currentStep === st.step
                    ? 'bg-emergency-600 text-white shadow'
                    : currentStep > st.step
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-navy-950 text-slate-400 hover:bg-slate-200'
                }`}
              >
                Step {st.step}
              </button>
            ))}
          </div>
        </div>

        {/* Step Detailed Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Step Description & Role Context (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-navy-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                  Active Persona: {currentStepData.actor}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
                  Step {currentStepData.step}: {currentStepData.title}
                </h2>
              </div>
              <PriorityBadge priority="RED" size="md" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Scenario Narrative:</span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300 block">System Engineering Action:</span>
              <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-semibold">
                {currentStepData.systemAction}
              </p>
            </div>

            {/* Quick Link to corresponding live portal */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 self-center">Inspect in live portal:</span>
              <Link to="/report" className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 font-semibold">
                Bystander Form
              </Link>
              <Link to={`/status/${report?.id || 'JS-2026-9041'}`} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 font-semibold">
                Tracking View
              </Link>
              <Link to="/ambulance" className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                Ambulance 108
              </Link>
              <Link to="/hospital" className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                Hospital ER
              </Link>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 disabled:opacity-40 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-red-500/25"
              >
                <span>{currentStep === 9 ? 'Finish Demonstration' : 'Advance Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Live Telemetry State (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live System State
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                  {report?.id || 'JS-2026-9041'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between pb-1 border-b border-slate-100 dark:border-navy-800">
                  <span className="text-slate-500">Incident Status:</span>
                  <strong className="text-emergency-600 uppercase font-mono">{report?.status || 'Received'}</strong>
                </div>

                <div className="flex justify-between pb-1 border-b border-slate-100 dark:border-navy-800">
                  <span className="text-slate-500">Priority Level:</span>
                  <strong className="text-red-600 font-bold">RED (Critical)</strong>
                </div>

                <div className="flex justify-between pb-1 border-b border-slate-100 dark:border-navy-800">
                  <span className="text-slate-500">Assigned Unit:</span>
                  <strong className="text-navy-950 dark:text-white">{amb?.callSign} ({amb?.vehicleNumber})</strong>
                </div>

                <div className="flex justify-between pb-1 border-b border-slate-100 dark:border-navy-800">
                  <span className="text-slate-500">Receiving Hospital:</span>
                  <strong className="text-navy-950 dark:text-white">{hosp?.shortName}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Hospital Pre-Alert:</span>
                  <strong className={report?.hospitalPreAlertAcknowledged ? 'text-emerald-600' : 'text-amber-500'}>
                    {report?.hospitalPreAlertAcknowledged ? 'Bay 1 Prepared & Acknowledged' : 'Active Transmission'}
                  </strong>
                </div>
              </div>

              {/* Mini Map */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Corridor Telemetry:
                </span>
                <LeafletMap
                  emergencyLocation={report?.location}
                  ambulanceLocation={amb?.currentLocation}
                  hospitalLocation={hosp?.location}
                  height="200px"
                  zoom={13}
                />
              </div>
            </div>

            {/* Academic Grading Advice */}
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs space-y-1 text-purple-900 dark:text-purple-200">
              <strong className="block font-bold">Tip for Student Examination:</strong>
              <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                Highlight to examiners how JIVAN SETU replaces sequential phone calling with asynchronous parallel broadcasting, saving 8–15 minutes of crucial preparation time in the golden hour.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
