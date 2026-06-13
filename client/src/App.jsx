import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
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
import TreatmentDetailPage from './pages/TreatmentDetailPage.jsx'
import DoctorsPage from './pages/DoctorsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { PrivacyPage, TermsPage } from './pages/PrivacyPage.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
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
  return (
    <BrowserRouter>
      <InteractiveBackground />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/treatments" element={<Treatments />} />
        <Route path="/treatments/:slug" element={<TreatmentDetailPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </BrowserRouter>
  )
}
