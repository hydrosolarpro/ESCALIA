import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#131313] border border-[#D32F2F] text-[#e5e2e1] px-5 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="w-8 h-8 rounded-full bg-[#D32F2F]/20 text-[#D32F2F] flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-lg">info</span>
      </div>
      <div className="font-body text-sm flex-grow">
        {message}
      </div>
      <button
        onClick={onClose}
        className="text-[#e4beba] hover:text-white p-1 rounded hover:bg-[#201f1f]"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
