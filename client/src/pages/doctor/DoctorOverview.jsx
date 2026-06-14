import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FaCalendarAlt, FaUsers, FaClock, FaUser, FaStar } from 'react-icons/fa';

export default function DoctorOverview() {
  const { user } = useAuth();

  const quickLinks = [
    { to: '/doctor/appointments', icon: <FaCalendarAlt />, label: 'View Appointments', desc: 'Manage your patient bookings', color: 'border-teal-100 bg-teal-50 text-teal-700 shadow-sm shadow-teal-500/5' },
    { to: '/doctor/patients', icon: <FaUsers />, label: 'Patient Records', desc: 'View patient information', color: 'border-blue-100 bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5' },
    { to: '/doctor/availability', icon: <FaClock />, label: 'Set Availability', desc: 'Update your schedule', color: 'border-indigo-100 bg-indigo-50 text-indigo-750 shadow-sm shadow-indigo-500/5' },
    { to: '/doctor/profile', icon: <FaUser />, label: 'Edit Profile', desc: 'Update your information', color: 'border-amber-100 bg-amber-50 text-amber-700 shadow-sm shadow-amber-500/5' },
    { to: '/doctor/reviews', icon: <FaStar />, label: 'Patient Reviews', desc: 'View feedback from patients', color: 'border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/5' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-850">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-3xl p-8 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">Welcome back, Dr. {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-500 text-xs mt-2 font-semibold leading-relaxed">Your clinical dashboard is ready. Manage your appointments, patients, and schedule from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}
            className={`${link.color} border rounded-2xl p-6 hover:scale-[1.01] hover:shadow-lg transition-all duration-300 group`}>
            <span className="text-2xl block mb-3 group-hover:scale-110 transition-transform">{link.icon}</span>
            <h3 className="font-bold text-slate-800 text-sm">{link.label}</h3>
            <p className="text-slate-500 text-xs mt-1.5 font-semibold leading-relaxed">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
