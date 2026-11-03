import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  AlertOctagon, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  LocateFixed, 
  MapPin, 
  Mic, 
  MicOff, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles, 
  User, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { translations } from '../data/translations';
import { 
  BleedingLevel, 
  BreathingStatus, 
  ConsciousnessLevel, 
  EmergencyType 
} from '../types/emergency';
import { SpeechService } from '../services/speechService';
import { LeafletMap } from '../components/map/LeafletMap';

export const EmergencyReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, submitReport, addToast } = useJivanSetu();
  const t = translations[language];

  // Form State
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Road Accident');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other' | 'Unknown'>('Unknown');
  const [victimCount, setVictimCount] = useState<number>(1);

  // Clinical Questions
  const [consciousness, setConsciousness] = useState<ConsciousnessLevel>('Alert & Responsive');
  const [breathing, setBreathing] = useState<BreathingStatus>('Normal');
  const [severeBleeding, setSevereBleeding] = useState<BleedingLevel>('None');
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Location State
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
  }>({
    lat: 28.5630,
    lng: 77.2085,
    address: 'Near Safdarjung Flyover, Ring Road Northbound, New Delhi',
    landmark: 'Safdarjung Bus Stop'
  });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Voice Dictation State
  const [isListening, setIsListening] = useState(false);
  const [dictationController, setDictationController] = useState<{ stop: () => void } | null>(null);

  // Form Validation & Submitting State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const injuryOptions = [
    'Head Trauma',
    'Spinal / Neck Injury',
    'Limb Fracture',
    'Chest Trauma / Flail Chest',
    'Internal / Abdominal Pain',
    'Burn / Scald',
    'Severe Lacerations'
  ];

  const handleInjuryToggle = (inj: string) => {
    if (selectedInjuries.includes(inj)) {
      setSelectedInjuries(selectedInjuries.filter(i => i !== inj));
    } else {
      setSelectedInjuries([...selectedInjuries, inj]);
    }
  };

  // Browser Geolocation
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation(prev => ({
          ...prev,
          lat,
          lng,
          address: `GPS Coordinate: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Detected via Browser)`
        }));
        addToast('success', 'Location Detected', 'Accurate GPS coordinates locked onto your device.');
      },
      (err) => {
        setLocating(false);
        setLocationError(`Location access denied (${err.message}). Please enter manual landmark or street.`);
        addToast('warning', 'Location Fallback', 'Please type your street or nearest landmark manually.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Voice Dictation Toggle
  const toggleVoiceDictation = () => {
    if (isListening && dictationController) {
      dictationController.stop();
      setIsListening(false);
      setDictationController(null);
    } else {
      const controller = SpeechService.startDictation(
        language,
        (transcript) => {
          setAdditionalNotes(prev => (prev ? `${prev} ${transcript}` : transcript));
          addToast('info', 'Voice Input Captured', transcript);
        },
        (error) => {
          addToast('warning', 'Voice Input Error', error);
          setIsListening(false);
          setDictationController(null);
        },
        () => {
          setIsListening(false);
          setDictationController(null);
        }
      );

      if (controller) {
        setIsListening(true);
        setDictationController(controller);
      }
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!reporterName.trim()) {
      errors.reporterName = 'Reporter name is required';
    }
    if (!reporterPhone.trim() || reporterPhone.length < 8) {
      errors.reporterPhone = 'Valid contact phone number is required for dispatch callbacks';
    }
    if (!location.address.trim()) {
      errors.address = 'Please specify incident location or landmark';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('danger', 'Incomplete Information', 'Please complete the required fields highlighted in red.');
      return;
    }

    setIsSubmitting(true);

    try {
      const report = submitReport({
        reporterName,
        reporterPhone,
        emergencyType,
        patientName: patientName.trim() || undefined,
        patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
        patientGender,
        victimCount,
        consciousness,
        breathing,
        severeBleeding,
        suspectedInjuries: selectedInjuries,
        additionalNotes: additionalNotes.trim() || undefined,
        location
      });

      // Navigate to live status tracking screen
      setTimeout(() => {
        navigate(`/status/${report.id}`);
      }, 400);
    } catch {
      setIsSubmitting(false);
      addToast('danger', 'Transmission Error', 'Unable to record report. Please call 112 immediately.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* 1. URGENT 112 CALLOUT BANNER (NEVER BLOCKS FORM) */}
        <div className="bg-gradient-to-r from-red-600 via-emergency-600 to-red-700 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                IMMEDIATE LIFE-THREATENING EMERGENCY?
              </h3>
              <p className="text-xs text-red-100 mt-0.5 leading-relaxed">
                If the patient is not breathing or suffering catastrophic blood loss, dial India’s national emergency number <strong>112</strong> immediately.
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-700 font-extrabold text-sm shadow hover:bg-red-50 hover:scale-105 active:scale-95 transition"
          >
            <PhoneCall className="w-4 h-4 fill-current" />
            <span>DIAL 112 NOW</span>
          </a>
        </div>

        {/* 2. FORM HEADER */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emergency-600 flex items-center justify-center text-white">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 dark:text-white">
              {t.reportForm.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {t.reportForm.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            
            {/* SECTION 1: REPORTER & BASIC INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-navy-800 text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                <User className="w-4 h-4 text-emergency-600" />
                <span>{t.reportForm.reporterSection}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.reportForm.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none transition ${
                      formErrors.reporterName ? 'border-red-500' : 'border-slate-300 dark:border-navy-700'
                    }`}
                  />
                  {formErrors.reporterName && (
                    <span className="text-[11px] text-red-500 mt-1 block">{formErrors.reporterName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.reportForm.phoneLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none transition ${
                      formErrors.reporterPhone ? 'border-red-500' : 'border-slate-300 dark:border-navy-700'
                    }`}
                  />
                  {formErrors.reporterPhone && (
                    <span className="text-[11px] text-red-500 mt-1 block">{formErrors.reporterPhone}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.reportForm.emergencyTypeLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value as EmergencyType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-sm bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emergency-500 focus:outline-none"
                  >
                    <option value="Road Accident">Road Traffic Accident (RTA)</option>
                    <option value="Cardiac Arrest / Chest Pain">Cardiac Arrest / Acute Chest Pain</option>
                    <option value="Severe Trauma & Bleeding">Severe Trauma & Massive Bleeding</option>
                    <option value="Respiratory Distress / Choking">Severe Respiratory Distress / Choking</option>
                    <option value="Stroke / Neurological">Acute Stroke / Paralysis / Seizure</option>
                    <option value="Severe Burn">Thermal / Electrical Burn</option>
                    <option value="Pregnancy & Labor Emergency">Maternal & Emergency Childbirth</option>
                    <option value="Fall / Fracture">Fall from Height / Serious Fracture</option>
                    <option value="Poisoning / Snakebite">Snakebite / Acute Toxicology</option>
                    <option value="Other Acute Medical">Other Acute Medical Crisis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.reportForm.victimCount}
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 5, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setVictimCount(num)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                          victimCount === num
                            ? 'bg-emergency-600 text-white border-emergency-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {num === 8 ? '5+' : num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CLINICAL QUESTIONNAIRE & TRIAGE FLAGS */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-navy-800 text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>{t.reportForm.clinicalSection}</span>
              </div>

              {/* Patient Basic Profile (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.reportForm.patientName} (Optional)
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.reportForm.patientAge} (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender (Optional)
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Unknown">Unknown / Unspecified</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Triage Question 1: Consciousness */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy-950 dark:text-white">
                  1. Is the patient conscious and responsive? (AVPU Scale) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { val: 'Alert & Responsive', label: 'Alert & Responsive', badge: 'Stable', color: 'border-emerald-500/50' },
                    { val: 'Responds to Voice', label: 'Responds to Voice', badge: 'Drowsy', color: 'border-amber-500/50' },
                    { val: 'Responds to Pain Only', label: 'Responds to Pain Only', badge: 'Critical', color: 'border-red-500/50' },
                    { val: 'Unresponsive / Unconscious', label: 'Unresponsive / Coma', badge: 'Urgent RED', color: 'border-red-600' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setConsciousness(item.val as ConsciousnessLevel)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        consciousness === item.val
                          ? 'bg-emergency-50 dark:bg-emergency-950/40 border-emergency-600 text-emergency-900 dark:text-emergency-200 ring-2 ring-emergency-500/30'
                          : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{item.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Triage Question 2: Breathing */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy-950 dark:text-white">
                  2. Is the patient breathing normally? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { val: 'Normal', label: 'Normal Breathing' },
                    { val: 'Rapid Shallow', label: 'Rapid / Panting' },
                    { val: 'Gasping / Struggling', label: 'Gasping / Struggling (RED)' },
                    { val: 'Not Breathing', label: 'Not Breathing (CPR RED)' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setBreathing(item.val as BreathingStatus)}
                      className={`p-3 rounded-xl border text-left transition text-xs font-semibold ${
                        breathing === item.val
                          ? 'bg-emergency-50 dark:bg-emergency-950/40 border-emergency-600 text-emergency-900 dark:text-emergency-200 ring-2 ring-emergency-500/30'
                          : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Triage Question 3: Bleeding */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy-950 dark:text-white">
                  3. Is active severe bleeding observed? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { val: 'None', label: 'No Visible Bleeding' },
                    { val: 'Minor / Controlled', label: 'Minor Scrape / Oozing' },
                    { val: 'Moderate - Continuous Flow', label: 'Moderate Flowing Blood' },
                    { val: 'Severe - Spurting / Uncontrolled', label: 'Severe Spurting / Arterial (RED)' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setSevereBleeding(item.val as BleedingLevel)}
                      className={`p-3 rounded-xl border text-left transition text-xs font-semibold ${
                        severeBleeding === item.val
                          ? 'bg-emergency-50 dark:bg-emergency-950/40 border-emergency-600 text-emergency-900 dark:text-emergency-200 ring-2 ring-emergency-500/30'
                          : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suspected Injuries Chips */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy-950 dark:text-white">
                  4. Suspected Injuries & Anatomical Findings (Select all observed)
                </label>
                <div className="flex flex-wrap gap-2">
                  {injuryOptions.map((inj) => {
                    const isSelected = selectedInjuries.includes(inj);
                    return (
                      <button
                        key={inj}
                        type="button"
                        onClick={() => handleInjuryToggle(inj)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-navy-800 text-white dark:bg-emergency-600 border-navy-800 dark:border-emergency-600'
                            : 'bg-slate-100 dark:bg-navy-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-800 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{inj}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voice Dictation & Notes */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-navy-950 dark:text-white">
                    5. Additional Observations or Scene Notes
                  </label>
                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-100 dark:bg-navy-800 border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>{t.reportForm.voiceStop}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-emergency-600" />
                        <span>{t.reportForm.voiceDictation}</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Describe landmarks, vehicle color, patient clothing, or relevant bystander details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                />
              </div>

            </div>

            {/* SECTION 3: LOCATION & INTERACTIVE MAP */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{t.reportForm.locationSection}</span>
                </div>
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition"
                >
                  <LocateFixed className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                  <span>{locating ? 'Detecting GPS...' : t.reportForm.detectLocation}</span>
                </button>
              </div>

              {locationError && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address / Exact Point <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    placeholder={t.reportForm.addressPlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500 ${
                      formErrors.address ? 'border-red-500' : 'border-slate-300 dark:border-navy-700'
                    }`}
                  />
                  {formErrors.address && (
                    <span className="text-[11px] text-red-500 mt-1 block">{formErrors.address}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prominent Landmark (Metro Station, Temple, Flyover)
                  </label>
                  <input
                    type="text"
                    value={location.landmark || ''}
                    onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
                    placeholder="e.g. Opposite AIIMS Metro Gate 2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Map Preview */}
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">
                  Pinpoint Incident Location (Click map or drag red marker to correct location):
                </span>
                <LeafletMap
                  emergencyLocation={location}
                  height="260px"
                  zoom={14}
                  onLocationSelect={(coords) => {
                    setLocation(prev => ({
                      ...prev,
                      lat: coords.lat,
                      lng: coords.lng,
                      address: `Selected Map Point: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                    }));
                    addToast('info', 'Incident Pin Updated', 'Updated coordinates based on map marker position.');
                  }}
                />
              </div>
            </div>

            {/* TRANSMISSION SUBMIT BUTTON */}
            <div className="pt-6 border-t border-slate-100 dark:border-navy-800 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-emergency-600 hover:bg-emergency-700 disabled:opacity-60 text-white font-extrabold text-base shadow-xl shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-2 transition duration-200"
              >
                <AlertOctagon className="w-5 h-5 animate-pulse" />
                <span>{isSubmitting ? 'TRANSMITTING TELEMETRY...' : t.reportForm.submitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>
                  Immediate transmission generates a unique Incident Tracking ID and dispatches alerts to 108 EMS and destination ER.
                </span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
