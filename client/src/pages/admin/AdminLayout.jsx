import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FaChartBar, 
  FaCalendarCheck, 
  FaUserMd, 
  FaUsers, 
  FaStar, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaBlog, 
  FaCog,
  FaSignOutAlt 
} from 'react-icons/fa';

const sidebarLinks = [
  { to: '/admin', icon: <FaChartBar />, label: 'Overview', end: true },
  { to: '/admin/appointments', icon: <FaCalendarCheck />, label: 'Appointments' },
  { to: '/admin/doctors', icon: <FaUserMd />, label: 'Doctors' },
  { to: '/admin/patients', icon: <FaUsers />, label: 'Patients' },
  { to: '/admin/reviews', icon: <FaStar />, label: 'Reviews' },
  { to: '/admin/consultations', icon: <FaPhoneAlt />, label: 'Callbacks' },
  { to: '/admin/contacts', icon: <FaEnvelope />, label: 'Messages' },
  { to: '/admin/blogs', icon: <FaBlog />, label: 'Blog' },
  { to: '/admin/settings', icon: <FaCog />, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-20">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-24 left-4 z-50 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white border-r border-slate-100 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-sm`}>
        {/* Brand */}
        <div className="p-5 border-b border-slate-100">
          <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">Admin Panel</span>
          <p className="text-sm text-slate-800 font-bold mt-1 truncate">{user?.name}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 border ${
                  isActive
                    ? 'bg-teal-50 border-teal-100 text-teal-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'
                }`
              }
            >
              <span className="text-sm">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50/50 transition cursor-pointer"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-slate-900/10 backdrop-blur-xs z-35" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-[calc(100vh-5rem)] p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
