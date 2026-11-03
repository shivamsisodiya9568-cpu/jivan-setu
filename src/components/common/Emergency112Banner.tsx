import React from 'react';
import { PhoneCall, ShieldAlert } from 'lucide-react';
import { useJivanSetu } from '../../context/JivanSetuContext';
import { translations } from '../../data/translations';

export const Emergency112Banner: React.FC = () => {
  const { language } = useJivanSetu();
  const t = translations[language];

  return (
    <div className="bg-gradient-to-r from-red-600 via-emergency-600 to-red-700 text-white px-4 py-2.5 shadow-md border-b border-red-500/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
          <span className="font-medium">
            <strong className="font-bold underline decoration-amber-300">CRITICAL SAFETY:</strong> {t.disclaimer.academicNotice}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline text-red-100">National Emergency Hotline:</span>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-red-700 font-extrabold rounded-full hover:bg-red-50 transition shadow-sm hover:scale-105 active:scale-95"
            aria-label="Call emergency 112"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-current" />
            <span>DIAL 112</span>
          </a>
        </div>
      </div>
    </div>
  );
};
