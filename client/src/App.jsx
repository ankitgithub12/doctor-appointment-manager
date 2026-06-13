import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Stats from './components/Stats.jsx'
import About from './components/About.jsx'
import Specializations from './components/Specializations.jsx'
import SuccessStories from './components/SuccessStories.jsx'
import ClaimsBooking from './components/ClaimsBooking.jsx'
import Doctors from './components/Doctors.jsx'
import Services from './components/Services.jsx'
import Reviews from './components/Reviews.jsx'
import FreeConsultation from './components/FreeConsultation.jsx'
import FAQ from './components/FAQ.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import InteractiveBackground from './components/InteractiveBackground.jsx'
import Treatments from './pages/Treatments.jsx'
import { useRoute } from './lib/router.js'
import { useEffect } from 'react'

function Home() {
  // Reveal sections as they scroll into view.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <main>
      <Hero />
      <Stats />
      <div className="reveal"><About /></div>
      <div className="reveal"><Specializations /></div>
      <div className="reveal"><SuccessStories /></div>
      <div className="reveal"><ClaimsBooking /></div>
      <div className="reveal"><Doctors /></div>
      <div className="reveal"><Services /></div>
      <div className="reveal"><Reviews /></div>
      <div className="reveal"><FreeConsultation /></div>
      <div className="reveal"><FAQ /></div>
    </main>
  )
}

export default function App() {
  const path = useRoute()
  const isTreatments = path === '/treatments'

  return (
    <>
      <InteractiveBackground />
      <Header />
      {isTreatments ? <Treatments /> : <Home />}
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  )
}
