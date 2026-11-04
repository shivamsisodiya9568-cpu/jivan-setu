import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  HeartPulse, 
  Lock, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Stethoscope, 
  User, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { ConsciousnessLevel, BreathingStatus, BleedingLevel, EmergencyReport } from '../types/emergency';
import { PriorityBadge } from '../components/common/PriorityBadge';

export const PatientInfoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlReportId = searchParams.get('id');

  const { reports, activeReport, updatePatientInfo, addToast } = useJivanSetu();

  // Find target report: from URL param, or active report, or first report in list
  const defaultId = urlReportId || activeReport?.id || (reports.length > 0 ? reports[0].id : '');
  const [selectedReportId, setSelectedReportId] = useState<string>(defaultId);

  // Form Fields
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other' | 'Unknown'>('Unknown');
  const [reportedCondition, setReportedCondition] = useState('Severe Trauma');
  const [consciousness, setConsciousness] = useState<ConsciousnessLevel>('Alert & Responsive');
  const [breathing, setBreathing] = useState<BreathingStatus>('Normal');
  const [severeBleeding, setSevereBleeding] = useState<BleedingLevel>('None');
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');

  // UI State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<EmergencyReport | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const currentReport = reports.find(r => r.id === selectedReportId);

  // Pre-fill existing patient info if already present on the report
  useEffect(() => {
    if (currentReport) {
      if (currentReport.patientName) setPatientName(currentReport.patientName);
      if (currentReport.patientAge) setPatientAge(String(currentReport.patientAge));
      if (currentReport.patientGender) setPatientGender(currentReport.patientGender);
      if (currentReport.emergencyType) setReportedCondition(currentReport.emergencyType);
      if (currentReport.consciousness) setConsciousness(currentReport.consciousness);
      if (currentReport.breathing) setBreathing(currentReport.breathing);
      if (currentReport.severeBleeding) setSevereBleeding(currentReport.severeBleeding);
      if (currentReport.suspectedInjuries) setSelectedInjuries(currentReport.suspectedInjuries);
      if (currentReport.additionalNotes) setAdditionalDetails(currentReport.additionalNotes);
    }
  }, [selectedReportId, currentReport]);

  const injuryOptions = [
    'Head Trauma / Concussion',
    'Spinal / Cervical Spine Injury',
    'Limb / Extremity Fracture',
    'Chest Trauma / Flail Chest',
    'Abdominal Pain / Internal Bleeding',
    'Thermal / Chemical Burn',
    'Severe Deep Laceration',
    'Pelvic Injury',
    'Facial / Jaw Trauma'
  ];

  const handleInjuryToggle = (inj: string) => {
    if (selectedInjuries.includes(inj)) {
      setSelectedInjuries(selectedInjuries.filter(i => i !== inj));
    } else {
      setSelectedInjuries([...selectedInjuries, inj]);
    }
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!selectedReportId.trim()) {
      errors.reportId = 'Please select or enter an Emergency Request ID';
    }
    if (patientAge && (isNaN(Number(patientAge)) || Number(patientAge) < 0 || Number(patientAge) > 130)) {
      errors.patientAge = 'Please enter a valid age between 0 and 130';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('warning', 'Validation Check', 'Please correct the highlighted fields before submitting.');
      return;
    }

    const updates: Partial<EmergencyReport> = {
      patientName: patientName.trim() || 'Anonymous Patient',
      patientAge: patientAge ? Number(patientAge) : undefined,
      patientGender,
      emergencyType: reportedCondition as any,
      consciousness,
      breathing,
      severeBleeding,
      suspectedInjuries: selectedInjuries,
      additionalNotes: additionalDetails.trim()
    };

    const res = updatePatientInfo(selectedReportId, updates);
    if (res) {
      setSubmittedData(res);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToast('danger', 'Incident Not Found', `No active emergency record matches ID: ${selectedReportId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-xs font-bold mb-1">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span>Pre-Hospital Patient Clinical Telemetry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white">
                Patient Medical Information
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

        {/* Confidentiality Privacy Banner */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Authorized Clinical Sharing Only:</strong> Information submitted here is transmitted directly to the assigned 108 ambulance paramedic and receiving hospital trauma care team to assist in triage and early room preparation.
          </div>
        </div>

        {/* Success Banner if Just Submitted */}
        {isSubmitted && submittedData && (
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 shadow-md space-y-4">
            <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-lg font-extrabold">Patient Details Successfully Synchronized!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Transmitted to Incident <strong>{submittedData.id}</strong>. Both the ambulance crew and hospital trauma bay have received these updated clinical vitals.
                </p>
              </div>
            </div>

            {/* Summary card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-navy-900 border border-emerald-200 dark:border-emerald-800 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient</span>
                <strong className="text-slate-900 dark:text-white">{submittedData.patientName} ({submittedData.patientAge ? `${submittedData.patientAge}y` : 'Age N/A'}, {submittedData.patientGender})</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Consciousness</span>
                <strong className="text-slate-900 dark:text-white">{submittedData.consciousness}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Breathing</span>
                <strong className="text-slate-900 dark:text-white">{submittedData.breathing}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bleeding</span>
                <strong className="text-slate-900 dark:text-white">{submittedData.severeBleeding}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={`/track?id=${submittedData.id}`}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
              >
                <span>Track This Ambulance</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
              >
                Edit Details Further
              </button>
            </div>
          </div>
        )}

        {/* Patient Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Section 1: Emergency Request ID Connection */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-navy-800">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-navy-950 dark:text-white">
                1. Connected Emergency Request ID <span className="text-red-500">*</span>
              </label>
              {currentReport && (
                <PriorityBadge priority={currentReport.priority} size="sm" />
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select or type the Emergency ID generated from your SOS booking to attach patient details.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <select
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                >
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} — {r.emergencyType} ({r.location.address.slice(0, 30)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Or enter custom ID: e.g. JS-2026-XXXX"
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                />
                {formErrors.reportId && (
                  <span className="text-[11px] text-red-500 mt-1 block">{formErrors.reportId}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Patient Demographics (Optional) */}
          <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-navy-800">
            <h3 className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>2. Patient Identification (Optional)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Patient Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Age <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                />
                {formErrors.patientAge && (
                  <span className="text-[11px] text-red-500 mt-1 block">{formErrors.patientAge}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                >
                  <option value="Unknown">Unknown / Unspecified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Vitals & Status */}
          <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-navy-800">
            <h3 className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emergency-600" />
              <span>3. Vitals & Triage Indicators</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Reported Emergency Condition
                </label>
                <select
                  value={reportedCondition}
                  onChange={(e) => setReportedCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                >
                  <option value="Road Accident">Road Traffic Accident (RTA)</option>
                  <option value="Cardiac Arrest / Chest Pain">Cardiac Arrest / Acute Chest Pain</option>
                  <option value="Severe Trauma & Bleeding">Severe Trauma & Bleeding</option>
                  <option value="Respiratory Distress / Choking">Respiratory Distress / Choking</option>
                  <option value="Stroke / Neurological">Acute Stroke / Paralysis</option>
                  <option value="Severe Burn">Severe Burn / Scald</option>
                  <option value="Fall / Fracture">Fall / Serious Fracture</option>
                  <option value="Pregnancy & Labor Emergency">Maternal Emergency</option>
                  <option value="Poisoning / Snakebite">Snakebite / Poisoning</option>
                  <option value="Other Acute Medical">Other Acute Medical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Consciousness (AVPU Scale)
                </label>
                <select
                  value={consciousness}
                  onChange={(e) => setConsciousness(e.target.value as ConsciousnessLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                >
                  <option value="Alert & Responsive">Alert & Responsive (Conscious)</option>
                  <option value="Responds to Voice">Responds to Voice / Drowsy</option>
                  <option value="Responds to Pain">Responds Only to Pain (Pinch)</option>
                  <option value="Unconscious / Unresponsive">Unconscious / Completely Unresponsive (RED)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Breathing Status
                </label>
                <select
                  value={breathing}
                  onChange={(e) => setBreathing(e.target.value as BreathingStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                >
                  <option value="Normal">Normal Breathing</option>
                  <option value="Rapid Shallow">Rapid / Shallow Breathing</option>
                  <option value="Labored / Struggling">Labored / Struggling / Gasping</option>
                  <option value="Not Breathing">Not Breathing / Stopped (CPR REQUIRED)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bleeding Status
                </label>
                <select
                  value={severeBleeding}
                  onChange={(e) => setSevereBleeding(e.target.value as BleedingLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                >
                  <option value="None">No Active Bleeding</option>
                  <option value="Minor">Minor Cuts / Scratches</option>
                  <option value="Moderate Controlled">Moderate Controlled Bleeding</option>
                  <option value="Severe Uncontrolled">Severe Uncontrolled Arterial Bleeding (RED)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Suspected Injury Checkboxes */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-navy-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              4. Suspected Injury Locations (Select All That Apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {injuryOptions.map((inj) => {
                const isSelected = selectedInjuries.includes(inj);
                return (
                  <button
                    key={inj}
                    type="button"
                    onClick={() => handleInjuryToggle(inj)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emergency-50 dark:bg-emergency-950/40 border-emergency-500 text-emergency-900 dark:text-emergency-200'
                        : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{inj}</span>
                    <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-emergency-600 border-emergency-600 text-white' : 'border-slate-300 dark:border-navy-700'
                    }`}>
                      {isSelected ? '?' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Additional Details / History */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              5. Additional Details, Known Allergies or Observed Symptoms
            </label>
            <textarea
              rows={3}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g. Patient is diabetic, complaints of severe dizziness, wearing helmet during crash..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-sm shadow-lg shadow-red-500/25 transition flex items-center justify-center gap-2"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Update Patient Telemetry</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
