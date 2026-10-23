import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      onClick={onClose}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-primary-container text-on-primary shadow-xl border border-secondary/30 animate-in fade-in slide-in-from-bottom duration-200 cursor-pointer"
    >
      <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
        check_circle
      </span>
      <span className="text-xs font-semibold text-white whitespace-nowrap">
        {message}
      </span>
    </div>
  );
};
