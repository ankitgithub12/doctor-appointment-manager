import { useEffect, useState } from 'react'
import { navigate, goToSection, useRoute } from '../lib/router.js'

const links = [
  { hash: '#about', label: 'About' },
  { hash: '#diseases', label: 'Diseases' },
  { hash: '#stories', label: 'Success Stories' },
  { hash: '#doctors', label: 'Doctors' },
  { hash: '#reviews', label: 'Reviews' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const path = useRoute()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onHashClick = (e, hash) => {
    e.preventDefault()
    setOpen(false)
    goToSection(hash)
  }

  return (
    <header className={`header${scrolled ? ' header-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="/" className="brand" aria-label="HomeHub Homeopathy"
           onClick={(e) => { e.preventDefault(); setOpen(false); navigate('/') }}>
          <span className="brand-mark">H</span>
          <span>
            HomeHub Homeopathy
            <small>Safe • Natural • Root-Cause Cure</small>
          </span>
        </a>
        <nav className="nav" style={open ? { display: 'flex' } : undefined}>
          {links.map(l => (
            <a key={l.hash} href={l.hash} onClick={(e) => onHashClick(e, l.hash)}>{l.label}</a>
          ))}
          <a
            href="/treatments"
            className={`nav-treat${path === '/treatments' ? ' active' : ''}`}
            onClick={(e) => { e.preventDefault(); setOpen(false); navigate('/treatments') }}
          >
            Treatments
          </a>
        </nav>
        <div className="header-cta">
          <a href="tel:+919829593852" className="header-phone" aria-label="Call us">
            <span>📞 +91 98295 93852</span>
          </a>
          <a href="#appointment" className="btn btn-primary"
             onClick={(e) => onHashClick(e, '#appointment')}>Book Appointment</a>
          <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>☰</button>
        </div>
      </div>
    </header>
  )
}
