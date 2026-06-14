import React from 'react';

export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl py-16 px-6 text-center">
      <span className="text-5xl block mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
      {description && (
        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
