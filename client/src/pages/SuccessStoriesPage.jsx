import React, { useEffect, useState } from 'react';
import { storyService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { FaPlay, FaUser, FaRegClock, FaFilter, FaSearch, FaChevronRight } from 'react-icons/fa';

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await storyService.getSuccessStories();
        if (response?.success) {
          setStories(response.data);
          setFilteredStories(response.data);
        }
      } catch (error) {
        console.error('Failed to load success stories:', error);
        toast.error('Could not load success stories');
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    let result = stories;
    if (searchTerm) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCondition !== 'All') {
      result = result.filter((s) => s.condition.toLowerCase().includes(selectedCondition.toLowerCase()));
    }
    setFilteredStories(result);
  }, [searchTerm, selectedCondition, stories]);

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

  const activeStory = active != null ? filteredStories[active] : null;

  // Extract unique conditions for filter list
  const conditions = ['All', ...new Set(stories.map((s) => s.condition))];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-16 relative overflow-hidden">
      {/* Soft Glow Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Success Testimonials
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 font-sans">
            Real Patient <span className="text-teal-650 bg-clip-text">Recovery Journeys</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            Hear directly from our patients as they share their struggles, healing process, and successful recoveries under homeopathic treatment.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FaSearch className="text-xs" />
            </span>
            <input
              type="text"
              placeholder="Search by name or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 text-xs"
            />
          </div>

          <div className="flex gap-2 items-center w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <FaFilter /> Filters:
            </span>
            {conditions.map((cond) => (
              <button
                key={cond}
                onClick={() => setSelectedCondition(cond)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all flex-shrink-0 cursor-pointer ${
                  selectedCondition === cond
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader size="lg" />
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStories.map((s, i) => (
              <button
                className="w-full text-left bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-350 flex flex-col md:flex-row focus:outline-none cursor-pointer group"
                key={s._id}
                onClick={() => setActive(i)}
                aria-label={`Watch ${s.name}'s testimonial`}
              >
                {/* Thumbnail */}
                <div className="w-full md:w-48 h-48 md:h-full relative overflow-hidden flex-shrink-0 bg-slate-950">
                  {s.youtubeId ? (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-95 transition duration-350"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-teal-950/20 text-white text-2xl font-black group-hover:scale-110 transition duration-300 pointer-events-none" aria-hidden>
                        <span className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/35">
                          <FaPlay className="ml-1 text-xs" />
                        </span>
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-650 bg-teal-50 font-extrabold text-2xl">
                      {s.initials}
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-wider bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded text-white flex items-center gap-1">
                    <FaRegClock /> {s.duration || 'Video story'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-teal-700 text-xs font-black flex items-center justify-center flex-shrink-0 border border-slate-200">
                        {s.initials}
                      </div>
                      <div>
                        <strong className="text-slate-800 font-bold block text-sm">{s.name}, {s.age}</strong>
                        <span className="text-xs text-teal-600 font-bold block">{s.condition}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 text-xs md:text-sm">
                      <p className="text-slate-500 leading-relaxed"><b className="text-slate-700 font-bold">Before:</b> {s.before}</p>
                      <p className="text-slate-650 leading-relaxed"><b className="text-teal-700 font-bold">After:</b> {s.after}</p>
                    </div>
                  </div>

                  {s.youtubeId && (
                    <span className="text-xs text-teal-600 font-bold flex items-center gap-1.5 group-hover:text-teal-700 transition-colors">
                      Watch video story <FaChevronRight className="text-[10px]" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <p className="text-slate-400 text-sm">No success stories match your search criteria.</p>
          </div>
        )}
      </div>

      {activeStory && activeStory.youtubeId && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer hover:border-slate-300 shadow transition"
              aria-label="Close video"
              onClick={() => setActive(null)}
            >
              ×
            </button>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeStory.youtubeId}?autoplay=1`}
                title={`${activeStory.name} testimonial`}
                allow="accelerated-output; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-5 flex justify-between items-center gap-4 text-xs md:text-sm border-t border-slate-100">
              <span className="text-slate-700 font-semibold">
                <strong className="text-slate-900 font-bold">{activeStory.name}, {activeStory.age}</strong> · {activeStory.condition}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${activeStory.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 font-bold hover:underline"
              >
                Open on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
