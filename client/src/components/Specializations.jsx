const items = [
  { icon: '🫘', label: 'Kidney Disease' },
  { icon: '🫁', label: 'Respiratory' },
  { icon: '🩺', label: 'Liver Disorders' },
  { icon: '🌿', label: 'Skin & Hair' },
  { icon: '🩸', label: 'Diabetes' },
  { icon: '❤️', label: 'Heart & BP' },
  { icon: '🧬', label: 'Infertility' },
  { icon: '🌸', label: "Women's Health" },
  { icon: '🧠', label: 'Neurological' },
  { icon: '🦴', label: 'Joints & Bones' },
  { icon: '👶', label: 'Child Health' },
  { icon: '🧘', label: 'Mental Wellness' },
]

export default function Specializations() {
  return (
    <section className="section section-tint" id="diseases">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">What we treat</span>
          <h2>Diseases we treat</h2>
          <p>Specialised, root-cause homeopathic care across 12+ areas — from chronic illness to lifestyle disorders.</p>
        </div>
        <div className="spec-grid">
          {items.map(it => (
            <a className="spec-card" href="#appointment" key={it.label}>
              <div className="spec-icon" aria-hidden>{it.icon}</div>
              <h4>{it.label}</h4>
              <span className="spec-more">Read more →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
