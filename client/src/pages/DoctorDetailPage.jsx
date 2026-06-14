import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService, reviewService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { 
  FaGraduationCap, 
  FaBriefcase, 
  FaStar, 
  FaSearch, 
  FaUserMd, 
  FaCompass, 
  FaCertificate, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaCalendarAlt 
} from 'react-icons/fa';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorAndReviews = async () => {
      try {
        const [docRes, reviewsRes] = await Promise.all([
          doctorService.getDoctor(id),
          reviewService.getReviews(), // Fetch public approved reviews
        ]);

        if (docRes?.success) {
          setDoctor(docRes.data);
        }
        if (reviewsRes?.success) {
          // Filter reviews associated with this specific doctor
          const filtered = (reviewsRes.data || []).filter(
            (r) => r.doctor?._id === id || r.doctor === id
          );
          setReviews(filtered);
        }
      } catch (error) {
        toast.error('Failed to load doctor profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <FaSearch className="text-4xl text-slate-650" />
        <h2 className="text-xl font-bold">Specialist Not Found</h2>
        <Link to="/doctors" className="bg-teal-500 text-slate-950 px-4 py-2 rounded-lg font-semibold text-sm">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-8 animate-fadeIn">
        {/* Breadcrumbs */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-slate-350">Home</Link>
          <span>/</span>
          <Link to="/doctors" className="hover:text-slate-350">Doctors</Link>
          <span>/</span>
          <span className="text-slate-400">{doctor.name}</span>
        </div>

        {/* Doctor Summary Header Card */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden border border-slate-850 bg-slate-950 flex-shrink-0">
            {doctor.photo ? (
              <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-850 text-teal-400">
                <FaUserMd />
              </div>
            )}
          </div>

          <div className="space-y-4 flex-grow">
            <div className="space-y-1">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider block">
                {doctor.title || 'Consultant Specialist'}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">{doctor.name}</h1>
              <p className="text-sm text-slate-450 font-medium">
                {doctor.specializations?.map((s) => s.name || s).join(', ') || 'Homeopath Practitioner'}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs md:text-sm text-slate-350 border-t border-b border-slate-900 py-3">
              <p className="flex items-center gap-2">
                <FaGraduationCap className="text-teal-400 text-base" />
                <span className="font-semibold text-slate-200">Qualifications:</span> {doctor.qualification || 'BHMS'}
              </p>
              <p className="flex items-center gap-2">
                <FaBriefcase className="text-teal-400 text-base" />
                <span className="font-semibold text-slate-200">Experience:</span> {doctor.experience} Years</p>
              {doctor.rating > 0 && (
                <p className="flex items-center gap-2">
                  <FaStar className="text-amber-500 text-base animate-pulse" />
                  <span className="font-semibold text-slate-200">Rating:</span> {doctor.rating} / 5 ({doctor.reviewCount} reviews)
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                to={`/booking?doctor=${doctor._id}`}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-teal-500/10 transition"
              >
                📅 Request Consultation
              </Link>
              <a
                href="https://wa.me/919829593852"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-705 text-slate-300 px-6 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                💬 WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Doctor Info Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About / Bio */}
            <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <h3 className="text-md font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">About Specialist</h3>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                {doctor.bio || `Dr. ${doctor.name} is a highly accomplished homeopathic consultant committed to natural, constitutional care. By treating chronic symptoms at their roots, Dr. ${doctor.name} helps patients activate their body's inherent defense and vitality processes.`}
              </p>
            </div>

            {/* Certifications and expertise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Expertise tags */}
              {doctor.expertise && doctor.expertise.length > 0 && (
                <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-250 uppercase tracking-wider border-b border-slate-800 pb-2">Specialist Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.expertise.map((exp, idx) => (
                      <span key={idx} className="bg-slate-950 border border-slate-850 text-slate-350 text-2xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <FaCompass className="text-teal-500" /> {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications tags */}
              {doctor.certifications && doctor.certifications.length > 0 && (
                <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-250 uppercase tracking-wider border-b border-slate-800 pb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.certifications.map((cert, idx) => (
                      <span key={idx} className="bg-teal-500/5 border border-teal-500/10 text-teal-400 text-2xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <FaCertificate className="text-teal-450" /> {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-md font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Patient Feedback</h3>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="w-7 h-7 bg-slate-900 text-teal-400 font-bold rounded-full flex items-center justify-center text-3xs border border-slate-800">
                            {r.initials}
                          </div>
                          <div>
                            <strong className="text-slate-300 text-xs block">{r.patientName}</strong>
                            <span className="text-3xs text-slate-500 block">Treated for: {r.condition}</span>
                          </div>
                        </div>
                        <span className="text-amber-500 text-xs">{'★'.repeat(r.rating)}</span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed italic">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs text-center py-6">No patient reviews submitted for this doctor yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar Schedule / Contact */}
          <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">Clinic Hours</h3>
            
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-semibold text-slate-300">09:00 AM - 08:00 PM</span>
              </p>
              <p className="flex justify-between border-t border-slate-900 pt-2">
                <span>Saturday</span>
                <span className="font-semibold text-slate-300">10:00 AM - 04:00 PM</span>
              </p>
              <p className="flex justify-between border-t border-slate-900 pt-2 text-rose-400">
                <span>Sunday</span>
                <span>Closed</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-900 space-y-3.5 text-xs text-slate-500">
              <p className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-teal-400 text-sm mt-0.5" />
                <span>
                  <span className="font-medium text-slate-400">Location:</span> Jaipur Clinic, Central Area, Jaipur, Rajasthan
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <FaPhone className="text-teal-400 text-sm mt-0.5" />
                <span>
                  <span className="font-medium text-slate-400">Clinic Desk:</span> +91 98295 93852
                </span>
              </p>
            </div>

            <Link
              to={`/booking?doctor=${doctor._id}`}
              className="w-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 py-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 transition mt-2"
            >
              <FaCalendarAlt /> Schedule Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
