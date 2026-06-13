import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      {/* Background glow glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Our Healing Legacy</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">HomeHub Homeopathy</span>
          </h1>
          <p className="text-slate-400 text-md mt-4">
            Founded with a vision to deliver side-effect-free, scientific, and permanent cures for chronic diseases.
          </p>
        </div>

        <div className="space-y-12">
          {/* Main Story */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-3 text-teal-400">Our Clinical Journey</h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-md">
              At HomeHub, we believe that true healing doesn’t mean suppressing symptoms; it means strengthening the body’s innate immunity. Established in 2014 by Dr. Abhishek Khandelwal, HomeHub has grown from a single treatment facility in Jaipur to a multi-specialty homeopathic care ecosystem treating patients across India and globally.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm md:text-md">
              Over the last decade, we have diagnosed and recovered over 50,000 patients suffering from asthma, lifestyle diabetes, skin psoriasis, autoimmune joints conditions, thyroid imbalances, and pediatric allergies. Our treatments are formulated scientifically using pure, natural homeopathic dilutions under strict government standards.
            </p>
          </div>

          {/* Mission / Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-bold text-slate-100">Our Mission</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                To offer high-efficiency, personalized homeopathic healthcare that targets the root emotional and physical causes of sickness, restoring quality of life safely and sustainably.
              </p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
              <span className="text-2xl">👁️</span>
              <h3 className="text-lg font-bold text-slate-100">Our Vision</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                To become the globally trusted hub for scientific homeopathy, bridging ancient natural therapeutics with modern, evidence-based lifestyle diagnostics.
              </p>
            </div>
          </div>

          {/* Core values */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-3 mb-6 text-teal-400 text-center">Our Core Treatment Foundations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto text-xl font-black">1</div>
                <h4 className="font-bold text-slate-200">100% Safe</h4>
                <p className="text-xs text-slate-400 leading-relaxed">No steroids, no harsh chemical side-effects. Safe for infants, pregnancy, and elderly.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto text-xl font-black">2</div>
                <h4 className="font-bold text-slate-200">Root-Cause Focus</h4>
                <p className="text-xs text-slate-400 leading-relaxed">We map your lifestyle patterns, stress, and medical history to isolate genetic triggers.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto text-xl font-black">3</div>
                <h4 className="font-bold text-slate-200">Scientific Mapping</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Constitutional remedies selected via advanced repertory protocols and regular clinical monitoring.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
