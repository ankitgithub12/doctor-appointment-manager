import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular', count = 1 }) {
  const baseClass = 'animate-pulse bg-slate-800/60 rounded-lg';
  
  const variants = {
    rectangular: 'h-4 w-full',
    circular: 'h-10 w-10 rounded-full',
    card: 'h-48 w-full rounded-xl',
    text: 'h-3 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${variants[variant] || variants.rectangular} ${className}`}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4 animate-pulse">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 bg-slate-800/60 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-800/60 rounded w-2/3" />
          <div className="h-3 bg-slate-800/60 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-slate-800/60 rounded w-full" />
      <div className="h-3 bg-slate-800/60 rounded w-5/6" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-slate-800/60 rounded w-16" />
        <div className="h-6 bg-slate-800/60 rounded w-16" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-slate-900/40 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-800/60 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex gap-4 border-t border-slate-800/50">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-slate-800/60 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
