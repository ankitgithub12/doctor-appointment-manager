import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-24 overflow-hidden text-center text-slate-100">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md space-y-6 relative z-10">
        <span className="text-8xl font-black text-slate-800 tracking-wider block animate-pulse">404</span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Oops! Page Not Found</h1>
        <p className="text-slate-450 text-sm leading-relaxed max-w-sm mx-auto">
          The page you are looking for might have been moved, deleted, or is temporarily unavailable.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.98]"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
