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
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaCalendarAlt,
  FaArrowLeft,
  FaWhatsapp
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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center space-y-4">
        <FaSearch className="text-4xl text-slate-300 animate-pulse" />
        <h2 className="text-xl font-bold">Specialist Not Found</h2>
        <Link to="/doctors" className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase shadow">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-16 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-6 animate-fadeIn">
        {/* Breadcrumbs */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-bold">
          <Link to="/" className="hover:text-teal-605">Home</Link>
          <span>/</span>
          <Link to="/doctors" className="hover:text-teal-605">Doctors</Link>
          <span>/</span>
          <span className="text-slate-400 font-semibold">{doctor.name}</span>
        </div>

        {/* Doctor Summary Header Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-md">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 shadow-inner flex items-center justify-center text-teal-600 text-5xl">
            {doctor.photo ? (
              <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <FaUserMd />
            )}
          </div>

          <div className="space-y-4 flex-grow w-full md:w-auto">
            <div className="space-y-1">
              <span className="text-xs text-teal-600 font-bold uppercase tracking-wider block">
                {doctor.title || 'Consultant Specialist'}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">{doctor.name}</h1>
              <p className="text-xs text-slate-500 font-bold">
                {doctor.specializations?.map((s) => s.name || s).join(', ') || 'Homeopath Practitioner'}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs md:text-sm text-slate-600 border-t border-b border-slate-100 py-3.5 font-semibold">
              <p className="flex items-center gap-2">
                <FaGraduationCap className="text-teal-600 text-base" />
                <span className="text-slate-800 font-bold">Qualifications:</span> {doctor.qualification || 'BHMS'}
              </p>
              <p className="flex items-center gap-2">
                <FaBriefcase className="text-teal-600 text-base" />
                <span className="text-slate-800 font-bold">Experience:</span> {doctor.experience} Years</p>
              {doctor.rating > 0 && (
                <p className="flex items-center gap-2">
                  <FaStar className="text-amber-500 text-base" />
                  <span className="text-slate-800 font-bold">Rating:</span> {doctor.rating} / 5 ({doctor.reviewCount} reviews)
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/booking?doctor=${doctor._id}`}
                className="bg-teal-605 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase shadow transition active:scale-[0.98]"
              >
                Request Consultation
              </Link>
              <a
                href="https://wa.me/919829593852"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 shadow"
              >
                <FaWhatsapp className="text-sm" /> WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Doctor Info Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About / Bio */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <FaUserMd className="text-teal-600" /> About Specialist
              </h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed whitespace-pre-line font-semibold">
                {doctor.bio || `Dr. ${doctor.name} is a highly accomplished homeopathic consultant committed to natural, constitutional care. By treating chronic symptoms at their roots, Dr. ${doctor.name} helps patients activate their body's inherent defense and vitality processes.`}
              </p>
            </div>

            {/* Certifications and expertise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Expertise tags */}
              {doctor.expertise && doctor.expertise.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Specialist Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.expertise.map((exp, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-655 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <FaCompass className="text-teal-600" /> {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications tags */}
              {doctor.certifications && doctor.certifications.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.certifications.map((cert, idx) => (
                      <span key={idx} className="bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                        <FaCertificate className="text-teal-600" /> {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Patient Feedback</h3>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2.5 items-center">
                          <div className="w-8 h-8 bg-white text-teal-650 font-bold rounded-full flex items-center justify-center text-xs border border-slate-200 shadow-inner">
                            {r.initials}
                          </div>
                          <div>
                            <strong className="text-slate-800 text-xs block leading-snug">{r.patientName}</strong>
                            <span className="text-[10px] text-slate-500 font-semibold block">Treated for: {r.condition}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-500 text-xs">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-655 text-xs leading-relaxed italic font-semibold">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs text-center py-6">No patient reviews submitted for this doctor yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar Schedule / Contact */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 shadow-md">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Clinic Hours</h3>
            
            <div className="space-y-2 text-xs text-slate-550 font-semibold">
              <p className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-bold text-slate-700">09:00 AM - 08:00 PM</span>
              </p>
              <p className="flex justify-between border-t border-slate-100 pt-2">
                <span>Saturday</span>
                <span className="font-bold text-slate-700">10:00 AM - 04:00 PM</span>
              </p>
              <p className="flex justify-between border-t border-slate-100 pt-2 text-rose-500 font-bold">
                <span>Sunday</span>
                <span>Closed</span>
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-550 font-semibold">
              <p className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-teal-600 text-xs mt-0.5" />
                <span>
                  <span className="font-bold text-slate-700">Location:</span> Jaipur Clinic, Central Area, Jaipur, Rajasthan
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <FaPhoneAlt className="text-teal-600 text-xs mt-0.5" />
                <span>
                  <span className="font-bold text-slate-700">Clinic Desk:</span> +91 98295 93852
                </span>
              </p>
            </div>

            <Link
              to={`/booking?doctor=${doctor._id}`}
              className="w-full bg-teal-50 border border-teal-100 text-teal-650 hover:bg-teal-100 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition mt-2 shadow-sm"
            >
              <FaCalendarAlt /> Schedule Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
