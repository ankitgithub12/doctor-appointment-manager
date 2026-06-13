import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { treatmentService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import SEO from '../components/SEO.jsx';

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
    el.style.transform = `perspective(700px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`;
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
      className="text-left w-full relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-2xl transition-transform duration-250 ease-out select-none group focus:outline-none"
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => navigate(`/treatments/${t.slug}`)}
      aria-label={`Explore ${t.name}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at var(--gx, 50%) var(--gy, 50%), rgba(20, 184, 166, 0.06), transparent 80%)`,
        }}
      />
      <span className="text-4xl bg-slate-950 border border-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-5" aria-hidden>
        {t.icon}
      </span>
      <span
        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
        style={{ backgroundColor: `${t.color}15`, color: t.color, border: `1px solid ${t.color}25` }}
      >
        {t.category}
      </span>
      <h3 className="font-extrabold text-slate-105 mt-3 text-lg">{t.name}</h3>
      <p className="text-slate-450 text-xs md:text-sm mt-2 leading-relaxed h-12 overflow-hidden">{t.shortDesc}</p>
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-850 text-xs">
        <span className="text-slate-400">
          <strong className="text-slate-200">{t.successRate}%</strong> Success
        </span>
        <span className="text-teal-400 font-bold hover:text-teal-350 transition-colors">Explore Program →</span>
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
    <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden" id="symptom-checker">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] pointer-events-none" />
      
      <div className="mb-8">
        <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider bg-teal-500/5 px-2.5 py-1 rounded-full border border-teal-500/10">
          AI-style symptom matcher
        </span>
        <h2 className="text-2xl font-bold mt-3 text-slate-100">Not Sure What You Need? Match in 20 Seconds.</h2>
        <p className="text-slate-400 text-sm mt-2">
          Select the symptoms you are currently experiencing — we will instantly suggest the matching homeopathy program.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 border-b border-slate-800 pb-3 text-xs font-semibold">
          <span className={step === 1 ? 'text-teal-400 font-bold' : 'text-slate-500'}>1 · Symptoms selection</span>
          <span className={step === 2 ? 'text-teal-400 font-bold' : 'text-slate-500'}>2 · Program suggestion</span>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {allSymptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  type="button"
                  className={`text-xs md:text-sm py-1.5 px-3 rounded-xl border transition-all cursor-pointer select-none ${
                    picked.includes(s)
                      ? 'bg-teal-500 text-slate-950 border-teal-500 font-bold'
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-750 text-slate-300'
                  }`}
                >
                  {picked.includes(s) ? '✓ ' : '+ '}{s}
                </button>
              ))}
            </div>
            <button
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none text-xs uppercase tracking-wider"
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
                <div className="flex flex-col items-center justify-center bg-slate-950/50 border border-slate-850 p-6 rounded-2xl text-center min-w-[140px]">
                  <span className="text-3xl font-black text-teal-400">
                    {result.confidence}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Match level</span>
                </div>
                
                <div className="space-y-4 text-left">
                  <div className="flex gap-2 items-center">
                    <span className="text-3xl">{result.t.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-100">Recommended Program: {result.t.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Based on your selections, this program yields an average <b>{result.t.successRate}% success rate</b>.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/treatments/${result.t.slug}`)}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setStep(1);
                        setPicked([]);
                      }}
                      className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold py-2 px-4 rounded-lg text-xs transition"
                    >
                      ↺ Reset Matcher
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center w-full py-6">
                <h3 className="font-bold text-slate-300">No clear match found</h3>
                <p className="text-xs text-slate-500 mt-1">Please select general symptoms to find the closest fit.</p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs transition"
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
    <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-8">
      <div className="text-center max-w-sm mx-auto mb-8">
        <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">Before / After</span>
        <h2 className="text-xl font-bold mt-2">Interactive Patient Recovery</h2>
        <p className="text-slate-400 text-xs mt-1">Slide the control bar handle left or right to reveal skin transformation.</p>
      </div>

      <div className="relative w-full max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden border border-slate-800 select-none bg-slate-950">
        {/* After (Bottom) */}
        <div className="absolute inset-0 flex items-center justify-center bg-teal-500/5">
          <span className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold py-1 px-2.5 rounded uppercase tracking-wider">
            After · 6 months
          </span>
          <span className="text-8xl select-none" aria-hidden>😄</span>
        </div>

        {/* Before (Top layer clipped) */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-rose-500/5 overflow-hidden transition-all duration-75"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <span className="absolute top-4 left-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold py-1 px-2.5 rounded uppercase tracking-wider">
            Before Treatment
          </span>
          <span className="text-8xl select-none" aria-hidden>😣</span>
        </div>

        {/* Divider bar */}
        <div className="absolute top-0 bottom-0 w-px bg-slate-100 z-10" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-100 text-slate-950 font-bold flex items-center justify-center shadow-lg text-xs cursor-pointer select-none">
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <SEO title="Clinical Homeopathy Programs" />
      {/* Scroll indicator progress bar */}
      <div className="fixed top-0 left-0 h-1 bg-teal-500 z-50 transition-all duration-75" style={{ width: `${progress}%` }} />

      {/* Hero Banner */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-slate-900/10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Clinical Programs</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-3 tracking-tight leading-tight">
            Explore Care Designed to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Cure the Root Cause</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-md mt-4 max-w-2xl mx-auto">
            Search, filter, match your symptoms, and see how our classical homeopathic programs support full recovery without side effects.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-10 border-t border-slate-900 pt-8 text-center">
            <div>
              <strong className="block text-2xl font-black text-slate-100">
                <CountUp to={200000} />+
              </strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Patients treated</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-slate-100">12</strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Treatment Areas</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-slate-100">89%</strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg. success rate</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-teal-400">0</strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-teal-500/80">Side Effects</span>
            </div>
          </div>

          <div className="pt-8">
            <a
              href="#symptom-checker"
              className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.98] text-xs uppercase"
            >
              🔍 Try the Symptom Matcher
            </a>
          </div>
        </div>
      </header>

      {/* Grid & Controls */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        {/* Search & category selection */}
        <div className="space-y-6 mb-12">
          <div className="relative max-w-xl">
            <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm select-none">🔍</span>
            <input
              type="text"
              placeholder="Search a condition or symptom… (e.g. asthma, sugar, psoriasis)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-teal-500 transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-3 w-5 h-5 text-sm font-bold bg-slate-850 hover:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center select-none"
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
                className={`text-xs font-semibold py-2 px-4 rounded-lg border transition ${
                  cat === c
                    ? 'bg-teal-500 text-slate-950 border-teal-500 font-bold'
                    : 'bg-slate-900/40 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-slate-450 text-xs mb-6 font-semibold">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

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
          <div className="text-center py-20 bg-slate-900/10 border border-slate-800 border-dashed rounded-3xl max-w-md mx-auto p-4">
            <span className="text-4xl block">🔎</span>
            <h3 className="font-bold text-slate-300 mt-4">No treatments found</h3>
            <p className="text-xs text-slate-500 mt-1">No clinical programs match “{query}”. Try another search term.</p>
            <button
              onClick={() => {
                setQuery('');
                setCat('All');
              }}
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-slate-350 px-4 py-2 rounded-lg text-xs font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Symptom Checker section */}
      <section className="py-16 max-w-6xl mx-auto px-4 border-t border-slate-900">
        <SymptomChecker treatments={treatments} />
      </section>

      {/* Slider comparison */}
      <section className="py-16 max-w-6xl mx-auto px-4 border-t border-slate-900">
        <BeforeAfter />
      </section>

      {/* CTA section */}
      <section className="mt-16 bg-gradient-to-tr from-teal-500/5 to-transparent border-t border-b border-slate-900 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Still Have Questions About Your Condition?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Talk to a certified homeopathy specialist today — your initial consult slot is completely free.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <a
              href="/#appointment"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition text-xs uppercase"
            >
              📅 Book Appointment
            </a>
            <a
              href="tel:+919829593852"
              className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold py-2.5 px-6 rounded-xl transition text-xs uppercase"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
