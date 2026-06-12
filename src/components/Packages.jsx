const packages = [
  {
    name: 'Starter',
    price: '₹2,500',
    duration: '4 weeks',
    features: [
      'Initial detailed consultation',
      'Personalised homeopathic medicines',
      'Weekly weight & vitals tracking',
      'Diet & lifestyle guidance',
    ],
  },
  {
    name: 'Standard',
    price: '₹4,500',
    duration: '8 weeks',
    featured: true,
    features: [
      'Everything in Starter',
      'Bi-weekly doctor check-ins',
      'Customised yoga & exercise plan',
      'WhatsApp support with care team',
      'Monthly body composition report',
    ],
  },
  {
    name: 'Premium',
    price: '₹6,000',
    duration: '12 weeks',
    features: [
      'Everything in Standard',
      'Weekly 1-on-1 consultations',
      'Naturopathy & yoga therapy sessions',
      'Quarterly progress review',
      'Priority appointment scheduling',
    ],
  },
]

export default function Packages() {
  return (
    <section className="section section-tint" id="packages">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Wellness packages</span>
          <h2>Obesity & weight management plans</h2>
          <p>Structured, doctor-led programs designed to deliver visible, sustainable results.</p>
        </div>
        <div className="packages-grid">
          {packages.map(p => (
            <div className={`pkg-card ${p.featured ? 'featured' : ''}`} key={p.name}>
              <div className="pkg-name">{p.name}</div>
              <div className="pkg-price">{p.price}<span> / plan</span></div>
              <div className="pkg-dur">{p.duration} programme</div>
              <ul className="pkg-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <a href="#contact" className={`btn ${p.featured ? 'btn-accent' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center' }}>
                Choose {p.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
