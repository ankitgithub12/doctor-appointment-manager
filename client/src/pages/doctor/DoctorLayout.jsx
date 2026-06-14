import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FaChartBar, 
  FaCalendarCheck, 
  FaUsers, 
  FaClock, 
  FaUser, 
  FaStar, 
  FaSignOutAlt 
} from 'react-icons/fa';

const sidebarLinks = [
  { to: '/doctor', icon: <FaChartBar />, label: 'Overview', end: true },
  { to: '/doctor/appointments', icon: <FaCalendarCheck />, label: 'My Appointments' },
  { to: '/doctor/patients', icon: <FaUsers />, label: 'My Patients' },
  { to: '/doctor/availability', icon: <FaClock />, label: 'Availability' },
  { to: '/doctor/profile', icon: <FaUser />, label: 'My Profile' },
  { to: '/doctor/reviews', icon: <FaStar />, label: 'My Reviews' },
];

export default function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20">
      <button className="lg:hidden fixed top-24 left-4 z-50 w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800 transition" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </button>
      <aside className={`fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-slate-950 border-r border-slate-800/80 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-slate-800/80">
          <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Doctor Portal</span>
          <p className="text-sm text-slate-300 mt-1 truncate">{user?.name}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${isActive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'}`}>
              <span className="text-base">{link.icon}</span>{link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800/80">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="lg:hidden fixed inset-0 top-20 bg-slate-950/50 z-30" onClick={() => setSidebarOpen(false)} />}
      <main className="lg:ml-64 min-h-[calc(100vh-5rem)] p-4 md:p-6 lg:p-8"><Outlet /></main>
    </div>
  );
}
