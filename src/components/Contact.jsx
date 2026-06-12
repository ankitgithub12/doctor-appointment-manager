export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Get in touch</span>
          <h2>Book your consultation today</h2>
          <p>Visit us in Jaipur, give us a call, or send a message — we'll respond within a few hours.</p>
        </div>

        <div className="contact-grid">
          <aside className="contact-info-card">
            <h3>Contact Information</h3>
            <p>Reach out through any of the channels below.</p>
            <ul className="contact-rows">
              <li>
                <div className="ico" aria-hidden>📍</div>
                <div>
                  <strong>Clinic Address</strong>
                  A-24, Janta Colony, Jaipur — 302004, Rajasthan
                </div>
              </li>
              <li>
                <div className="ico" aria-hidden>📞</div>
                <div>
                  <strong>Phone</strong>
                  <a href="tel:+919829593852" style={{ color: '#fff' }}>+91 98295 93852</a>
                </div>
              </li>
              <li>
                <div className="ico" aria-hidden>✉️</div>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:akrishomeo@gmail.com" style={{ color: '#fff' }}>akrishomeo@gmail.com</a>
                </div>
              </li>
              <li>
                <div className="ico" aria-hidden>🕐</div>
                <div>
                  <strong>Clinic Hours</strong>
                  Mon – Sat · 11:00 AM – 7:00 PM
                </div>
              </li>
              <li>
                <div className="ico" aria-hidden>👨‍⚕️</div>
                <div>
                  <strong>Doctor Consultation</strong>
                  Mon – Fri · 12:00 PM – 4:00 PM
                </div>
              </li>
            </ul>
          </aside>

          <form className="contact-form-card" onSubmit={(e) => { e.preventDefault(); alert('Thank you! We will get back to you soon.') }}>
            <h3 style={{ marginBottom: 24 }}>Send us a message</h3>
            <div className="field-row">
              <div className="field">
                <label htmlFor="cn">Your Name</label>
                <input id="cn" type="text" placeholder="Full name" required />
              </div>
              <div className="field">
                <label htmlFor="cp">Mobile</label>
                <input id="cp" type="tel" placeholder="Phone number" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ce">Email</label>
              <input id="ce" type="email" placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="cs">Subject</label>
              <input id="cs" type="text" placeholder="How can we help?" required />
            </div>
            <div className="field">
              <label htmlFor="cm">Message</label>
              <textarea id="cm" rows="5" placeholder="Tell us briefly about your concern..." required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
