export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand" style={{ color: '#fff', marginBottom: 14 }}>
              <span className="brand-mark">H</span>
              <span>
                HomeHub Homeopathy
                <small style={{ color: 'rgba(255,255,255,0.6)' }}>Safe • Natural • Root-Cause Cure</small>
              </span>
            </div>
            <p>
              A trusted family homeopathy clinic in Jaipur, dedicated to compassionate care
              and the body's natural ability to heal.
            </p>
            <div className="socials" aria-label="Social media">
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="https://wa.me/919829593852" aria-label="WhatsApp">💬</a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#stories">Success Stories</a></li>
              <li><a href="#doctors">Our Doctors</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#appointment">Book Appointment</a></li>
            </ul>
          </div>

          <div>
            <h4>Treatments</h4>
            <ul>
              <li><a href="#services">Diabetic Care</a></li>
              <li><a href="#services">Respiratory</a></li>
              <li><a href="#services">Allergies</a></li>
              <li><a href="#services">Weight Management</a></li>
              <li><a href="#services">Counselling</a></li>
            </ul>
          </div>

          <div>
            <h4>Visit Us</h4>
            <ul>
              <li>A-24, Janta Colony, Jaipur — 302004</li>
              <li><a href="tel:+919829593852">+91 98295 93852</a></li>
              <li><a href="mailto:akrishomeo@gmail.com">akrishomeo@gmail.com</a></li>
              <li>Mon – Sat · 11 AM – 7 PM</li>
            </ul>
          </div>
        </div>
        <div className="copy">
          © {year} HomeHub. All rights reserved. · Designed with care for natural healing.
        </div>
      </div>
    </footer>
  )
}
