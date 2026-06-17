import React, { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView.js';
import { reviewService } from '../api/services.js';
import Loader from './ui/Loader.jsx';

const reviewStats = [
  { num: 2300, suffix: '+', label: 'Verified reviews' },
  { num: 4.9, suffix: '/5', label: 'Average rating', decimals: 1 },
  { num: 98, suffix: '%', label: 'Would recommend' },
  { num: 50000, suffix: '+', label: 'Patients treated' },
];

function useCountUp(target, start, { duration = 1600, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    let startedAt;
    const step = (ts) => {
      if (startedAt === undefined) startedAt = ts;
      const progress = Math.min((ts - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-IN');
}

function ReviewStat({ stat, start }) {
  const display = useCountUp(stat.num, start, { decimals: stat.decimals || 0 });
  return (
    <div className="text-center p-3 border-r border-slate-200 last:border-r-0 flex flex-col justify-center">
      <span className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{display}{stat.suffix}</span>
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{stat.label}</span>
    </div>
  );
}

const PER_VIEW = 3;

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [start, setStart] = useState(0);
  const [perView, setPerView] = useState(PER_VIEW);
  const [video, setVideo] = useState(null);
  const [statsRef, statsInView] = useInView({ threshold: 0.4 });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getReviews();
        if (response?.success) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setPerView(w <= 640 ? 1 : w <= 1024 ? 2 : PER_VIEW);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (video == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setVideo(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [video]);

  const maxStart = Math.max(0, reviews.length - perView);
  const clampedStart = Math.min(start, maxStart);
  const visible = reviews.slice(clampedStart, clampedStart + perView);

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(maxStart, s + 1));

  return (
    <section className="py-20 bg-white" id="reviews">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Patient Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-800 font-sans">Loved by Thousands of Families</h2>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            Read validated reviews from our recovered patients across Google and Practo portals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-2xl p-5 mb-12 shadow-sm" ref={statsRef}>
          {reviewStats.map((s) => (
            <ReviewStat key={s.label} stat={s} start={statsInView} />
          ))}
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader size="md" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-8">
            {/* Slider track */}
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                disabled={clampedStart === 0}
                className="w-10 h-10 border border-slate-200 rounded-full text-slate-500 hover:text-teal-600 hover:border-teal-500 disabled:opacity-20 flex items-center justify-center font-bold text-lg cursor-pointer transition select-none flex-shrink-0"
                aria-label="Previous reviews"
              >
                ‹
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                {visible.map((r) => (
                  <article
                    className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-teal-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm"
                    key={r._id}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-2.5 items-center">
                          <div className="w-9 h-9 bg-teal-50 border border-teal-100 text-teal-600 font-bold rounded-full flex items-center justify-center text-xs">
                            {r.initials}
                          </div>
                          <div>
                            <strong className="text-slate-800 font-bold text-sm block leading-snug">{r.patientName}</strong>
                            <span className="text-[10px] text-slate-550 font-medium block mt-0.5">{r.condition}</span>
                          </div>
                        </div>
                        {r.videoUrl && (
                          <button
                            onClick={() => setVideo(r.videoUrl)}
                            className="w-7 h-7 bg-teal-50 border border-teal-100 text-teal-600 text-xs font-black rounded-full flex items-center justify-center hover:bg-teal-100 cursor-pointer shadow-sm"
                            aria-label={`Watch ${r.patientName}'s video review`}
                          >
                            ▶
                          </button>
                        )}
                      </div>

                      <div className="text-amber-500 text-xs font-bold select-none">
                        {'★'.repeat(r.rating)}
                      </div>
                      
                      <p className="text-slate-600 text-xs md:text-sm italic leading-relaxed">
                        "{r.text}"
                      </p>
                    </div>

                    {r.videoUrl && (
                      <button
                        onClick={() => setVideo(r.videoUrl)}
                        className="text-xs text-teal-600 font-bold mt-4 flex items-center gap-1.5 hover:text-teal-700 cursor-pointer"
                      >
                        ▶ Watch video review
                      </button>
                    )}
                  </article>
                ))}
              </div>

              <button
                onClick={next}
                disabled={clampedStart >= maxStart}
                className="w-10 h-10 border border-slate-200 rounded-full text-slate-500 hover:text-teal-600 hover:border-teal-500 disabled:opacity-20 flex items-center justify-center font-bold text-lg cursor-pointer transition select-none flex-shrink-0"
                aria-label="Next reviews"
              >
                ›
              </button>
            </div>

            {/* Dots */}
            {maxStart > 0 && (
              <div className="flex gap-2 justify-center pt-2 select-none">
                {Array.from({ length: maxStart + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStart(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === clampedStart ? 'w-5 bg-teal-600' : 'bg-slate-200'
                    }`}
                    aria-label={`Go to review group ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-12">No patient reviews submitted.</p>
        )}
      </div>

      {video && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setVideo(null)}
        >
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer hover:border-teal-500 transition shadow"
              aria-label="Close video"
              onClick={() => setVideo(null)}
            >
              ×
            </button>
            <div className="aspect-video w-full bg-slate-100">
              <iframe
                src={`https://www.youtube.com/embed/${video}?autoplay=1`}
                title="Patient video review"
                allow="accelerated-output; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
