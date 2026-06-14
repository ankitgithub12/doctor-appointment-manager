import React from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`relative ${maxWidth} w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        {/* Content */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
