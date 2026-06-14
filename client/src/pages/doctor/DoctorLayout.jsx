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
];

export default function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-20">
      <button className="lg:hidden fixed top-24 left-4 z-50 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </button>
      
      <aside className={`fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white border-r border-slate-100 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-sm`}>
        <div className="p-5 border-b border-slate-100">
          <span className="text-xs text-teal-650 font-bold uppercase tracking-wider">Doctor Portal</span>
          <p className="text-sm text-slate-800 font-bold mt-1 truncate">{user?.name}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 border ${isActive ? 'bg-teal-50 border-teal-100 text-teal-650 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'}`}>
              <span className="text-sm">{link.icon}</span>{link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50/50 transition cursor-pointer">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>
      
      {sidebarOpen && <div className="lg:hidden fixed inset-0 top-20 bg-slate-900/10 backdrop-blur-xs z-30" onClick={() => setSidebarOpen(false)} />}
      <main className="lg:ml-64 min-h-[calc(100vh-5rem)] p-4 md:p-6 lg:p-8"><Outlet /></main>
    </div>
  );
}
