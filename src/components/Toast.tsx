import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300 shrink-0" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
