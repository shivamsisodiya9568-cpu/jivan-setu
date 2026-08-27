import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReadTriangleProvider } from './context/ReadTriangleContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { HomePage } from './pages/HomePage';
import { AppReaderPage } from './pages/AppReaderPage';
import { SeoLandingPage } from './pages/SeoLandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FaqPage } from './pages/FaqPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CopyrightPolicyPage } from './pages/CopyrightPolicyPage';

export function App() {
  return (
    <ReadTriangleProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
          <Navbar />
          <ToastContainer />
          
          <div className="flex-1">
            <Routes>
              {/* Core App Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/app" element={<AppReaderPage />} />

              {/* SEO Feature Pages */}
              <Route path="/pdf-to-audio" element={<SeoLandingPage />} />
              <Route path="/pdf-reader" element={<SeoLandingPage />} />
              <Route path="/pdf-text-to-speech" element={<SeoLandingPage />} />
              <Route path="/pdf-voice-reader" element={<SeoLandingPage />} />
              <Route path="/ai-pdf-reader" element={<SeoLandingPage />} />
              <Route path="/multilingual-pdf-reader" element={<SeoLandingPage />} />
              <Route path="/pdf-audiobook" element={<SeoLandingPage />} />
              <Route path="/features" element={<SeoLandingPage />} />

              {/* Informational & Legal Routes */}
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/copyright-policy" element={<CopyrightPolicyPage />} />
              
              {/* Fallback to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </ReadTriangleProvider>
  );
}

export default App;
