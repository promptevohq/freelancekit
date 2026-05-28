import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ToastType } from '../types';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-teal-600" />,
  error: <AlertCircle size={16} className="text-red-500" />,
  info: <Info size={16} className="text-blue-500" />,
};

const BG: Record<ToastType, string> = {
  success: 'bg-white border-teal-200',
  error: 'bg-white border-red-200',
  info: 'bg-white border-blue-200',
};

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-panel pointer-events-auto max-w-xs animate-[slideIn_0.2s_ease-out] ${BG[toast.type]}`}
        >
          {ICONS[toast.type]}
          <span className="text-sm font-medium text-gray-800 flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
