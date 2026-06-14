import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DoctorOverview() {
  const { user } = useAuth();

  const quickLinks = [
    { to: '/doctor/appointments', icon: '📅', label: 'View Appointments', desc: 'Manage your patient bookings', color: 'border-blue-500/20 bg-blue-500/5' },
    { to: '/doctor/patients', icon: '👥', label: 'Patient Records', desc: 'View patient information', color: 'border-indigo-500/20 bg-indigo-500/5' },
    { to: '/doctor/availability', icon: '🕐', label: 'Set Availability', desc: 'Update your schedule', color: 'border-teal-500/20 bg-teal-500/5' },
    { to: '/doctor/profile', icon: '👤', label: 'Edit Profile', desc: 'Update your information', color: 'border-amber-500/20 bg-amber-500/5' },
    { to: '/doctor/reviews', icon: '⭐', label: 'Patient Reviews', desc: 'View feedback from patients', color: 'border-emerald-500/20 bg-emerald-500/5' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/10 rounded-2xl p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, Dr. {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-400 text-sm mt-2">Your clinical dashboard is ready. Manage your appointments, patients, and schedule from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}
            className={`${link.color} border rounded-xl p-5 hover:scale-[1.02] transition-all duration-200 group`}>
            <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{link.icon}</span>
            <h3 className="font-bold text-slate-200">{link.label}</h3>
            <p className="text-slate-400 text-sm mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
