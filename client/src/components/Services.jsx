import React from 'react';
import { getTreatmentIcon } from '../lib/icons.jsx';

const services = [
  { iconIdentifier: '🩸', title: 'Diabetic Management', desc: 'Long-term blood sugar regulation through individualised homeopathic protocols.' },
  { iconIdentifier: '🚽', title: 'Constipation Treatment', desc: 'Gentle, root-cause therapy that restores natural digestive rhythm.' },
  { iconIdentifier: '🩹', title: 'Piles & Fissure Relief', desc: 'Non-surgical care for painful piles, fistula and chronic anal fissures.' },
  { iconIdentifier: '❤️', title: 'Blood Pressure Regulation', desc: 'Balancing high and low BP without dependence on long-term suppressants.' },
  { iconIdentifier: '😮‍💨', title: 'Bronchial Asthma', desc: 'Reduce attacks, dependence on inhalers, and rebuild respiratory strength.' },
  { iconIdentifier: '🤧', title: 'Respiratory Tract Infections', desc: 'Recurrent cold, cough and sinus problems treated at the root.' },
  { iconIdentifier: '🫁', title: 'Pneumonia Care', desc: 'Supportive homeopathic care for recovery and long-term lung health.' },
  { iconIdentifier: '🌸', title: 'Allergic Rhinitis', desc: 'End the seasonal sneezing cycle with constitutional homeopathy.' },
  { iconIdentifier: '💨', title: 'COPD Management', desc: 'Slow progression, ease breathing, and improve quality of life.' },
  { iconIdentifier: '🌬️', title: 'Interstitial Lung Disease', desc: 'Adjunct homeopathic support for ILD symptom relief and stability.' },
  { iconIdentifier: '🧠', title: 'Counselling & Therapy', desc: 'Therapy sessions for stress, anxiety, sleep and emotional well-being.' },
  { iconIdentifier: '🧘‍♂️', title: 'Wellness & Lifestyle', desc: 'Personalised plans blending diet, yoga and naturopathy with homeopathy.' },
];

export default function Services() {
  return (
    <section className="py-20 bg-slate-50" id="services">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 leading-tight">Comprehensive Treatments Under One Roof</h2>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            From chronic illness management to lifestyle therapy — we offer 12 specialized care modules rooted in classical homeopathy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-sm"
              key={s.title}
            >
              <div className="space-y-4">
                <span className="text-xl bg-slate-50 border border-slate-200 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" aria-hidden>
                  {getTreatmentIcon(s.iconIdentifier)}
                </span>
                <h3 className="font-bold text-slate-800 text-sm md:text-md">{s.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold">{s.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <a
                  href="/booking"
                  className="text-teal-600 hover:text-teal-700 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  Book treatment →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
