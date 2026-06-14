import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { treatmentService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import SEO from '../components/SEO.jsx';
import { getTreatmentIcon } from '../lib/icons.jsx';
import { FaSearch, FaCheck, FaSmile, FaFrown, FaCalendarAlt, FaPhoneAlt, FaFilter, FaArrowRight, FaSync } from 'react-icons/fa';

const CATEGORIES = ['All', 'Chronic', 'Lifestyle', 'Skin & Hair', 'Pediatric', "Women's", 'Mental'];

/* ───────────────────── Count-up number ───────────────────── */
function CountUp({ to, duration = 1300 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{n.toLocaleString('en-IN')}</>;
}

/* ───────────────────── 3D tilt card ───────────────────── */
function TiltCard({ t }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
    el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return (
    <button
      ref={ref}
      className="text-left w-full relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 select-none group focus:outline-none cursor-pointer"
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => navigate(`/treatments/${t.slug}`)}
      aria-label={`Explore ${t.name}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(350px circle at var(--gx, 50%) var(--gy, 50%), rgba(20, 184, 166, 0.05), transparent 80%)`,
        }}
      />
      <span className="text-xl bg-teal-50 border border-teal-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-inner animate-fadeIn" aria-hidden>
        {getTreatmentIcon(t.icon)}
      </span>
      <span
        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
        style={{ backgroundColor: `${t.color}10`, color: t.color, border: `1px solid ${t.color}20` }}
      >
        {t.category}
      </span>
      <h3 className="font-extrabold text-slate-800 mt-3 text-lg">{t.name}</h3>
      <p className="text-slate-500 text-xs md:text-sm mt-2 leading-relaxed h-12 overflow-hidden font-semibold">{t.shortDesc}</p>
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 text-xs font-semibold">
        <span className="text-slate-500">
          <strong className="text-teal-650 font-bold">{t.successRate}%</strong> Success Rate
        </span>
        <span className="text-teal-650 font-bold flex items-center gap-1 group-hover:text-teal-700 transition-colors">
          Explore Program <FaArrowRight className="text-[10px]" />
        </span>
      </div>
    </button>
  );
}

