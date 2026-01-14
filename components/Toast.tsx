
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-white px-4 py-3 rounded-xl shadow-2xl animate-[slideIn_0.3s_ease-out] w-full max-w-sm"
        >
          {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <XCircle size={20} className="text-red-500 flex-shrink-0" />}
          {toast.type === 'info' && <Info size={20} className="text-violet-400 flex-shrink-0" />}
          
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          
          <button onClick={() => removeToast(toast.id)} className="text-zinc-500 hover:text-white">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
