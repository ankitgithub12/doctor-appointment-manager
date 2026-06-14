import React from 'react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Confirm', variant = 'danger' }) {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-rose-500 hover:bg-rose-400 text-white',
    warning: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    success: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 animate-fadeIn">
        <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-lg text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${variantClasses[variant]} font-bold py-2 px-4 rounded-lg text-sm transition`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
