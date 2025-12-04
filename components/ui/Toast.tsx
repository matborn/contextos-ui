import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../../types';
import { CheckCircle, AlertCircle, Check, Loader2 } from '../icons/Icons';
import { cn, generateId } from '../../utils';

interface ToastContextType {
  showToast: (title: string, options?: { type?: ToastType; message?: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, options: { type?: ToastType; message?: string; duration?: number } = {}) => {
    const id = generateId();
    const type = options.type || 'info';
    const duration = options.duration || 3000;

    setToasts((prev) => [...prev, { id, title, type, message: options.message }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start w-80 p-4 rounded-lg shadow-lg border animate-slideInRight bg-white",
              toast.type === 'success' && "border-green-100",
              toast.type === 'error' && "border-red-100",
              toast.type === 'warning' && "border-orange-100",
              toast.type === 'info' && "border-blue-100"
            )}
          >
            <div className="shrink-0 mr-3">
              {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
              {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
              {toast.type === 'warning' && <AlertCircle size={20} className="text-orange-500" />}
              {toast.type === 'info' && <Check size={20} className="text-blue-500" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
              {toast.message && <p className="text-sm text-slate-500 mt-1">{toast.message}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};