import { useState } from 'react'

const claims = [
  { icon: '🌿', title: '100% Natural Treatment', desc: 'Plant & mineral based medicines with zero chemicals or steroids.' },
  { icon: '🛡️', title: 'No Side Effects', desc: 'Gentle and safe for infants, pregnant women and the elderly alike.' },
  { icon: '🎯', title: 'Root-Cause Cure', desc: 'We treat the underlying cause for lasting relief, not temporary suppression.' },
  { icon: '👨‍⚕️', title: 'Expert Doctors', desc: 'BHMS & MD certified specialists with 12+ years of clinical experience.' },
  { icon: '📋', title: 'Personalised Plans', desc: 'Every protocol is tailored to your unique body, history and lifestyle.' },
  { icon: '💻', title: 'Online Consultation', desc: 'Consult from home — medicines delivered to your doorstep across India.' },
]

export default function ClaimsBooking() {
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const handleSubmit = (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1200)
  }

  return (
    <section className="section" id="appointment">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Why patients choose us</span>
          <h2>Proven benefits, backed by results</h2>
          <p>A safer, smarter path to recovery — then book your appointment in under a minute.</p>
        </div>

        <div className="claims-grid">
          <div className="claims-list">
            {claims.map((c) => (
              <div className="claim-card" key={c.title}>
                <div className="claim-icon" aria-hidden>{c.icon}</div>
                <div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {status === 'sent' ? (
            <div className="booking-card booking-success" id="book">
              <div className="success-check">✓</div>
              <h3>Appointment requested!</h3>
              <p className="sub">
                Thank you — our care team will call you within 24 hours to confirm your slot.
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setStatus('idle')}
              >
                Book another appointment
              </button>
            </div>
          ) : (
            <form className="booking-card" id="book" onSubmit={handleSubmit}>
              <h3>Book Your Appointment</h3>
              <p className="sub">Fill the form — our care team will call you within 24 hours.</p>
              <div className="field">
                <label htmlFor="an">Full Name</label>
                <input id="an" type="text" placeholder="e.g. Riya Sharma" required />
              </div>
              <div className="field">
                <label htmlFor="ap">Mobile Number</label>
                <input id="ap" type="tel" placeholder="+91 9XXXX XXXXX" required pattern="[0-9+ ]{10,15}" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="ad">Preferred Date</label>
                  <input id="ad" type="date" required />
                </div>
                <div className="field">
                  <label htmlFor="at">Time</label>
                  <select id="at" required defaultValue="">
                    <option value="" disabled>Select time</option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="ac">Health Concern</label>
                <select id="ac" defaultValue="">
                  <option value="" disabled>Select a concern</option>
                  <option>Diabetes</option>
                  <option>Respiratory issues</option>
                  <option>Allergic Rhinitis</option>
                  <option>Bronchial Asthma</option>
                  <option>Skin / Psoriasis</option>
                  <option>Weight Management</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="terms">
                <input id="aterms" type="checkbox" required />
                <label htmlFor="aterms">I agree to be contacted about my consultation.</label>
              </div>
              <button
                className="btn btn-accent"
                style={{ width: '100%', justifyContent: 'center' }}
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <><span className="spinner" aria-hidden="true" /> Confirming…</>
                ) : (
                  'Confirm My Appointment'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
