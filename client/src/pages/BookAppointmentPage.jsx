import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { doctorService, appointmentService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { FaGraduationCap, FaBriefcase, FaCompass, FaCheckCircle, FaUserMd } from 'react-icons/fa';

export default function BookAppointmentPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedDoctorId = searchParams.get('doctor') || '';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Form state
  const [form, setForm] = useState({
    doctor: preselectedDoctorId,
    preferredDate: '',
    preferredTime: '',
    healthConcern: '',
    patientName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Pre-fill user details if login state updates
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        patientName: prev.patientName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Load doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorService.getDoctors();
        if (response?.success) {
          setDoctors(response.data || []);
        }
      } catch (error) {
        toast.error('Failed to load doctors list');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple date validation (must be today or later)
    const selectedDate = new Date(form.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return toast.error('Please select a date in the future');
    }

    setSubmitting(true);
    try {
      const response = await appointmentService.createAppointment(form);
      if (response?.success) {
        setSuccessData(response.data);
        toast.success('Appointment booked successfully!');
      } else {
        toast.error(response?.message || 'Failed to request appointment');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during booking');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Get selected doctor details
  const selectedDoctorObj = doctors.find((d) => d._id === form.doctor);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {successData ? (
          /* Success Screen */
          <div className="max-w-2xl mx-auto bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md text-center space-y-6 animate-fadeIn">
            <FaCheckCircle className="text-5xl text-emerald-500 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">Booking Request Sent!</h1>
              <p className="text-slate-400 text-sm">
                Your consultation request has been submitted to {selectedDoctorObj?.name || 'our clinic'}.
              </p>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-850 text-left space-y-3 max-w-md mx-auto text-xs md:text-sm">
              <p className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-semibold text-slate-200">{form.patientName}</span>
              </p>
              <p className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500">Consultation Date:</span>
                <span className="font-semibold text-slate-200">
                  {new Date(form.preferredDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </p>
              <p className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold text-slate-200">{form.preferredTime}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Assigned Doctor:</span>
                <span className="font-semibold text-emerald-450">{selectedDoctorObj?.name || 'Clinic Team'}</span>
              </p>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our clinic desk will contact you via phone or email shortly to confirm the scheduled block or adjust details.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-lg font-bold text-sm transition"
              >
                {isAuthenticated ? "Go to Dashboard" : "Back to Home"}
              </Link>
              <button
                onClick={() => setSuccessData(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">Book a Consultation</h1>
                <p className="text-slate-400 text-sm mt-1">Submit your concerns and preferred schedule slot.</p>
              </div>

              {!isAuthenticated && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-xs text-amber-400 flex items-center justify-between">
                  <span>Sign in to save this booking directly to your patient records folder.</span>
                  <Link to="/login" className="font-extrabold underline hover:text-amber-300">Login</Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Doctor Select */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Select Homeopathy Specialist</label>
                  <select
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  >
                    <option value="">Choose a specialist...</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.specializations?.join(', ') || 'General Practice'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={form.preferredDate}
                      onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    />
                  </div>

                  {/* Preferred Time Slot */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Preferred Time Slot</label>
                    <select
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={form.preferredTime}
                      onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    >
                      <option value="">Choose a slot...</option>
                      <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                      <option value="Evening (03:00 PM - 06:00 PM)">Evening (03:00 PM - 06:00 PM)</option>
                      <option value="Late Evening (06:00 PM - 08:00 PM)">Late Evening (06:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-2">Patient Details</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98295 93852"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Health Concern */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Health Concern / Symptoms Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe what symptoms or chronic conditions you wish to treat (e.g. chronic migraines, allergic rhinitis)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                    value={form.healthConcern}
                    onChange={(e) => setForm({ ...form, healthConcern: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-3 rounded-lg text-sm font-bold shadow-lg shadow-teal-500/10 transition disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Booking Request...' : 'Send Appointment Request'}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Column: Selected Doctor Details */}
            <div className="space-y-6">
              {selectedDoctorObj ? (
                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Your Homeopath</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0">
                      {selectedDoctorObj.photo ? (
                        <img src={selectedDoctorObj.photo} alt={selectedDoctorObj.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl bg-slate-850 text-teal-400">
                          <FaUserMd />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{selectedDoctorObj.name}</h4>
                      <p className="text-2xs text-teal-400 font-semibold uppercase">{selectedDoctorObj.title || 'Consultant Specialist'}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-400 pt-3 border-t border-slate-800">
                    <p className="flex items-center gap-2">
                      <FaGraduationCap className="text-teal-400 text-sm" />
                      <span className="font-semibold text-slate-300">Qualifications:</span> {selectedDoctorObj.qualification || 'BHMS'}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaBriefcase className="text-teal-400 text-sm" />
                      <span className="font-semibold text-slate-300">Experience:</span> {selectedDoctorObj.experience} Years
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCompass className="text-teal-400 text-sm" />
                      <span className="font-semibold text-slate-300">Fields:</span> {selectedDoctorObj.specializations?.join(', ')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 text-center text-slate-500 text-xs py-10">
                  Select a doctor to view their professional profile context here.
                </div>
              )}

              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs leading-relaxed text-slate-400">
                <h4 className="font-bold text-slate-200 uppercase tracking-wide">Homeopathy Notice</h4>
                <p>
                  Homeopathic evaluation relies on deep constitutional details. Please allocate 30 to 45 minutes for your first comprehensive consultation.
                </p>
                <p className="text-2xs text-slate-500">
                  *By submitting this booking, you agree to our privacy conditions and support terms.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
