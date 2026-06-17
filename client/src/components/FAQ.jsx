import React from 'react';

const faqs = [
  {
    q: 'Is homeopathy effective for chronic conditions?',
    a: 'Yes. Homeopathy works at the constitutional level, which makes it particularly suited for chronic complaints like asthma, allergies, skin issues, hormonal imbalances and lifestyle diseases — treating the root cause rather than suppressing symptoms.',
  },
  {
    q: 'How are homeopathic medicines taken?',
    a: 'Usually as small sugar globules or liquid drops placed under the tongue. They are taste-neutral, easy to take for children and elders, and don\'t interfere with food when taken 15–20 minutes apart from meals.',
  },
  {
    q: 'Are there any dietary restrictions during treatment?',
    a: 'Most patients can eat normally. We typically advise spacing medicines from strong substances like raw onion, garlic, coffee or mint by ~15 minutes — the specific guidance is shared during your consultation.',
  },
  {
    q: 'Are there any side effects?',
    a: 'Homeopathic medicines are gentle, non-toxic and safe for all ages including infants, pregnant women and the elderly when prescribed by a qualified doctor.',
  },
  {
    q: 'How long does treatment take?',
    a: 'It depends on the condition. Acute issues respond within days, while chronic conditions may need 3–6 months of structured care for lasting results.',
  },
  {
    q: 'Can I take homeopathy alongside my regular medicines?',
    a: 'Yes. Homeopathy can safely be combined with conventional medicines. Over time, in coordination with your physician, allopathic doses may be tapered as your condition improves.',
  },
];

export default function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Questions Answered</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-800 font-sans">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            Everything you wanted to ask about homeopathy, dosages, dietary restrictions, and our clinical approach.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details
              className="group bg-white border border-slate-200 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 hover:border-teal-500 shadow-sm"
              key={f.q}
              open={i === 0}
            >
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <h3 className="text-sm md:text-md font-bold text-slate-800 group-hover:text-teal-600 transition-colors pr-4">
                  {f.q}
                </h3>
                <span className="relative flex-shrink-0 ml-1.5 w-5 h-5 text-slate-500 font-bold transition group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <div className="text-slate-600 text-xs md:text-sm mt-3 pt-3 border-t border-slate-100 leading-relaxed font-sans">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
