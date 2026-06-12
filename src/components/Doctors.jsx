const doctors = [
  {
    initials: 'AK',
    name: 'Dr. Abhishek Khandelwal',
    title: 'Founder & Chief Homeopath',
    qualification: 'BHMS, MD (Homeopathy)',
    experience: '12+ years',
    certifications: ['CCH Certified', 'Govt. Registered'],
    expertise: ['Diabetes', 'Respiratory Care', 'Chronic Allergies'],
  },
  {
    initials: 'SK',
    name: 'Dr. Sneha Kapoor',
    title: 'Senior Homeopathy Consultant',
    qualification: 'BHMS, PGDND',
    experience: '9 years',
    certifications: ['IACH Member', 'Nutrition Cert.'],
    expertise: ['Skin & Hair', 'Women’s Health', 'Thyroid'],
  },
  {
    initials: 'RM',
    name: 'Dr. Rohan Malhotra',
    title: 'Pediatric & Wellness Specialist',
    qualification: 'BHMS, MD (Paediatrics)',
    experience: '10 years',
    certifications: ['IAP Affiliated', 'Child Care Cert.'],
    expertise: ['Child Immunity', 'ENT Issues', 'Behavioural Care'],
  },
]

export default function Doctors() {
  return (
    <section className="section" id="doctors">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Meet our specialists</span>
          <h2>Certified doctors you can trust</h2>
          <p>A team of qualified, government-registered homeopaths dedicated to your recovery.</p>
        </div>

        <div className="doctors-grid">
          {doctors.map((d) => (
            <article className="doc-card" key={d.name}>
              <div className="doc-top">
                <div className="doc-photo" aria-hidden>{d.initials}</div>
                <div className="doc-id">
                  <h3>{d.name}</h3>
                  <span className="doc-title">{d.title}</span>
                  <span className="doc-qual">{d.qualification}</span>
                </div>
              </div>

              <div className="doc-stats">
                <div>
                  <strong>{d.experience}</strong>
                  <span>Experience</span>
                </div>
                <div>
                  <strong>{d.certifications.length}</strong>
                  <span>Certifications</span>
                </div>
              </div>

              <div className="doc-block">
                <h5>Certifications</h5>
                <div className="doc-badges">
                  {d.certifications.map((c) => (
                    <span className="badge" key={c}>🏅 {c}</span>
                  ))}
                </div>
              </div>

              <div className="doc-block">
                <h5>Areas of Expertise</h5>
                <div className="doc-tags">
                  {d.expertise.map((e) => (
                    <span className="doc-tag" key={e}>{e}</span>
                  ))}
                </div>
              </div>

              <a href="#appointment" className="btn btn-ghost doc-btn">Book with {d.name.split(' ')[1]}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
