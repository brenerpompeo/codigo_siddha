import React, { useEffect } from 'react';
import { create } from 'zustand';
import { X, Award } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'achievement';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    // Auto remove
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
            key={toast.id}
            className="bg-cosmic-card border border-white/10 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] animate-in slide-in-from-right"
        >
            {toast.type === 'achievement' && <Award className="text-yellow-400" />}
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} className="text-white/30 hover:text-white"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
};
