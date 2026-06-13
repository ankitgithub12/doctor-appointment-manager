import { useRef } from 'react'
import { goToSection } from '../lib/router.js'

const lines = [
  '100% Safe & Natural Treatment',
  'No Side Effects · No Steroids',
  'Cures the Root Cause — Permanently',
]

export default function Hero() {
  const boxRef = useRef(null)

  // Subtle 3D tilt that follows the cursor.
  const onMove = (e) => {
    const el = boxRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`
    el.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
  }
  const reset = () => {
    const el = boxRef.current
    if (el) el.style.transform = ''
  }

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-badge">
            🏆 <strong>200,000+</strong> &nbsp;·&nbsp; Happy patients treated across India &amp; abroad
          </span>

          {/* Interactive hero box */}
          <div
            className="hero-box"
            ref={boxRef}
            onMouseMove={onMove}
            onMouseLeave={reset}
          >
            <span className="hero-box-glow" aria-hidden />

            <div className="hero-box-brand">
              <span className="hero-box-mark">H</span>
              <div>
                <strong>HomeHub Homeopathy</strong>
                <small>Safe • Natural • Root-Cause Cure</small>
              </div>
            </div>

            <ul className="hero-box-lines">
              {lines.map((l, i) => (
                <li key={l} style={{ animationDelay: `${0.25 + i * 0.18}s` }}>
                  <span className="hbl-tick" aria-hidden>✓</span> {l}
                </li>
              ))}
            </ul>

            <div className="hero-box-ctas">
              <a href="tel:+919829593852" className="hero-call">
                <span className="hero-call-ring" aria-hidden />
                <span className="hero-call-ico" aria-hidden>📞</span>
                <span className="hero-call-txt">
                  <small>Call us now</small>
                  +91 98295 93852
                </span>
              </a>
              <button
                type="button"
                className="btn btn-accent btn-lg hero-box-consult"
                onClick={() => goToSection('#free-consultation')}
              >
                Avail Free Consultation →
              </button>
            </div>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-authority-card">
            <div className="authority-photo" aria-hidden>👨‍⚕️</div>
            <div className="authority-meta">
              <strong>Dr. Abhishek Khandelwal</strong>
              <span>BHMS, MD (Homeopathy)</span>
              <div className="authority-badges">
                <span className="badge">12+ yrs experience</span>
                <span className="badge">CCH Certified</span>
              </div>
            </div>
            <div className="authority-float authority-float-1">
              ⭐ 4.9 Google Rating
            </div>
            <div className="authority-float authority-float-2">
              🛡️ Govt. Registered Clinic
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
