import React from 'react';

export default function Loader({ size = 'md', color = 'teal' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    teal: 'border-teal-500/20 border-t-teal-500',
    blue: 'border-blue-500/20 border-t-blue-500',
    white: 'border-white/20 border-t-white',
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label="loading">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size] || sizeClasses.md} ${
          colorClasses[color] || colorClasses.teal
        }`}
      />
    </div>
  );
}
