import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { appointmentService, notificationService } from '../../api/services.js';
import { Link } from 'react-router-dom';
import Loader from '../../components/ui/Loader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { FaCalendarAlt, FaCalendarCheck, FaBell, FaIdCard, FaClock, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PatientOverview() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [appRes, unreadRes] = await Promise.all([
          appointmentService.getMyAppointments({ limit: 5 }),
          notificationService.getUnreadCount()
        ]);
        
        if (appRes?.success) {
          setAppointments(appRes.data || []);
        }
        if (unreadRes?.success) {
          setUnreadCount(unreadRes.count || 0);
        }
      } catch (error) {
        console.error('Error fetching patient overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome banner */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">Welcome Back</span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">Hello, {user?.name}!</h1>
          <p className="text-slate-400 text-sm mt-1">Keep track of your consultations and homeopathy healing journey.</p>
        </div>
        <div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all duration-200"
          >
            <FaCalendarAlt /> Schedule Consultation
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Appointments</span>
            <h3 className="text-2xl font-bold mt-1">{appointments.length}</h3>
          </div>
          <span className="text-2xl p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400 flex items-center justify-center">
            <FaCalendarCheck />
          </span>
        </div>

        <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Unread Alerts</span>
            <h3 className="text-2xl font-bold mt-1">{unreadCount}</h3>
          </div>
          <span className="text-2xl p-3.5 bg-teal-500/10 rounded-xl text-teal-400 flex items-center justify-center">
            <FaBell />
          </span>
        </div>

        <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Patient ID</span>
            <h3 className="text-sm font-mono font-bold mt-2 truncate text-slate-300">
              {user?._id?.substring(0, 12)}...
            </h3>
          </div>
          <span className="text-2xl p-3.5 bg-blue-500/10 rounded-xl text-blue-400 flex items-center justify-center">
            <FaIdCard />
          </span>
        </div>
      </div>

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent appointments */}
        <div className="lg:col-span-2 bg-slate-900/20 border border-slate-800/85 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold">Upcoming & Recent Consultations</h2>
            <Link to="/dashboard/appointments" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="py-12"><Loader /></div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((app) => (
                <div
                  key={app._id}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700/60 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">
                        {app.doctor?.name || 'Homeopathy Specialist'}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><FaCalendarAlt className="text-emerald-450" /> {formatDate(app.preferredDate)}</span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1"><FaClock className="text-teal-450" /> {app.preferredTime}</span>
                    </div>
                    <p className="text-sm text-slate-300 italic line-clamp-1">
                      "{app.healthConcern}"
                    </p>
                  </div>
                  <Link
                    to="/dashboard/appointments"
                    className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700 font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-905/30 border border-slate-850/60 rounded-2xl">
              <FaCalendarCheck className="text-3xl text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm mt-3">No consultations scheduled yet.</p>
              <Link
                to="/doctors"
                className="inline-block mt-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-semibold transition"
              >
                Schedule Now
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Help Card */}
        <div className="bg-slate-900/20 border border-slate-800/85 rounded-xl p-6 space-y-4">
          <h3 className="text-md font-bold border-b border-slate-800 pb-3">Care Resources</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Need guidance regarding homeopathy dosage rules, dynamic remedies, or dietary restrictions?
          </p>
          
          <a
            href="https://wa.me/919829593852"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
          >
            <FaWhatsapp className="text-base" /> WhatsApp Direct Care
          </a>
          
          <div className="pt-2 text-xs text-slate-500 border-t border-slate-800/60">
            <p className="flex justify-between">
              <span>Support Hours:</span>
              <span className="text-slate-400">9 AM - 8 PM</span>
            </p>
            <p className="flex justify-between mt-1">
              <span>Response Time:</span>
              <span className="text-slate-400">Within 15 mins</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
