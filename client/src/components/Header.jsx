import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { hash: '#about', label: 'About' },
  { hash: '#stories', label: 'Success Stories' },
  { hash: '#doctors', label: 'Doctors' },
  { hash: '#reviews', label: 'Reviews' },
  { hash: '#free-consultation', label: 'Free Callback' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Monitor URL hashes to scroll to sections
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleNavClick = (e, hash) => {
    e.preventDefault();
    setOpen(false);
    
    if (location.pathname === '/') {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/' + hash);
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'doctor') return '/doctor';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return '⚙️ Admin Panel';
    if (user?.role === 'doctor') return '🩺 Doctor Portal';
    return '👤 Patient Portal';
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-slate-900 shadow-lg shadow-black/10'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <Link
          to="/"
          onClick={() => {
            setOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group"
          aria-label="HomeHub Homeopathy Home"
        >
          <span className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shadow-teal-500/10 group-hover:scale-[1.03] transition-transform">
            H
          </span>
          <span className="leading-tight">
            <span className="font-bold text-slate-100 text-md block group-hover:text-teal-400 transition-colors">
              HomeHub <span className="font-light text-slate-400">Homeopathy</span>
            </span>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase">
              Safe • Natural • Root Cure
            </span>
          </span>
        </Link>
 
        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
          {links.map((l) => (
            <a
              key={l.hash}
              href={l.hash}
              onClick={(e) => handleNavClick(e, l.hash)}
              className="hover:text-teal-450 transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/treatments"
            className={`hover:text-teal-450 transition-colors duration-150 ${
              location.pathname === '/treatments' ? 'text-teal-400' : ''
            }`}
          >
            Treatments
          </Link>
          <Link
            to="/doctors"
            className={`hover:text-teal-450 transition-colors duration-150 ${
              location.pathname === '/doctors' ? 'text-teal-400' : ''
            }`}
          >
            Our Doctors
          </Link>
        </nav>
 
        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+919829593852"
            className="text-slate-300 hover:text-teal-400 text-xs font-bold font-mono tracking-wider transition-colors"
          >
            📞 +91 98295 93852
          </a>
 
          {/* Conditional Auth widgets */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black flex items-center justify-center cursor-pointer transition hover:bg-teal-500/20"
                aria-label="User Profile"
              >
                {user?.name?.substring(0, 2).toUpperCase() || 'US'}
              </button>
 
              {showDropdown && (
                <div className="absolute right-0 mt-2.5 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn">
                  <div className="px-3.5 py-2 border-b border-slate-800/80 mb-1">
                    <span className="text-xs text-slate-500 block uppercase font-bold">Signed in as</span>
                    <span className="text-slate-200 text-sm font-semibold truncate block">{user?.name}</span>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left block px-3.5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 text-xs font-semibold"
                  >
                    {getDashboardLabel()}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3.5 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-lg text-xs transition"
            >
              Sign In
            </Link>
          )}

          <a
            href="/#appointment"
            onClick={(e) => handleNavClick(e, '#appointment')}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.98]"
          >
            Book Slot
          </a>
        </div>

        {/* Mobile toggle button */}
        <button
          className="md:hidden w-10 h-10 border border-slate-800 rounded-lg text-slate-300 flex items-center justify-center hover:bg-slate-900 transition"
          aria-label="Toggle navigation drawer"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 top-20 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col p-6 space-y-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-4 text-md font-semibold text-slate-250">
            {links.map((l) => (
              <a
                key={l.hash}
                href={l.hash}
                onClick={(e) => handleNavClick(e, l.hash)}
                className="hover:text-teal-400 border-b border-slate-900 pb-2"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/treatments"
              onClick={() => setOpen(false)}
              className="hover:text-teal-400 border-b border-slate-900 pb-2"
            >
              Treatments
            </Link>
            <Link
              to="/doctors"
              onClick={() => setOpen(false)}
              className="hover:text-teal-400 border-b border-slate-900 pb-2"
            >
              Our Doctors
            </Link>
          </nav>

          <div className="flex flex-col gap-4 pt-6 border-t border-slate-900">
            <a
              href="tel:+919829593852"
              className="text-slate-300 hover:text-teal-400 font-bold font-mono tracking-wider text-center"
            >
              📞 +91 98295 93852
            </a>
            
            {isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-center py-2.5 rounded-lg font-bold text-sm"
                >
                  {user?.role === 'admin' ? '⚙️ Admin' : user?.role === 'doctor' ? '🩺 Doctor' : '👤 Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-rose-400 py-2.5 rounded-lg font-bold text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-center py-2.5 rounded-lg font-bold text-sm"
              >
                Sign In
              </Link>
            )}

            <a
              href="/#appointment"
              onClick={(e) => handleNavClick(e, '#appointment')}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-center py-2.5 rounded-lg text-sm transition"
            >
              Book Slot
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
