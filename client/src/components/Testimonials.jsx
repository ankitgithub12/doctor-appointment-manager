const stories = [
  {
    name: 'Priya M.',
    role: 'Patient · Jaipur',
    initials: 'PM',
    text: "Dr. Khandelwal actually listens. After years of seasonal allergies, I'm finally living without daily antihistamines. Truly life-changing care.",
  },
  {
    name: 'Rakesh G.',
    role: 'Patient · Jaipur',
    initials: 'RG',
    text: "My blood sugar levels are the most stable they've been in 8 years. The personalised plan and constant check-ins made all the difference.",
  },
  {
    name: 'Neha S.',
    role: 'Patient · Jaipur',
    initials: 'NS',
    text: "I came in for chronic asthma and left with a complete wellness routine. The clinic feels warm, never rushed. Highly recommend.",
  },
]

export default function Testimonials() {
  return (
    <section className="section" id="stories">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Success stories</span>
          <h2>Real people. Real healing.</h2>
          <p>Hear directly from patients who've transformed their health with our care.</p>
        </div>
        <div className="test-grid">
          {stories.map(s => (
            <article className="test-card" key={s.name}>
              <div className="stars">★★★★★</div>
              <p className="test-text">{s.text}</p>
              <div className="test-author">
                <div className="test-avatar">{s.initials}</div>
                <div>
                  <strong>{s.name}</strong>
                  <span>{s.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
