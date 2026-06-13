import React, { useEffect, useState } from 'react';
import { storyService } from '../api/services.js';
import Loader from './ui/Loader.jsx';
import toast from 'react-hot-toast';

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await storyService.getSuccessStories();
        if (response?.success) {
          setStories(response.data);
        }
      } catch (error) {
        console.error('Failed to load success stories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    if (active == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  const activeStory = active != null ? stories[active] : null;

  return (
    <section className="py-20 bg-slate-900/10" id="stories">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Success Stories</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-100 font-sans">Their Journeys Toward the Cure</h2>
          <p className="text-slate-400 text-sm md:text-md mt-4">
            Hear directly from our patients as they share their struggles, healing process, and successful recoveries in their own words.
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader size="md" />
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((s, i) => (
              <button
                className="w-full text-left bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700/60 shadow-xl transition-all duration-300 group flex flex-col md:flex-row focus:outline-none"
                key={s._id}
                onClick={() => setActive(i)}
                aria-label={`Watch ${s.name}'s video testimonial`}
              >
                {/* Thumbnail */}
                <div className="w-full md:w-48 h-48 md:h-full relative overflow-hidden flex-shrink-0 bg-slate-950">
                  {s.youtubeId ? (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover opacity-65 group-hover:scale-105 group-hover:opacity-80 transition duration-350"
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-teal-400 text-3xl font-black bg-black/25 group-hover:scale-110 transition duration-300 pointer-events-none" aria-hidden>
                        ▶
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-500 bg-teal-500/5 font-extrabold text-2xl">
                      {s.initials}
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-wider bg-slate-950/80 border border-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                    {s.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-teal-400 text-xs font-black flex items-center justify-center flex-shrink-0">
                        {s.initials}
                      </div>
                      <div>
                        <strong className="text-slate-200 font-bold block text-sm">{s.name}, {s.age}</strong>
                        <span className="text-xs text-slate-500 font-medium block">{s.condition}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 text-xs md:text-sm">
                      <p className="text-slate-450 leading-relaxed"><b className="text-slate-300">Before:</b> {s.before}</p>
                      <p className="text-slate-400 leading-relaxed"><b className="text-teal-400">After:</b> {s.after}</p>
                    </div>
                  </div>

                  {s.youtubeId && (
                    <span className="text-xs text-teal-450 font-bold flex items-center gap-1.5 group-hover:text-teal-400 transition-colors">
                      ▶ Watch video story
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-12">No patient success stories found.</p>
        )}
      </div>

      {activeStory && activeStory.youtubeId && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 border border-slate-800 text-slate-350 hover:text-slate-100 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer hover:border-slate-700 transition"
              aria-label="Close video"
              onClick={() => setActive(null)}
            >
              ×
            </button>
            <div className="aspect-video w-full bg-slate-950">
              <iframe
                src={`https://www.youtube.com/embed/${activeStory.youtubeId}?autoplay=1`}
                title={`${activeStory.name} testimonial`}
                allow="accelerated-output; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-5 flex justify-between items-center gap-4 text-xs md:text-sm border-t border-slate-850">
              <span className="text-slate-300 font-semibold">
                <strong>{activeStory.name}, {activeStory.age}</strong> · {activeStory.condition}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${activeStory.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 font-bold hover:underline"
              >
                Open on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
