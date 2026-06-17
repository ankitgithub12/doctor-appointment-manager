import React, { useEffect, useState } from 'react';
import { doctorService } from '../api/services.js';
import Loader from './ui/Loader.jsx';

export default function Doctors() {
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
        console.error('Failed to load specialists list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="py-20 bg-white" id="doctors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Meet Our Specialists</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-800 font-sans">Certified Doctors You Can Trust</h2>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            A team of qualified, government-registered homeopathy specialists dedicated to your permanent recovery.
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader size="md" />
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((d) => (
              <article
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-md"
                key={d._id}
              >
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-teal-600 font-extrabold flex items-center justify-center rounded-2xl text-lg flex-shrink-0" aria-hidden>
                      {d.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-md">{d.name}</h3>
                      <span className="text-xs text-teal-600 font-medium block mt-0.5">{d.title}</span>
                      <span className="text-xs text-slate-500 block mt-0.5">{d.qualification}</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-slate-200 py-3.5 flex justify-between gap-4 text-center">
                    <div className="flex-1 border-r border-slate-200">
                      <strong className="text-slate-800 font-bold block text-sm">{d.experience}+ yrs</strong>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Experience</span>
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-800 font-bold block text-sm">{d.certifications?.length || 0}</strong>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Certifications</span>
                    </div>
                  </div>

                  {d.certifications?.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Certifications</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {d.certifications.map((c) => (
                          <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 py-1 px-2.5 rounded-lg font-semibold" key={c}>
                            🏅 {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.expertise?.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Areas of Expertise</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {d.expertise.map((exp) => (
                          <span className="text-xs bg-teal-50 border border-teal-100 text-teal-700 py-1 px-2.5 rounded-lg font-semibold" key={exp}>
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200">
                  <a
                    href="#appointment"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl flex items-center justify-center font-bold text-xs transition-all active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Book with {d.name.split(' ')[1] || 'Specialist'}
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-12">No specialists logged.</p>
        )}
      </div>
    </section>
  );
}
