import React from 'react';
import { FaBullseye, FaEye, FaShieldAlt, FaHeartbeat, FaMicroscope } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-16 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Our Healing Legacy
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-900">
            About <span className="text-teal-605">HomeHub Homeopathy</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            Founded with a vision to deliver side-effect-free, scientific, and permanent cures for chronic diseases.
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Story */}
          <div className="bg-white border border-slate-100/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
            <h2 className="text-lg font-bold border-b border-slate-100 pb-3 text-slate-850">Our Clinical Journey</h2>
            <p className="text-slate-600 leading-relaxed text-xs md:text-sm">
              At HomeHub, we believe that true healing doesn’t mean suppressing symptoms; it means strengthening the body’s innate immunity. Established in 2014 by Dr. Abhishek Khandelwal, HomeHub has grown from a single treatment facility in Jaipur to a multi-specialty homeopathic care ecosystem treating patients across India and globally.
            </p>
            <p className="text-slate-600 leading-relaxed text-xs md:text-sm">
              Over the last decade, we have diagnosed and recovered over 50,000 patients suffering from asthma, lifestyle diabetes, skin psoriasis, autoimmune joints conditions, thyroid imbalances, and pediatric allergies. Our treatments are formulated scientifically using pure, natural homeopathic dilutions under strict government standards.
            </p>
          </div>

          {/* Mission / Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100/80 rounded-3xl p-6 space-y-4 shadow-md">
              <span className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-650 flex items-center justify-center text-sm shadow-sm">
                <FaBullseye />
              </span>
              <h3 className="text-md font-bold text-slate-800">Our Mission</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                To offer high-efficiency, personalized homeopathic healthcare that targets the root emotional and physical causes of sickness, restoring quality of life safely and sustainably.
              </p>
            </div>
            <div className="bg-white border border-slate-100/80 rounded-3xl p-6 space-y-4 shadow-md">
              <span className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-650 flex items-center justify-center text-sm shadow-sm">
                <FaEye />
              </span>
              <h3 className="text-md font-bold text-slate-800">Our Vision</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                To become the globally trusted hub for scientific homeopathy, bridging ancient natural therapeutics with modern, evidence-based lifestyle diagnostics.
              </p>
            </div>
          </div>

          {/* Core values */}
          <div className="bg-white border border-slate-100/80 rounded-3xl p-6 md:p-8 shadow-md">
            <h2 className="text-lg font-bold border-b border-slate-100 pb-3 mb-6 text-slate-800 text-center">Our Core Treatment Foundations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2.5 p-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto text-sm shadow-sm">
                  <FaShieldAlt />
                </div>
                <h4 className="font-bold text-slate-850 text-sm">100% Safe</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">No steroids, no harsh chemical side-effects. Safe for infants, pregnancy, and elderly.</p>
              </div>
              <div className="space-y-2.5 p-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto text-sm shadow-sm">
                  <FaHeartbeat />
                </div>
                <h4 className="font-bold text-slate-850 text-sm">Root-Cause Focus</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">We map your lifestyle patterns, stress, and medical history to isolate genetic triggers.</p>
              </div>
              <div className="space-y-2.5 p-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto text-sm shadow-sm">
                  <FaMicroscope />
                </div>
                <h4 className="font-bold text-slate-850 text-sm">Scientific Mapping</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">Constitutional remedies selected via advanced repertory protocols and regular clinical monitoring.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
