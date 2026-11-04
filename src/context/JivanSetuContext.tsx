import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Ambulance, 
  EmergencyReport, 
  EmergencyStatus, 
  EmergencyType,
  Hospital, 
  LanguageCode, 
  UserRole 
} from '../types/emergency';
import { JIVAN_SETU_EVENT, StorageService } from '../services/storageService';
import { evaluateEmergencyTriage, TriageInput } from '../services/triageEngine';

interface NotificationToast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
}

interface JivanSetuContextType {
  role: UserRole;
  language: LanguageCode;
  reports: EmergencyReport[];
  activeReport: EmergencyReport | null;
  ambulances: Ambulance[];
  hospitals: Hospital[];
  toasts: NotificationToast[];
  setRole: (role: UserRole) => void;
  setLanguage: (lang: LanguageCode) => void;
  setActiveReportId: (id: string) => void;
  submitReport: (input: TriageInput & {
    reporterName?: string;
    reporterPhone?: string;
    location: { lat: number; lng: number; address: string; landmark?: string };
    patientGender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  }) => EmergencyReport;
  submitQuickSos: (params: {
    location: { lat: number; lng: number; address: string; landmark?: string };
    emergencyType?: EmergencyType;
    callerPhone?: string;
    conditionSummary?: string;
  }) => EmergencyReport;
  updatePatientInfo: (id: string, updates: Partial<EmergencyReport>) => EmergencyReport | undefined;
  updateStatus: (
    id: string,
    status: EmergencyStatus,
    actor: string,
    note: string,
    extra?: Partial<EmergencyReport>
  ) => void;
  acknowledgeHospitalPreAlert: (reportId: string, notes: string, items: string[]) => void;
  resetAllData: () => void;
  addToast: (type: NotificationToast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const JivanSetuContext = createContext<JivanSetuContextType | undefined>(undefined);

export const JivanSetuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('bystander');
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [activeReportId, setActiveReportIdState] = useState<string | null>(null);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Reload data from StorageService
  const refreshData = () => {
    const r = StorageService.getReports();
    const a = StorageService.getAmbulances();
    const h = StorageService.getHospitals();
    const activeId = StorageService.getActiveReportId();

    setReports(r);
    setAmbulances(a);
    setHospitals(h);
    if (activeId) {
      setActiveReportIdState(activeId);
    } else if (r.length > 0) {
      setActiveReportIdState(r[0].id);
    }
  };

  useEffect(() => {
    StorageService.init();
    refreshData();

    // Listen for cross-component / cross-tab changes
    const handler = () => {
      refreshData();
    };

    window.addEventListener(JIVAN_SETU_EVENT, handler);
    return () => {
      window.removeEventListener(JIVAN_SETU_EVENT, handler);
    };
  }, []);

  const addToast = (type: NotificationToast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    addToast('info', 'Active Portal Switched', `Switched to ${newRole.toUpperCase()} view.`);
  };

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
  };

  const setActiveReportId = (id: string) => {
    StorageService.setActiveReportId(id);
    setActiveReportIdState(id);
  };