/* ───────────────────── Symptom Checker quiz ───────────────────── */
function SymptomChecker({ treatments }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [picked, setPicked] = useState([]);

  // Extract all distinct symptoms from the fetched treatments list
  const allSymptoms = useMemo(() => {
    return [...new Set(treatments.flatMap((t) => t.symptoms))];
  }, [treatments]);

  const toggle = (s) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const result = useMemo(() => {
    if (!picked.length) return null;
    const scored = treatments
      .map((t) => {
        const hits = t.symptoms.filter((s) => picked.includes(s)).length;
        return { t, hits };
      })
      .filter((x) => x.hits > 0)
      .sort((a, b) => b.hits - a.hits);
    if (!scored.length) return null;
    const top = scored[0];
    const confidence = Math.min(98, 55 + top.hits * 14);
    return { ...top, confidence };
  }, [picked, treatments]);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden" id="symptom-checker">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] pointer-events-none" />
      
      <div className="mb-8">
        <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-550/10 px-3 py-1 rounded-full border border-teal-200">
          AI Symptom Matcher
        </span>
        <h2 className="text-2xl font-bold mt-3 text-slate-800">Not Sure What You Need? Match in 20 Seconds.</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Select the symptoms you are currently experiencing — we will instantly suggest the matching homeopathy program.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 border-b border-slate-100 pb-3 text-xs font-bold">
          <span className={step === 1 ? 'text-teal-650 font-bold' : 'text-slate-400'}>1 · Symptoms selection</span>
          <span className={step === 2 ? 'text-teal-650 font-bold' : 'text-slate-400'}>2 · Program suggestion</span>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {allSymptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  type="button"
                  className={`text-xs md:text-sm py-1.5 px-3 rounded-xl border transition-all cursor-pointer select-none font-semibold ${
                    picked.includes(s)
                      ? 'bg-teal-600 text-white border-teal-600 font-bold'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-655'
                  }`}
                >
                  {picked.includes(s) ? '✓ ' : '+ '}{s}
                </button>
              ))}
            </div>
            <button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none text-xs uppercase tracking-wider shadow cursor-pointer"
              disabled={!picked.length}
              onClick={() => setStep(2)}
            >
              {picked.length ? `Find my match (${picked.length}) →` : 'Pick at least one symptom'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col md:flex-row gap-6 items-center animate-fadeIn">
            {result ? (
              <>
                <div className="flex flex-col items-center justify-center bg-teal-50 border border-teal-100 p-6 rounded-2xl text-center min-w-[140px] shadow-inner">
                  <span className="text-3xl font-black text-teal-705">
                    {result.confidence}%
                  </span>
                  <span className="text-[10px] text-slate-550 font-bold uppercase mt-1">Match level</span>
                </div>
                
                <div className="space-y-4 text-left">
                  <div className="flex gap-3 items-center">
                    <span className="text-2xl bg-white border border-slate-100 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">{getTreatmentIcon(result.t.icon)}</span>
                    <div>
                      <h3 className="font-bold text-slate-800">Recommended Program: {result.t.name}</h3>
                      <p className="text-slate-500 text-xs mt-1 font-semibold">
                        Based on your selections, this program yields an average <b className="text-teal-650">{result.t.successRate}% success rate</b>.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/treatments/${result.t.slug}`)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition shadow cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setStep(1);
                        setPicked([]);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-655 font-bold py-2 px-4 rounded-lg text-xs transition cursor-pointer"
                    >
                      <FaSync className="inline-block mr-1 text-[10px] align-middle" /> Reset Matcher
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center w-full py-6">
                <h3 className="font-bold text-slate-655">No clear match found</h3>
                <p className="text-xs text-slate-500 mt-1">Please select general symptoms to find the closest fit.</p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs transition border border-slate-200 cursor-pointer font-bold"
                >
                  ← Back to Selection
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────── Before / After slider ───────────────────── */
function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md">
      <div className="text-center max-w-sm mx-auto mb-8">
        <span className="text-teal-650 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Before / After
        </span>
        <h2 className="text-xl font-bold mt-3 text-slate-800">Interactive Patient Recovery</h2>
        <p className="text-slate-550 text-xs mt-1 font-semibold">Slide the control bar handle left or right to reveal skin transformation.</p>
      </div>

      <div className="relative w-full max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden border border-slate-150 select-none bg-slate-900 shadow-lg">
        {/* After (Bottom) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal-50/10">
          <span className="absolute top-4 right-4 bg-emerald-100 border border-emerald-250 text-emerald-700 text-[10px] font-bold py-1 px-2.5 rounded-lg uppercase tracking-wider shadow-sm">
            After · 6 months
          </span>
          <FaSmile className="text-white text-7xl drop-shadow-lg" />
        </div>

        {/* Before (Top layer clipped) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-rose-50/10 overflow-hidden transition-all duration-75"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <span className="absolute top-4 left-4 bg-rose-100 border border-rose-250 text-rose-700 text-[10px] font-bold py-1 px-2.5 rounded-lg uppercase tracking-wider shadow-sm">
            Before Treatment
          </span>
          <FaFrown className="text-white text-7xl drop-shadow-lg" />
        </div>

        {/* Divider bar */}
        <div className="absolute top-0 bottom-0 w-px bg-slate-200 z-10 shadow-lg" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-teal-650 font-black border border-slate-200 shadow-xl flex items-center justify-center text-xs cursor-pointer select-none">
            ⇆
          </span>
        </div>

        {/* Range Input Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Reveal before and after recovery comparison"
        />
      </div>
    </div>
  );
}

/* ───────────────────── Treatments Main Listing Page ───────────────────── */
export default function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await treatmentService.getTreatments();
        if (response?.success) {
          setTreatments(response.data);
        }
      } catch (error) {
        console.error('Failed to load treatments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return treatments.filter((t) => {
      const okCat = cat === 'All' || t.category === cat;
      const okQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.symptoms.some((s) => s.toLowerCase().includes(q));
      return okCat && okQ;
    });
  }, [cat, query, treatments]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <SEO title="Clinical Homeopathy Programs" />
      {/* Scroll indicator progress bar */}
      <div className="fixed top-0 left-0 h-1 bg-teal-600 z-50 transition-all duration-75" style={{ width: `${progress}%` }} />

      {/* Hero Banner */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-slate-100 shadow-sm shadow-slate-100/30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <span className="text-teal-650 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Clinical Programs
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-4 tracking-tight leading-tight text-slate-900">
            Explore Care Designed to <span className="text-teal-605">Cure the Root Cause</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-md mt-4 max-w-2xl mx-auto font-medium">
            Search, filter, match your symptoms, and see how our classical homeopathic programs support full recovery without side effects.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-10 border-t border-slate-100 pt-8 text-center font-semibold">
            <div>
              <strong className="block text-2xl font-black text-slate-900">
                <CountUp to={200000} />+
              </strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Patients treated</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-slate-900">12</strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Treatment Areas</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-slate-900">89%</strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg. success rate</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-teal-600">0</strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-teal-600">Side Effects</span>
            </div>
          </div>

          <div className="pt-8">
            <a
              href="#symptom-checker"
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] text-xs uppercase shadow cursor-pointer"
            >
              <FaSearch /> Try the Symptom Matcher
            </a>
          </div>
        </div>
      </header>

      {/* Grid & Controls */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        {/* Search & category selection */}
        <div className="space-y-6 mb-12">
          <div className="relative max-w-xl shadow-sm rounded-xl">
            <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm select-none"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search a condition or symptom… (e.g. asthma, sugar, psoriasis)"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-3 w-5 h-5 text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center select-none cursor-pointer"
                aria-label="Clear Search"
              >
                ×
              </button>
            )}
          </div>

          {/* Categories select tags */}
          <div className="flex flex-wrap gap-2 select-none">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-xs font-bold py-2 px-4 rounded-lg border transition cursor-pointer ${
                  cat === c
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-6 font-bold">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader size="lg" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TiltCard key={t._id} t={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl max-w-md mx-auto p-6 shadow-sm">
            <span className="text-4xl block"><FaSearch className="mx-auto text-slate-300" /></span>
            <h3 className="font-bold text-slate-700 mt-4">No treatments found</h3>
            <p className="text-xs text-slate-500 mt-1">No clinical programs match “{query}”. Try another search term.</p>
            <button
              onClick={() => {
                setQuery('');
                setCat('All');
              }}
              className="mt-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Symptom Checker section */}
      <section className="py-16 max-w-6xl mx-auto px-4 border-t border-slate-100">
        <SymptomChecker treatments={treatments} />
      </section>

      {/* Slider comparison */}
      <section className="py-16 max-w-6xl mx-auto px-4 border-t border-slate-100">
        <BeforeAfter />
      </section>

      {/* CTA section */}
      <section className="mt-16 bg-white border-t border-b border-slate-100 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Still Have Questions About Your Condition?</h2>
          <p className="text-slate-500 text-sm leading-relaxed font-semibold">
            Talk to a certified homeopathy specialist today — your initial consult slot is completely free.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Link
              to="/booking"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition text-xs uppercase shadow flex items-center gap-1.5"
            >
              <FaCalendarAlt /> Book Appointment
            </Link>
            <a
              href="tel:+919829593852"
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition text-xs uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <FaPhoneAlt /> Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
