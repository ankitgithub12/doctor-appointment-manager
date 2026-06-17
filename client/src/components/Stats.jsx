import React, { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView.js';

const stats = [
  { num: 200000, suffix: '+', label: 'Happy Patients' },
  { num: 36, suffix: '+', label: 'Certified Doctors' },
  { num: 100, suffix: '%', label: 'Safe & Natural' },
  { num: 4.9, suffix: '/5', label: 'Patient Rating', decimals: 1 },
];

function useCountUp(target, start, { duration = 1400, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    let startedAt;
    const step = (ts) => {
      if (startedAt === undefined) startedAt = ts;
      const progress = Math.min((ts - startedAt) / duration, 1);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString('en-IN');
}

function Stat({ stat, start }) {
  const display = useCountUp(stat.num, start, { decimals: stat.decimals || 0 });
  return (
    <div className="text-center p-4 border-slate-100 border-b last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="block text-3xl md:text-4xl font-black text-teal-600 tracking-tight">{display}{stat.suffix}</span>
      <span className="block text-xs uppercase tracking-wider text-slate-550 font-bold mt-2">{stat.label}</span>
    </div>
  );
}

export default function Stats() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <section className="bg-slate-50 border-t border-b border-slate-200 py-8" ref={ref}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {stats.map((s) => (
            <Stat key={s.label} stat={s} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
