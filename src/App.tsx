import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JivanSetuProvider } from './context/JivanSetuContext';
import { Emergency112Banner } from './components/common/Emergency112Banner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// JIVAN SETU Core Pages
import { LandingPage } from './pages/LandingPage';
import { EmergencyReportPage } from './pages/EmergencyReportPage';
import { EmergencyStatusPage } from './pages/EmergencyStatusPage';
import { TrackAmbulancePage } from './pages/TrackAmbulancePage';
import { PatientInfoPage } from './pages/PatientInfoPage';
import { AmbulanceDashboardPage } from './pages/AmbulanceDashboardPage';
import { HospitalDashboardPage } from './pages/HospitalDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FirstAidGuidancePage } from './pages/FirstAidGuidancePage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { DemoWorkflowPage } from './pages/DemoWorkflowPage';
import { StaffAuthGuard } from './components/common/StaffAuthGuard';

export function App() {
  return (
    <JivanSetuProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-red-500/20 selection:text-red-600">
          {/* Top Medical Safety 112 Banner */}
          <Emergency112Banner />

          {/* Navigation Bar */}
          <Navbar />

          {/* Real-time Reactive Toast Notifications */}
          <ToastContainer />

          {/* Core Routes */}
          <main className="flex-1">
            <Routes>
              {/* Public Immediate Emergency Access (No Registration Required) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/report" element={<EmergencyReportPage />} />
              <Route path="/status/:id" element={<EmergencyStatusPage />} />
              <Route path="/track" element={<TrackAmbulancePage />} />
              <Route path="/patient-info" element={<PatientInfoPage />} />
              <Route path="/first-aid" element={<FirstAidGuidancePage />} />
              <Route path="/ai-assistant" element={<AiAssistantPage />} />
              <Route path="/routes" element={<RouteOptimizationPage />} />
              <Route path="/demo" element={<DemoWorkflowPage />} />

              {/* Authenticated Stakeholder Dashboards */}
              <Route 
                path="/ambulance" 
                element={
                  <StaffAuthGuard requiredRole="ambulance">
                    <AmbulanceDashboardPage />
                  </StaffAuthGuard>
                } 
              />
              <Route 
                path="/hospital" 
                element={
                  <StaffAuthGuard requiredRole="hospital">
                    <HospitalDashboardPage />
                  </StaffAuthGuard>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <StaffAuthGuard requiredRole="admin">
                    <AdminDashboardPage />
                  </StaffAuthGuard>
                } 
              />

              {/* Fallback to Home */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>

          {/* Standard Footer */}
          <Footer />
        </div>
      </Router>
    </JivanSetuProvider>
  );
}

export default App;