  const submitReport = (input: TriageInput & {
    reporterName?: string;
    reporterPhone?: string;
    location: { lat: number; lng: number; address: string; landmark?: string };
    patientGender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  }): EmergencyReport => {
    const triage = evaluateEmergencyTriage(input);

    // Generate unique ID: JS-YYYY-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `JS-${new Date().getFullYear()}-${randomSuffix}`;

    // Select nearest hospital and ambulance
    const assignedAmb = ambulances.find(a => a.status === 'Available') || ambulances[0];
    const assignedHosp = hospitals[0];

    const safeReporterName = input.reporterName?.trim() || 'Anonymous Bystander';
    const safeReporterPhone = input.reporterPhone?.trim() || 'Not provided';

    const newReport: EmergencyReport = {
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reporterName: safeReporterName,
      reporterPhone: safeReporterPhone,
      emergencyType: input.emergencyType,
      patientName: input.patientName,
      patientAge: input.patientAge,
      patientGender: input.patientGender || 'Unknown',
      victimCount: input.victimCount || 1,
      consciousness: input.consciousness,
      breathing: input.breathing,
      severeBleeding: input.severeBleeding,
      suspectedInjuries: input.suspectedInjuries || [],
      additionalNotes: input.additionalNotes || '',
      location: input.location,
      priority: triage.priority,
      priorityScore: triage.priorityScore,
      priorityReason: triage.priorityReason,
      warningSigns: triage.warningSigns,
      clinicalFlags: triage.clinicalFlags,
      status: 'Received',
      statusHistory: [
        {
          status: 'Received',
          timestamp: new Date().toISOString(),
          actor: `${safeReporterName} (Public User)`,
          note: `Incident registered with priority ${triage.priority}. Emergency ID generated.`
        }
      ],
      assignedAmbulanceId: assignedAmb?.id,
      assignedHospitalId: assignedHosp?.id,
      hospitalPreAlertSent: triage.priority === 'RED',
      hospitalPreAlertAcknowledged: false,
      recommendedEquipment: triage.recommendedEquipment,
      sbarSummary: triage.sbarSummary,
      etaMinutes: triage.priority === 'RED' ? 5 : 10,
      distanceKm: 2.2
    };

    StorageService.saveReport(newReport);
    refreshData();

    addToast(
      triage.priority === 'RED' ? 'danger' : 'warning',
      `Emergency Transmitted: ${newId}`,
      `Classified as ${triage.priority}. Ambulance ${assignedAmb?.callSign || '108 Unit'} notified.`
    );

    return newReport;
  };

  const submitQuickSos = (params: {
    location: { lat: number; lng: number; address: string; landmark?: string };
    emergencyType?: EmergencyType;
    callerPhone?: string;
    conditionSummary?: string;
  }): EmergencyReport => {
    return submitReport({
      emergencyType: params.emergencyType || 'Other Acute Medical',
      reporterName: 'Emergency SOS Requester',
      reporterPhone: params.callerPhone || 'Not provided',
      location: params.location,
      consciousness: 'Alert & Responsive',
      breathing: 'Gasping / Struggling',
      severeBleeding: 'None',
      suspectedInjuries: [],
      victimCount: 1,
      additionalNotes: params.conditionSummary || 'Immediate 1-Tap SOS ambulance booking triggered from Home Screen.'
    });
  };

  const updatePatientInfo = (id: string, updates: Partial<EmergencyReport>): EmergencyReport | undefined => {
    const updated = StorageService.updateReportPatientInfo(id, updates);
    if (updated) {
      refreshData();
      addToast('success', 'Patient Vitals Synchronized', `Emergency record ${id} updated with clinical info.`);
    }
    return updated;
  };

  const updateStatus = (
    id: string,
    status: EmergencyStatus,
    actor: string,
    note: string,
    extra?: Partial<EmergencyReport>
  ) => {
    StorageService.updateReportStatus(id, status, actor, note, extra);
    refreshData();
    addToast('info', `Status Updated: ${status}`, `${actor}: ${note}`);
  };

  const acknowledgeHospitalPreAlert = (reportId: string, notes: string, items: string[]) => {
    StorageService.acknowledgeHospitalPreAlert(reportId, notes, items);
    refreshData();
    addToast('success', 'Pre-Alert Acknowledged', 'Emergency department trauma bay prepared.');
  };

  const resetAllData = () => {
    StorageService.resetAll();
    refreshData();
    addToast('info', 'System Reset', 'Restored original demo dataset with sample emergencies.');
  };

  const activeReport = reports.find(r => r.id === activeReportId) || reports[0] || null;

  return (
    <JivanSetuContext.Provider
      value={{
        role,
        language,
        reports,
        activeReport,
        ambulances,
        hospitals,
        toasts,
        setRole,
        setLanguage,
        setActiveReportId,
        submitReport,
        submitQuickSos,
        updatePatientInfo,
        updateStatus,
        acknowledgeHospitalPreAlert,
        resetAllData,
        addToast,
        removeToast
      }}
    >
      {children}
    </JivanSetuContext.Provider>
  );
};

export function useJivanSetu() {
  const ctx = useContext(JivanSetuContext);
  if (!ctx) {
    throw new Error('useJivanSetu must be used within JivanSetuProvider');
  }
  return ctx;
}
