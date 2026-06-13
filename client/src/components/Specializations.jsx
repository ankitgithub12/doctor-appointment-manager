import React from 'react';

const items = [
  { icon: '🫘', label: 'Kidney Disease' },
  { icon: '🫁', label: 'Respiratory' },
  { icon: '🩺', label: 'Liver Disorders' },
  { icon: '🌿', label: 'Skin & Hair' },
  { icon: '🩸', label: 'Diabetes' },
  { icon: '❤️', label: 'Heart & BP' },
  { icon: '🧬', label: 'Infertility' },
  { icon: '🌸', label: "Women's Health" },
  { icon: '🧠', label: 'Neurological' },
  { icon: '🦴', label: 'Joints & Bones' },
  { icon: '👶', label: 'Child Health' },
  { icon: '🧘', label: 'Mental Wellness' },
];

export default function Specializations() {
  return (
    <section className="py-20 bg-slate-900/10" id="diseases">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">What We Treat</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-100">Diseases We Treat</h2>
          <p className="text-slate-400 text-sm md:text-md mt-4">
            Specialized, root-cause homeopathic care across 12 key clinical areas — targeting both acute triggers and chronic genetic predispositions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <a
              className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 text-center hover:border-slate-750/70 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between group"
              href="#appointment"
              key={it.label}
            >
              <span className="text-4xl bg-slate-950 border border-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow" aria-hidden>
                {it.icon}
              </span>
              <h3 className="font-bold text-slate-200 text-sm">{it.label}</h3>
              <span className="text-xs text-teal-400 font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Book consult →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
