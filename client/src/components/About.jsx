import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

export default function About() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Doctor Info Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-slate-50 border border-slate-200/60 rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-500/5 blur-[60px] pointer-events-none" />
            <div className="space-y-5 text-center">
              <div className="w-24 h-24 bg-teal-50 border border-teal-100 text-teal-600 text-3xl font-black rounded-2xl flex items-center justify-center mx-auto shadow-inner" aria-hidden>
                AK
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Dr. Abhishek Khandelwal</h3>
                <p className="text-xs text-teal-600 font-bold mt-1.5">Founder &amp; Chief Homeopath</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">BHMS • Diploma in Naturopathy &amp; Yoga</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="text-xs bg-white border border-slate-200/60 text-slate-600 font-semibold py-1 px-3 rounded-lg shadow-sm">
                  12+ Yrs Experience
                </span>
                <span className="text-xs bg-white border border-slate-200/60 text-slate-600 font-semibold py-1 px-3 rounded-lg shadow-sm">
                  Homeopathy
                </span>
                <span className="text-xs bg-white border border-slate-200/60 text-slate-600 font-semibold py-1 px-3 rounded-lg shadow-sm">
                  Naturopathy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Lead Practitioner
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 leading-tight">
              Meet the Doctor Behind 200,000+ Healing Journeys
            </h2>
          </div>
          <p className="text-slate-500 text-sm md:text-md leading-relaxed">
            Dr. Abhishek Khandelwal leads HomeHub Homeopathy with a simple, compassionate philosophy — treat the patient, not just the disease. Combining classical homeopathy with naturopathy and lifestyle counseling, he helps patients break free from chronic ailments that conventional medications only suppress. Every recovery protocol is tailored around <em>your</em> constitution.
          </p>
          
          <ul className="space-y-3.5 text-xs md:text-sm text-slate-600 font-medium">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                <FaCheck />
              </span>
              <span><strong>Personalised treatment plans</strong> — every dilution is matched to your unique history.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                <FaCheck />
              </span>
              <span><strong>Safe &amp; side-effect free</strong> — clean, natural remedies safe for infants to seniors.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                <FaCheck />
              </span>
              <span><strong>Holistic integration</strong> — combining homeopathy, nutrition, and stress management.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                <FaCheck />
              </span>
              <span><strong>Patient-first consults</strong> — deep consultation sessions to truly hear your concern.</span>
            </li>
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/free-consultation"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-lg text-xs md:text-sm transition hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] shadow"
            >
              Book a Consultation
            </Link>
            <Link
              to="/treatments"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold py-2.5 px-5 rounded-lg text-xs md:text-sm transition"
            >
              View All Treatments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
