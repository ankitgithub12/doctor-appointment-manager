import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  const statusConfig = {
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    confirmed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    cancelled: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    new: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    contacted: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    closed: { bg: 'bg-slate-800', text: 'text-slate-500', border: 'border-slate-700' },
    approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    inactive: { bg: 'bg-slate-800', text: 'text-slate-500', border: 'border-slate-700' },
    published: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    draft: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    read: { bg: 'bg-slate-800', text: 'text-slate-500', border: 'border-slate-700' },
    unread: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span className={`${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} border rounded-full font-semibold uppercase tracking-wide inline-block`}>
      {status}
    </span>
  );
}
