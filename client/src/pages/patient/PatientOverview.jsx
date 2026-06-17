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
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* Welcome banner */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-teal-600 text-sm font-bold tracking-wider uppercase">Welcome Back</span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1 text-slate-800">Hello, {user?.name}!</h1>
          <p className="text-slate-500 text-sm mt-1">Keep track of your consultations and homeopathy healing journey.</p>
        </div>
        <div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow transition-all duration-200"
          >
            <FaCalendarAlt /> Schedule Consultation
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Appointments</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-800">{appointments.length}</h3>
          </div>
          <span className="text-2xl p-3.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-600 flex items-center justify-center">
            <FaCalendarCheck />
          </span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Unread Alerts</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-800">{unreadCount}</h3>
          </div>
          <span className="text-2xl p-3.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-600 flex items-center justify-center">
            <FaBell />
          </span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Patient ID</span>
            <h3 className="text-sm font-mono font-bold mt-2 truncate text-slate-600">
              {user?._id?.substring(0, 12)}...
            </h3>
          </div>
          <span className="text-2xl p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 flex items-center justify-center">
            <FaIdCard />
          </span>
        </div>
      </div>

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent appointments */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">Upcoming & Recent Consultations</h2>
            <Link to="/dashboard/appointments" className="text-xs text-teal-600 hover:text-teal-700 font-bold">
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
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-teal-200 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">
                        {app.doctor?.name || 'Homeopathy Specialist'}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-slate-500"><FaCalendarAlt className="text-teal-600" /> {formatDate(app.preferredDate)}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-500"><FaClock className="text-teal-600" /> {app.preferredTime}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic line-clamp-1">
                      "{app.healthConcern}"
                    </p>
                  </div>
                  <Link
                    to="/dashboard/appointments"
                    className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-lg border border-slate-200 font-semibold shadow-2xs transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl">
              <FaCalendarCheck className="text-3xl text-slate-400 mx-auto" />
              <p className="text-slate-500 text-sm mt-3">No consultations scheduled yet.</p>
              <Link
                to="/doctors"
                className="inline-block mt-4 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                Schedule Now
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Help Card */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-md font-bold border-b border-slate-100 pb-3 text-slate-800">Care Resources</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Need guidance regarding homeopathy dosage rules, dynamic remedies, or dietary restrictions?
          </p>
          
          <a
            href="https://wa.me/919829593852"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs"
          >
            <FaWhatsapp className="text-base" /> WhatsApp Direct Care
          </a>
          
          <div className="pt-2 text-xs text-slate-400 border-t border-slate-100">
            <p className="flex justify-between">
              <span>Support Hours:</span>
              <span className="text-slate-600 font-medium">9 AM - 8 PM</span>
            </p>
            <p className="flex justify-between mt-1">
              <span>Response Time:</span>
              <span className="text-slate-600 font-medium">Within 15 mins</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
