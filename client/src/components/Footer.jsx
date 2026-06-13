import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  const handleScrollToSection = (hash) => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-sm text-slate-400">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 font-black flex items-center justify-center text-md shadow-lg shadow-teal-500/10">
                H
              </span>
              <span className="leading-tight">
                <span className="font-bold text-slate-100 text-sm block">
                  HomeHub <span className="font-light text-slate-400">Homeopathy</span>
                </span>
                <span className="text-[9px] text-slate-500 block uppercase tracking-wider">
                  Safe • Natural • Root Cure
                </span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              A trusted family homeopathy clinic in Jaipur, Rajasthan, dedicated to compassionate, safe care and constitutional root-cause healing.
            </p>
            <div className="flex gap-3 pt-2" aria-label="Social media links">
              <a
                href="https://www.youtube.com/@homehubhomeopathy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-450 hover:text-teal-400 hover:border-teal-500/30 flex items-center justify-center transition-all"
                aria-label="YouTube Channel"
              >
                <FaYoutube size={14} />
              </a>
              <a
                href="https://www.linkedin.com/company/homehubhomeopathy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-450 hover:text-teal-400 hover:border-teal-500/30 flex items-center justify-center transition-all"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={14} />
              </a>
              <a
                href="https://www.instagram.com/homehubhomeopathy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-450 hover:text-teal-400 hover:border-teal-500/30 flex items-center justify-center transition-all"
                aria-label="Instagram Profile"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="https://wa.me/919829593852"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-450 hover:text-teal-400 hover:border-teal-500/30 flex items-center justify-center transition-all"
                aria-label="WhatsApp Chat Support"
              >
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-slate-100 font-bold tracking-wider uppercase text-xs">Explore Site</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/#stories" onClick={() => handleScrollToSection('#stories')} className="hover:text-teal-450 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/#doctors" onClick={() => handleScrollToSection('#doctors')} className="hover:text-teal-450 transition-colors">
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link to="/#services" onClick={() => handleScrollToSection('#services')} className="hover:text-teal-450 transition-colors">
                  Clinic Services
                </Link>
              </li>
              <li>
                <Link to="/#reviews" onClick={() => handleScrollToSection('#reviews')} className="hover:text-teal-450 transition-colors">
                  Patient Reviews
                </Link>
              </li>
              <li>
                <Link to="/#appointment" onClick={() => handleScrollToSection('#appointment')} className="hover:text-teal-450 transition-colors">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Treatments */}
          <div className="space-y-4">
            <h4 className="text-slate-100 font-bold tracking-wider uppercase text-xs">Homeo Treatments</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/treatments/diabetic-management" className="hover:text-teal-450 transition-colors">
                  Diabetes Care
                </Link>
              </li>
              <li>
                <Link to="/treatments/respiratory-care" className="hover:text-teal-450 transition-colors">
                  Respiratory Care
                </Link>
              </li>
              <li>
                <Link to="/treatments/skin-and-psoriasis" className="hover:text-teal-450 transition-colors">
                  Psoriasis &amp; Eczema
                </Link>
              </li>
              <li>
                <Link to="/treatments/hair-and-scalp" className="hover:text-teal-450 transition-colors">
                  Hairfall &amp; Alopecia
                </Link>
              </li>
              <li>
                <Link to="/treatments/mind-and-stress" className="hover:text-teal-450 transition-colors">
                  Mind &amp; Stress
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinic details */}
          <div className="space-y-4">
            <h4 className="text-slate-100 font-bold tracking-wider uppercase text-xs">Contact Desk</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="leading-relaxed">
                102, Apex Mall, Lalkothi, Jaipur, Rajasthan 302015
              </li>
              <li>
                <a href="tel:+919829593852" className="hover:text-teal-405 font-mono tracking-wide transition-colors">
                  📞 +91 98295 93852
                </a>
              </li>
              <li>
                <a href="mailto:care@homehubhomeopathy.com" className="hover:text-teal-405 transition-colors">
                  ✉️ care@homehubhomeopathy.com
                </a>
              </li>
              <li>
                Mon – Sat • 9:00 AM – 8:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {year} HomeHub Homeopathy Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
