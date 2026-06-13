import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { appointmentService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentService.getMyAppointments();
        if (response?.success) {
          setAppointments(response.data);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'pending':
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Welcome Banner */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Patient Portal</span>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">Hello, {user?.name}</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your homeopathy treatment journey and appointments</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
            >
              Book Appointment
            </Link>
            <button
              onClick={logout}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content: Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-semibold">Your Appointment History</h2>
              <span className="text-xs bg-slate-800 text-slate-400 py-1 px-2.5 rounded-full border border-slate-700">
                {appointments.length} total
              </span>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader size="lg" />
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((app) => (
                  <div
                    key={app._id}
                    className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/50 transition-all duration-200 flex flex-col md:flex-row gap-5 items-start justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClass(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <span className="text-slate-400 text-sm">{formatDate(app.preferredDate)}</span>
                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-slate-400 text-sm">Slot: {app.preferredTime}</span>
                      </div>

                      <div>
                        <h4 className="text-sm text-slate-500 font-medium">Assigned Specialist</h4>
                        <p className="text-slate-200 font-semibold">{app.doctor?.name || 'Assigned Homeopath'}</p>
                      </div>

                      <div>
                        <h4 className="text-sm text-slate-500 font-medium">Health Concern Details</h4>
                        <p className="text-slate-300 text-sm italic">"{app.healthConcern}"</p>
                      </div>

                      {app.notes && (
                        <div className="bg-teal-500/5 border border-teal-500/10 rounded-lg p-3 mt-2">
                          <h5 className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Doctor Notes</h5>
                          <p className="text-slate-300 text-sm mt-1">{app.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl py-16 px-4 text-center">
                <span className="text-4xl">📅</span>
                <h3 className="text-lg font-semibold mt-4 text-slate-300">No appointments found</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  You haven't scheduled any consultation appointments yet. Get in touch with our specialists.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
                >
                  Schedule Your First Consult
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar: Patient info & support */}
          <div className="space-y-6">
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-md font-semibold border-b border-slate-800 pb-3 mb-4">Patient Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block">Registered Name</label>
                  <span className="text-slate-200 font-medium">{user?.name}</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">Email Address</label>
                  <span className="text-slate-200 font-medium">{user?.email}</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">Phone Number</label>
                  <span className="text-slate-200 font-medium">{user?.phone || 'Not provided'}</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">Member Since</label>
                  <span className="text-slate-200 font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-md font-semibold border-b border-slate-800 pb-3 mb-3">Homeopathy Support</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Have questions about your homeopathic dosage, healing reactions, or dietary plans? Contact our direct care desk.
              </p>
              <a
                href="https://wa.me/919829593852"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>💬</span> WhatsApp Direct Care
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
