import { useState } from 'react'

const PHONE = '+919829593852'
const WHATSAPP = '919829593852'

export default function FreeConsultation() {
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const handleSubmit = (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1100)
  }

  return (
    <section className="section free-consult" id="free-consultation">
      <div className="container">
        <div className="consult-card">
          <div className="consult-copy">
            <span className="eyebrow eyebrow-light">Limited slots this week</span>
            <h2>Get a 100% Free Consultation Today</h2>
            <p>
              Not sure where to start? Talk to a certified homeopath — completely free.
              No obligation, no pressure. Just honest guidance about your condition.
            </p>
            <ul className="consult-points">
              <li><span className="tick">✓</span> Speak directly with a senior doctor</li>
              <li><span className="tick">✓</span> Personalised first-step advice</li>
              <li><span className="tick">✓</span> Available online &amp; in-clinic</li>
            </ul>
            <div className="consult-ctas">
              <a className="btn btn-wa btn-lg" href={`https://wa.me/${WHATSAPP}?text=Hi,%20I'd%20like%20a%20free%20consultation`} target="_blank" rel="noopener noreferrer">
                💬 Chat on WhatsApp
              </a>
              <a className="btn btn-ghost-light btn-lg" href={`tel:${PHONE}`}>
                📞 Call Now
              </a>
            </div>
          </div>

          {status === 'sent' ? (
            <div className="consult-form booking-success">
              <div className="success-check">✓</div>
              <h3>Request received!</h3>
              <p className="sub">Our team will call you back shortly to book your free slot.</p>
              <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStatus('idle')}>
                Send another request
              </button>
            </div>
          ) : (
            <form className="consult-form" onSubmit={handleSubmit}>
              <h3>Request a Callback</h3>
              <p className="sub">Drop your details — we'll call within 30 minutes.</p>
              <div className="field">
                <label htmlFor="fn">Full Name</label>
                <input id="fn" type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label htmlFor="fp">Mobile Number</label>
                <input id="fp" type="tel" placeholder="+91 9XXXX XXXXX" required pattern="[0-9+ ]{10,15}" />
              </div>
              <div className="field">
                <label htmlFor="fc">Health Concern</label>
                <input id="fc" type="text" placeholder="e.g. Asthma, Diabetes, Skin…" />
              </div>
              <button className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }} type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? (<><span className="spinner" aria-hidden="true" /> Sending…</>) : 'Request Free Callback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
