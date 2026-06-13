import React from 'react';

const services = [
  { icon: '🩸', title: 'Diabetic Management', desc: 'Long-term blood sugar regulation through individualised homeopathic protocols.' },
  { icon: '🚽', title: 'Constipation Treatment', desc: 'Gentle, root-cause therapy that restores natural digestive rhythm.' },
  { icon: '🩹', title: 'Piles & Fissure Relief', desc: 'Non-surgical care for painful piles, fistula and chronic anal fissures.' },
  { icon: '❤️', title: 'Blood Pressure Regulation', desc: 'Balancing high and low BP without dependence on long-term suppressants.' },
  { icon: '😮‍💨', title: 'Bronchial Asthma', desc: 'Reduce attacks, dependence on inhalers, and rebuild respiratory strength.' },
  { icon: '🤧', title: 'Respiratory Tract Infections', desc: 'Recurrent cold, cough and sinus problems treated at the root.' },
  { icon: '🫁', title: 'Pneumonia Care', desc: 'Supportive homeopathic care for recovery and long-term lung health.' },
  { icon: '🌸', title: 'Allergic Rhinitis', desc: 'End the seasonal sneezing cycle with constitutional homeopathy.' },
  { icon: '💨', title: 'COPD Management', desc: 'Slow progression, ease breathing, and improve quality of life.' },
  { icon: '🌬️', title: 'Interstitial Lung Disease', desc: 'Adjunct homeopathic support for ILD symptom relief and stability.' },
  { icon: '🧠', title: 'Counselling & Therapy', desc: 'Therapy sessions for stress, anxiety, sleep and emotional well-being.' },
  { icon: '🧘‍♂️', title: 'Wellness & Lifestyle', desc: 'Personalised plans blending diet, yoga and naturopathy with homeopathy.' },
];

export default function Services() {
  return (
    <section className="py-20 bg-slate-950" id="services">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-100">Comprehensive Treatments Under One Roof</h2>
          <p className="text-slate-400 text-sm md:text-md mt-4">
            From chronic illness management to lifestyle therapy — we offer 12 specialized care modules rooted in classical homeopathy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              key={s.title}
            >
              <div className="space-y-4">
                <span className="text-3xl bg-slate-950 border border-slate-800 w-12 h-12 rounded-xl flex items-center justify-center" aria-hidden>
                  {s.icon}
                </span>
                <h3 className="font-bold text-slate-200 text-sm md:text-md">{s.title}</h3>
                <p className="text-slate-450 text-xs md:text-sm leading-relaxed">{s.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-850">
                <a
                  href="#appointment"
                  className="text-teal-400 hover:text-teal-300 font-semibold text-xs flex items-center gap-1 transition-colors"
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
