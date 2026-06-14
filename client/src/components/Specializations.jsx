import React from 'react';
import { 
  FaFilter, 
  FaLungs, 
  FaStethoscope, 
  FaLeaf, 
  FaTint, 
  FaHeartbeat, 
  FaDna, 
  FaFemale, 
  FaBrain, 
  FaBone, 
  FaBaby, 
  FaSpa 
} from 'react-icons/fa';

const items = [
  { icon: <FaFilter />, label: 'Kidney Disease' },
  { icon: <FaLungs />, label: 'Respiratory' },
  { icon: <FaStethoscope />, label: 'Liver Disorders' },
  { icon: <FaLeaf />, label: 'Skin & Hair' },
  { icon: <FaTint />, label: 'Diabetes' },
  { icon: <FaHeartbeat />, label: 'Heart & BP' },
  { icon: <FaDna />, label: 'Infertility' },
  { icon: <FaFemale />, label: "Women's Health" },
  { icon: <FaBrain />, label: 'Neurological' },
  { icon: <FaBone />, label: 'Joints & Bones' },
  { icon: <FaBaby />, label: 'Child Health' },
  { icon: <FaSpa />, label: 'Mental Wellness' },
];

export default function Specializations() {
  return (
    <section className="py-20 bg-slate-50" id="diseases">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            What We Treat
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-900">Diseases We Treat</h2>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            Specialized, root-cause homeopathic care across 12 key clinical areas — targeting both acute triggers and chronic genetic predispositions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <a
              className="bg-white border border-slate-100 rounded-3xl p-6 text-center hover:border-slate-200 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between group cursor-pointer shadow-md"
              href="/booking"
              key={it.label}
            >
              <span className="text-2xl bg-teal-50 border border-teal-100 text-teal-650 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner" aria-hidden>
                {it.icon}
              </span>
              <h3 className="font-bold text-slate-800 text-sm">{it.label}</h3>
              <span className="text-xs text-teal-600 font-bold mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Book consult →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
