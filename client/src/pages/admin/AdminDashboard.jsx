import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  statsService,
  appointmentService,
  doctorService,
  treatmentService,
  reviewService,
  consultationService,
  contactService,
} from '../../api/services.js';
import Loader from '../../components/ui/Loader.jsx';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // States for stats and listings
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);

  // States for editing/creation modals/forms
  const [editingDoc, setEditingDoc] = useState(null);
  const [newDoc, setNewDoc] = useState(null); // { name: '', title: '', qualification: '', experience: 0, expertise: '', certifications: '', initials: '', bio: '' }
  
  const [editingTrt, setEditingTrt] = useState(null);
  const [newTrt, setNewTrt] = useState(null);

  const [notesText, setNotesText] = useState({}); // stores draft notes by appointment ID

  // Fetch functions
  const fetchStats = async () => {
    try {
      const response = await statsService.getDashboardStats();
      if (response?.success) setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments();
      if (response?.success) setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getDoctors();
      if (response?.success) setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTreatments = async () => {
    try {
      const response = await treatmentService.getTreatments();
      if (response?.success) setTreatments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchConsultations = async () => {
    try {
      const response = await consultationService.getConsultations();
      if (response?.success) setConsultations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getAllReviews();
      if (response?.success) setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await contactService.getContacts();
      if (response?.success) setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchAppointments(),
        fetchDoctors(),
        fetchTreatments(),
        fetchConsultations(),
        fetchReviews(),
        fetchContacts(),
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleUpdateStatus = async (id, status) => {
    try {
      const notes = notesText[id] || '';
      const response = await appointmentService.updateStatus(id, { status, notes });
      if (response?.success) {
        toast.success(`Appointment status updated to ${status}`);
        fetchAppointments();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.message || 'Status update failed');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment record?')) return;
    try {
      const response = await appointmentService.deleteAppointment(id);
      if (response?.success) {
        toast.success('Appointment deleted');
        fetchAppointments();
        fetchStats();
      }
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  // Doctor CRUD
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...newDoc,
        certifications: newDoc.certifications.split(',').map((c) => c.trim()).filter(Boolean),
        expertise: newDoc.expertise.split(',').map((e) => e.trim()).filter(Boolean),
      };
      const response = await doctorService.createDoctor(body);
      if (response?.success) {
        toast.success('Doctor profiles added successfully');
        setNewDoc(null);
        fetchDoctors();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create doctor profile');
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...editingDoc,
        certifications: Array.isArray(editingDoc.certifications)
          ? editingDoc.certifications
          : editingDoc.certifications.split(',').map((c) => c.trim()).filter(Boolean),
        expertise: Array.isArray(editingDoc.expertise)
          ? editingDoc.expertise
          : editingDoc.expertise.split(',').map((e) => e.trim()).filter(Boolean),
      };
      const response = await doctorService.updateDoctor(editingDoc._id, body);
      if (response?.success) {
        toast.success('Doctor profile updated');
        setEditingDoc(null);
        fetchDoctors();
      }
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await doctorService.deleteDoctor(id);
      toast.success('Doctor profile deleted');
      fetchDoctors();
      fetchStats();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // Review moderation
  const handleApproveReview = async (id, isApproved) => {
    try {
      const response = await reviewService.approveReview(id, isApproved);
      if (response?.success) {
        toast.success(isApproved ? 'Review approved!' : 'Review hidden');
        fetchReviews();
      }
    } catch (error) {
      toast.error('Moderation failed');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await reviewService.deleteReview(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  // Consultation callback tracking
  const handleUpdateConsultation = async (id, status) => {
    try {
      const response = await consultationService.updateStatus(id, status);
      if (response?.success) {
        toast.success(`Consultation status set to ${status}`);
        fetchConsultations();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteConsultation = async (id) => {
    if (!window.confirm('Delete this consultation callback request?')) return;
    try {
      await consultationService.deleteConsultation(id);
      toast.success('Callback request deleted');
      fetchConsultations();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Contact read toggle
  const handleToggleContactRead = async (id, isRead) => {
    try {
      const response = await contactService.markAsRead(id, isRead);
      if (response?.success) {
        toast.success(isRead ? 'Marked as read' : 'Marked as unread');
        fetchContacts();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to update read state');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      await contactService.deleteContact(id);
      toast.success('Contact message deleted');
      fetchContacts();
      fetchStats();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  // Helper date conversions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Operations Panel</h1>
            <p className="text-slate-400 text-sm mt-1">Moderate appointments, medical specialists, client callbacks, reviews, and messaging.</p>
          </div>
          <button
            onClick={logout}
            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold py-2 px-5 rounded-lg text-sm self-start transition-all"
          >
            Log Out Panel
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/30 p-1.5 rounded-xl border border-slate-800/80 max-w-max">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'appointments', label: `📅 Bookings (${stats?.counts?.appointments?.pending || 0} pending)` },
            { id: 'doctors', label: '🩺 Doctors' },
            { id: 'consultations', label: `📞 Callbacks (${stats?.counts?.consultations?.new || 0} new)` },
            { id: 'reviews', label: '⭐ Reviews' },
            { id: 'contacts', label: `✉️ Messages (${stats?.counts?.contacts?.unread || 0} unread)` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Widget Counts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900/35 border border-slate-800 rounded-xl p-5">
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Active Staff</span>
                <p className="text-3xl font-black text-teal-400 mt-1">{stats?.counts?.doctors || 0}</p>
                <span className="text-xs text-slate-400">Homeopathy specialists</span>
              </div>
              <div className="bg-slate-900/35 border border-slate-800 rounded-xl p-5">
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Total Appointments</span>
                <p className="text-3xl font-black text-blue-400 mt-1">{stats?.counts?.appointments?.total || 0}</p>
                <div className="text-xs text-slate-400 flex gap-2 mt-0.5">
                  <span className="text-amber-400 font-medium">{stats?.counts?.appointments?.pending} pending</span>
                  <span className="text-emerald-400 font-medium">{stats?.counts?.appointments?.confirmed} confirmed</span>
                </div>
              </div>
              <div className="bg-slate-900/35 border border-slate-800 rounded-xl p-5">
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Callback Consults</span>
                <p className="text-3xl font-black text-indigo-400 mt-1">{stats?.counts?.consultations?.total || 0}</p>
                <span className="text-xs text-amber-400 font-medium mt-0.5 block">{stats?.counts?.consultations?.new} new requests</span>
              </div>
              <div className="bg-slate-900/35 border border-slate-800 rounded-xl p-5">
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Contact Inbox</span>
                <p className="text-3xl font-black text-rose-400 mt-1">{stats?.counts?.contacts?.total || 0}</p>
                <span className="text-xs text-rose-400 font-medium mt-0.5 block">{stats?.counts?.contacts?.unread} unread messages</span>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-lg font-bold border-b border-slate-800 pb-3 mb-4">Recent Appointments Submitted</h3>
              {stats?.recentAppointments?.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {stats.recentAppointments.map((app) => (
                    <div key={app._id} className="py-3.5 flex justify-between items-center gap-4">
                      <div>
                        <span className="text-xs font-semibold text-teal-400 tracking-wide uppercase bg-teal-500/5 px-2 py-0.5 rounded border border-teal-500/10">
                          {app.status}
                        </span>
                        <h4 className="font-semibold text-slate-200 mt-1.5">{app.patientName}</h4>
                        <span className="text-xs text-slate-400">
                          Date: {formatDate(app.preferredDate)} • Time: {app.preferredTime}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {app.doctor?.name || 'Assigned doctor'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-8">No recent appointments logged.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold">Manage Consultations & Bookings</h2>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((app) => (
                  <div
                    key={app._id}
                    className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex flex-col lg:flex-row gap-6 justify-between items-start"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : app.status === 'completed'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : app.status === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {app.status}
                        </span>
                        <span className="text-slate-300 text-sm font-semibold">{formatDate(app.preferredDate)}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300 text-sm">Slot: {app.preferredTime}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 block uppercase font-bold">Patient Details</label>
                          <span className="text-slate-200 font-semibold text-sm">
                            {app.patientName} ({app.phone})
                          </span>
                          <span className="block text-xs text-slate-400">{app.email}</span>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block uppercase font-bold">Assigned Specialist</label>
                          <span className="text-slate-200 font-semibold text-sm">
                            {app.doctor?.name || 'Unassigned'}
                          </span>
                          <span className="block text-xs text-slate-400">{app.doctor?.title}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 block uppercase font-bold">Patient Symptoms</label>
                        <p className="text-slate-300 text-sm mt-0.5 italic">"{app.healthConcern}"</p>
                      </div>

                      {/* Doctor Notes Form */}
                      <div className="pt-2">
                        <label htmlFor={`notes-${app._id}`} className="text-xs text-slate-500 block uppercase font-bold mb-1">
                          Doctor Consultation Notes
                        </label>
                        <div className="flex gap-2">
                          <input
                            id={`notes-${app._id}`}
                            type="text"
                            placeholder="Add diagnostic notes, prescriptions, dosage schedules..."
                            className="bg-slate-950/80 border border-slate-800 rounded-lg py-1.5 px-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 flex-1"
                            value={notesText[app._id] !== undefined ? notesText[app._id] : app.notes || ''}
                            onChange={(e) => setNotesText({ ...notesText, [app._id]: e.target.value })}
                          />
                          <button
                            onClick={() => handleUpdateStatus(app._id, app.status)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-700 transition"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex lg:flex-col gap-2 w-full lg:w-auto pt-4 lg:pt-0 lg:border-l lg:border-slate-800/80 lg:pl-6">
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'confirmed')}
                        disabled={app.status === 'confirmed'}
                        className="flex-1 lg:w-36 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold py-2 px-3 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'completed')}
                        disabled={app.status === 'completed'}
                        className="flex-1 lg:w-36 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-bold py-2 px-3 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                        disabled={app.status === 'cancelled'}
                        className="flex-1 lg:w-36 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold py-2 px-3 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(app._id)}
                        className="flex-1 lg:w-36 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700 hover:border-rose-900/50 text-slate-400 text-xs font-bold py-2 px-3 rounded-lg transition"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-12 text-center border border-slate-800 border-dashed rounded-xl">
                No appointments booked.
              </p>
            )}
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h2 className="text-xl font-bold">Homeopathy Doctors List</h2>
              <button
                onClick={() =>
                  setNewDoc({
                    name: '',
                    title: '',
                    qualification: '',
                    experience: 5,
                    certifications: '',
                    expertise: '',
                    initials: '',
                    bio: '',
                  })
                }
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold py-2 px-4 rounded-lg transition"
              >
                + Add Doctor
              </button>
            </div>

            {/* Creation form */}
            {newDoc && (
              <form onSubmit={handleCreateDoctor} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4 max-w-2xl">
                <h3 className="text-md font-bold text-teal-400">Add New Homeopathy Specialist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Amit Patel"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={newDoc.name}
                      onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Consultant"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={newDoc.title}
                      onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Qualifications *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BHMS, MD"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={newDoc.qualification}
                      onChange={(e) => setNewDoc({ ...newDoc, qualification: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Initials (For profile badge) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AP"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={newDoc.initials}
                      onChange={(e) => setNewDoc({ ...newDoc, initials: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Experience (Years) *</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={newDoc.experience}
                      onChange={(e) => setNewDoc({ ...newDoc, experience: parseInt(e.target.value, 10) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Expertise (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Thyroid, Skin, Hair"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={newDoc.expertise}
                      onChange={(e) => setNewDoc({ ...newDoc, expertise: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Certifications (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. CCH Certified, Member IACH"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                    value={newDoc.certifications}
                    onChange={(e) => setNewDoc({ ...newDoc, certifications: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Short Biography *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe their experience and professional history..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                    value={newDoc.bio}
                    onChange={(e) => setNewDoc({ ...newDoc, bio: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setNewDoc(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-1.5 px-4 rounded-lg text-sm border border-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-1.5 px-5 rounded-lg text-sm transition"
                  >
                    Save Doctor
                  </button>
                </div>
              </form>
            )}

            {/* Doctor editing form */}
            {editingDoc && (
              <form onSubmit={handleUpdateDoctor} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4 max-w-2xl">
                <h3 className="text-md font-bold text-teal-400">Edit Doctor Profile: {editingDoc.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                      value={editingDoc.name}
                      onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                      value={editingDoc.title}
                      onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Qualification</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                      value={editingDoc.qualification}
                      onChange={(e) => setEditingDoc({ ...editingDoc, qualification: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Initials</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                      value={editingDoc.initials}
                      onChange={(e) => setEditingDoc({ ...editingDoc, initials: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                      value={editingDoc.experience}
                      onChange={(e) => setEditingDoc({ ...editingDoc, experience: parseInt(e.target.value, 10) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Expertise (Comma separated)</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                      value={
                        Array.isArray(editingDoc.expertise) ? editingDoc.expertise.join(', ') : editingDoc.expertise
                      }
                      onChange={(e) => setEditingDoc({ ...editingDoc, expertise: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Certifications (Comma separated)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                    value={
                      Array.isArray(editingDoc.certifications)
                        ? editingDoc.certifications.join(', ')
                        : editingDoc.certifications
                    }
                    onChange={(e) => setEditingDoc({ ...editingDoc, certifications: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Short Biography</label>
                  <textarea
                    rows="3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                    value={editingDoc.bio}
                    onChange={(e) => setEditingDoc({ ...editingDoc, bio: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingDoc(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-1.5 px-4 rounded-lg text-sm border border-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-1.5 px-5 rounded-lg text-sm transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Doctors list cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div key={doc._id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-400 font-black flex items-center justify-center rounded-full text-lg">
                      {doc.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{doc.name}</h4>
                      <span className="text-xs text-slate-400 block">{doc.title}</span>
                      <span className="text-xs text-slate-500">{doc.qualification}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block uppercase font-bold">Expertise</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.expertise.map((exp) => (
                        <span key={exp} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800/80 justify-end">
                    <button
                      onClick={() => setEditingDoc(doc)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc._id)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold py-1.5 px-3 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold font-sans">Free Callback Consultation Requests</h2>
            {consultations.length > 0 ? (
              <div className="overflow-x-auto bg-slate-900/30 border border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 uppercase text-xs tracking-wider">
                      <th className="p-4 font-bold">Patient</th>
                      <th className="p-4 font-bold">Phone</th>
                      <th className="p-4 font-bold">Concern</th>
                      <th className="p-4 font-bold">Date Received</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {consultations.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-800/20 transition-all">
                        <td className="p-4 font-semibold text-slate-200">{c.name}</td>
                        <td className="p-4 text-slate-300 font-mono">{c.phone}</td>
                        <td className="p-4 text-slate-400 italic max-w-xs truncate">"{c.healthConcern}"</td>
                        <td className="p-4 text-slate-400">{formatDate(c.createdAt)}</td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                              c.status === 'contacted'
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                : c.status === 'closed'
                                ? 'bg-slate-800 text-slate-500 border-slate-700'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleUpdateConsultation(c._id, 'contacted')}
                            disabled={c.status === 'contacted'}
                            className="bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-400 text-xs font-semibold py-1 px-2.5 rounded transition disabled:opacity-30 disabled:pointer-events-none"
                          >
                            Mark Contacted
                          </button>
                          <button
                            onClick={() => handleUpdateConsultation(c._id, 'closed')}
                            disabled={c.status === 'closed'}
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold py-1 px-2.5 rounded transition disabled:opacity-30 disabled:pointer-events-none"
                          >
                            Close Request
                          </button>
                          <button
                            onClick={() => handleDeleteConsultation(c._id)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold py-1 px-2.5 rounded transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-12 text-center border border-slate-800 border-dashed rounded-xl">
                No callback requests logged.
              </p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold">Moderate Patient Reviews</h2>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded border font-semibold tracking-wide uppercase ${
                            rev.isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {rev.isApproved ? 'Approved & Live' : 'Pending Moderation'}
                        </span>
                        <span className="text-amber-500 text-sm font-bold">{'★'.repeat(rev.rating)}</span>
                      </div>

                      <div className="flex gap-2.5 items-center">
                        <div className="w-9 h-9 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-full flex items-center justify-center text-xs">
                          {rev.initials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-200">{rev.patientName}</h4>
                          <span className="text-xs text-slate-500 block">Condition: {rev.condition}</span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm italic leading-relaxed">"{rev.text}"</p>
                      {rev.videoUrl && (
                        <span className="text-xs text-teal-400 block font-semibold">
                          🎥 Video Testimonial Link: {rev.videoUrl}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => handleApproveReview(rev._id, !rev.isApproved)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition ${
                          rev.isApproved
                            ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400 hover:text-slate-100'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {rev.isApproved ? 'Hide Review' : 'Approve Review'}
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold py-1.5 px-3 rounded-lg transition"
                      >
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-12 text-center border border-slate-800 border-dashed rounded-xl">
                No patient reviews submitted.
              </p>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold">Contact Inbox</h2>
            {contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3">
                      <div>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                            c.isRead
                              ? 'bg-slate-800 text-slate-500 border-slate-700'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                          }`}
                        >
                          {c.isRead ? 'Read' : 'New Message'}
                        </span>
                        <h4 className="font-bold text-slate-200 mt-2 text-sm">{c.subject}</h4>
                        <span className="text-xs text-slate-400">
                          Sender: {c.name} ({c.email}) {c.phone ? `• Phone: ${c.phone}` : ''}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{formatDate(c.createdAt)}</span>
                    </div>

                    <p className="text-slate-300 text-sm bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
                      {c.message}
                    </p>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => handleToggleContactRead(c._id, !c.isRead)}
                        className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold py-1.5 px-3 rounded transition"
                      >
                        {c.isRead ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => handleDeleteContact(c._id)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold py-1.5 px-3 rounded transition"
                      >
                        Delete Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-12 text-center border border-slate-800 border-dashed rounded-xl">
                No contact messages logged.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
