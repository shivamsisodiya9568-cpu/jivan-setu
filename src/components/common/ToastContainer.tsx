import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useReadTriangle } from '../../context/ReadTriangleContext';

export const ToastContainer: React.FC = () => {
  const { toastMessage } = useReadTriangle();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 duration-200">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 max-w-sm ${
        toastMessage.type === 'error'
          ? 'bg-rose-900 border-rose-800 text-white'
          : toastMessage.type === 'success'
          ? 'bg-emerald-900 border-emerald-800 text-white'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {toastMessage.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : toastMessage.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        )}
        <div className="overflow-hidden">
          <div className="font-bold text-xs">{toastMessage.title}</div>
          {toastMessage.desc && <div className="text-[11px] opacity-80 mt-0.5">{toastMessage.desc}</div>}
        </div>
      </div>
    </div>
  );
};
