export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="doctor-card">
          <div className="doctor-photo">AK</div>
          <div className="doctor-meta">
            <h3>Dr. Abhishek Khandelwal</h3>
            <div className="qual">BHMS · Diploma in Naturopathy & Yoga</div>
            <div className="doctor-badges">
              <span className="badge">12+ Yrs Experience</span>
              <span className="badge">Homeopathy</span>
              <span className="badge">Naturopathy</span>
            </div>
          </div>
        </div>

        <div>
          <span className="eyebrow">Head of Department</span>
          <h2>Meet the doctor behind 200,000+ healing journeys.</h2>
          <p>
            Dr. Abhishek Khandelwal leads HomeHub with a simple philosophy — treat the
            patient, not just the disease. With graduate &amp; postgraduate training in
            classical homeopathy and years of clinical practice, he has guided patients
            through chronic and lifestyle conditions that conventional medicine often only
            suppresses. Every plan is built around <em>you</em>.
          </p>
          <ul className="about-points">
            <li><span className="tick">✓</span><span><strong>Personalised treatment plans</strong> — every prescription is tailored to your constitution and history.</span></li>
            <li><span className="tick">✓</span><span><strong>Safe & side-effect free</strong> — natural medicines suitable for all ages, including children & seniors.</span></li>
            <li><span className="tick">✓</span><span><strong>Holistic approach</strong> — combining homeopathy with naturopathy and yoga for lasting wellness.</span></li>
            <li><span className="tick">✓</span><span><strong>Patient-first consultations</strong> — long enough sessions to truly understand what you're going through.</span></li>
          </ul>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#appointment" className="btn btn-primary">Book a Consultation</a>
            <a href="#services" className="btn btn-ghost">View All Treatments</a>
          </div>
        </div>
      </div>
    </section>
  )
}
