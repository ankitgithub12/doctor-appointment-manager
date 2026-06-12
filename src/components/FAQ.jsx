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
]

export default function FAQ() {
  return (
    <section className="section section-tint">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Questions answered</span>
          <h2>Frequently asked questions</h2>
          <p>Everything you wanted to ask about homeopathy and our approach.</p>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details className="faq-item" key={f.q} open={i === 0}>
              <summary className="faq-q">{f.q}</summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
