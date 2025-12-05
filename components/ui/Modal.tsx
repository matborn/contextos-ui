import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
import { cn } from '../../utils';
import { Button } from './Button';
import { Card, CardTitle } from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Portal to body to avoid z-index issues
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg transform rounded-xl bg-white shadow-2xl transition-all animate-fadeIn scale-100">
        {title && (
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="px-6 py-6">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 rounded-b-xl border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Use the app root when available (Vite uses #root, Next uses #__next); fall back to body.
  const portalTarget = document.getElementById('root') || document.getElementById('__next') || document.body;
  if (!portalTarget) return null;
  return ReactDom.createPortal(modalContent, portalTarget);
};
