import React from 'react';
import { FaInbox } from 'react-icons/fa';

export default function EmptyState({ icon = <FaInbox />, title, description, action }) {
  return (
    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl py-16 px-6 text-center shadow-inner">
      <span className="text-4xl text-slate-305 flex justify-center mb-4">{icon}</span>
      <h3 className="text-base font-bold text-slate-750">{title}</h3>
      {description && (
        <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto font-semibold leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
