import React, { useState, useEffect } from 'react';
import { doctorService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      {/* Background glow glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Our Specialist Care Team</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
            Meet Our Certified <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Homeopathy Doctors</span>
          </h1>
          <p className="text-slate-400 text-md mt-4">
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
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-200"
                key={d._id}
              >
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 text-teal-400 font-extrabold flex items-center justify-center rounded-full text-xl flex-shrink-0">
                      {d.initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{d.name}</h3>
                      <span className="text-xs text-teal-400 font-medium block mt-0.5">{d.title}</span>
                      <span className="text-xs text-slate-400 block mt-0.5">{d.qualification}</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-slate-800/80 py-3 flex justify-between gap-4 text-center">
                    <div className="flex-1 border-r border-slate-800/80">
                      <strong className="text-lg font-bold text-slate-100 block">{d.experience}+ Yrs</strong>
                      <span className="text-xs text-slate-500">Experience</span>
                    </div>
                    <div className="flex-1">
                      <strong className="text-lg font-bold text-slate-100 block">{d.certifications?.length || 0}</strong>
                      <span className="text-xs text-slate-500">Certifications</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">About specialist</h4>
                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{d.bio}</p>
                  </div>

                  {d.certifications?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accreditations</h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {d.certifications.map((c) => (
                          <span key={c} className="text-xs bg-slate-850 text-slate-300 py-1 px-2.5 rounded-lg border border-slate-800">
                            🏅 {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.expertise?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expertise Specialties</h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {d.expertise.map((exp) => (
                          <span key={exp} className="text-xs bg-teal-500/5 text-teal-400 py-1 px-2.5 rounded-lg border border-teal-500/10">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <a
                    href="/#appointment"
                    className="w-full bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-teal-500 font-semibold py-2.5 rounded-lg flex items-center justify-center transition-all duration-200 text-sm active:scale-[0.98]"
                  >
                    Schedule Booking
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-12">No specialist doctors available at this time.</p>
        )}
      </div>
    </div>
  );
}
