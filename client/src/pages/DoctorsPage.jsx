import React, { useState, useEffect } from 'react';
import { doctorService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { FaAward, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorService.getDoctors();
        if (response?.success) {
          setDoctors(response.data);
        }
      } catch (error) {
        toast.error('Failed to load specialists');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-16 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Our Specialist Care Team
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 leading-tight">
            Meet Our Certified <span className="text-teal-605">Homeopathy Doctors</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-md mt-4 font-medium">
            A dedicated medical panel of qualified, government-registered homeopaths committed to diagnosing and curing chronic conditions from the root.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader size="lg" />
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((d) => (
              <article
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-200/80 hover:shadow-xl transition-all duration-350 shadow-md"
                key={d._id}
              >
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-teal-50 border border-teal-100 text-teal-605 font-black flex items-center justify-center rounded-full text-xl flex-shrink-0 shadow-inner">
                      {d.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 leading-snug">{d.name}</h3>
                      <span className="text-xs text-teal-600 font-bold block mt-0.5">{d.title}</span>
                      <span className="text-xs text-slate-400 font-semibold block mt-0.5">{d.qualification}</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-slate-100 py-3.5 flex justify-between gap-4 text-center font-semibold text-xs">
                    <div className="flex-1 border-r border-slate-100">
                      <strong className="text-base font-black text-slate-800 block leading-tight">{d.experience}+ Yrs</strong>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Experience</span>
                    </div>
                    <div className="flex-1">
                      <strong className="text-base font-black text-slate-800 block leading-tight">{d.certifications?.length || 0}</strong>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Certifications</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About Specialist</h4>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold h-16 overflow-hidden">{d.bio}</p>
                  </div>

                  {d.certifications?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accreditations</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {d.certifications.map((c) => (
                          <span key={c} className="text-[10px] bg-slate-50 text-slate-600 py-1 px-2.5 rounded-lg border border-slate-200/80 font-bold flex items-center gap-1">
                            <FaAward className="text-teal-600 text-[11px]" /> {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.expertise?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Expertise Specialties</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {d.expertise.map((exp) => (
                          <span key={exp} className="text-[10px] bg-teal-50 text-teal-700 py-1 px-2.5 rounded-lg border border-teal-100 font-bold">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to="/booking"
                    className="w-full bg-teal-655 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center transition-all duration-300 text-xs uppercase shadow active:scale-[0.98] gap-1.5"
                  >
                    <FaCalendarAlt /> Schedule Booking
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <p className="text-slate-400 text-sm">No specialist doctors available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
