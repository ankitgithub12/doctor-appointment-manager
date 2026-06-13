import { useEffect, useMemo, useRef, useState } from 'react'
import { goToSection } from '../lib/router.js'
import '../treatments.css'

/* ─────────────────────────── Data ─────────────────────────── */
const CATEGORIES = ['All', 'Chronic', 'Lifestyle', 'Skin & Hair', 'Pediatric', "Women's", 'Mental']

const TREATMENTS = [
  {
    id: 'respiratory', icon: '🫁', name: 'Respiratory Care', category: 'Chronic', color: '#1f74e0',
    short: 'Asthma, COPD, bronchitis & recurrent chest infections — eased at the root.',
    success: 92, duration: '4–6 months', patients: '28,000+',
    symptoms: ['Breathlessness', 'Wheezing', 'Chronic cough', 'Chest tightness'],
    timeline: [
      { t: 'Week 1–2', d: 'Detailed case-taking & constitutional remedy' },
      { t: 'Month 1–2', d: 'Reduced attack frequency, less inhaler use' },
      { t: 'Month 3–4', d: 'Improved lung capacity & stamina' },
      { t: 'Month 5–6', d: 'Lasting relief on a maintenance dose' },
    ],
  },
  {
    id: 'diabetes', icon: '🩸', name: 'Diabetes Management', category: 'Lifestyle', color: '#16a34a',
    short: 'Stabilise blood sugar and reduce medication dependence, naturally.',
    success: 88, duration: '6–9 months', patients: '34,000+',
    symptoms: ['High sugar levels', 'Fatigue', 'Frequent urination', 'Slow healing'],
    timeline: [
      { t: 'Week 1–2', d: 'Baseline workup & personalised diet plan' },
      { t: 'Month 1–3', d: 'Sugar levels begin to stabilise' },
      { t: 'Month 4–6', d: 'Energy returns, dosage tapered with your physician' },
      { t: 'Month 7–9', d: 'Sustained control & lifestyle locked in' },
    ],
  },
  {
    id: 'skin', icon: '🌿', name: 'Skin & Psoriasis', category: 'Skin & Hair', color: '#0ea5e9',
    short: 'Eczema, psoriasis, acne & pigmentation cleared without steroids.',
    success: 90, duration: '5–8 months', patients: '22,000+',
    symptoms: ['Itching', 'Flare-ups', 'Redness', 'Scaling / dryness'],
    timeline: [
      { t: 'Week 1–3', d: 'Calm acute flare-ups & itching' },
      { t: 'Month 1–3', d: 'Visible reduction in patches' },
      { t: 'Month 4–6', d: '70–90% clearance of affected skin' },
      { t: 'Month 7–8', d: 'Relapse-free skin, confidence restored' },
    ],
  },
  {
    id: 'kidney', icon: '🫘', name: 'Kidney Disease', category: 'Chronic', color: '#6366f1',
    short: 'Supportive care to slow progression and improve kidney function.',
    success: 84, duration: '6–12 months', patients: '9,500+',
    symptoms: ['Swelling', 'Fatigue', 'High creatinine', 'Reduced appetite'],
    timeline: [
      { t: 'Week 1–2', d: 'Reports review & gentle remedy plan' },
      { t: 'Month 1–3', d: 'Swelling & fatigue improve' },
      { t: 'Month 4–8', d: 'Function markers stabilise' },
      { t: 'Month 9–12', d: 'Quality of life markedly improved' },
    ],
  },
  {
    id: 'joints', icon: '🦴', name: 'Joints & Arthritis', category: 'Chronic', color: '#f97316',
    short: 'Rheumatoid & osteoarthritis pain managed without long-term painkillers.',
    success: 87, duration: '4–7 months', patients: '17,000+',
    symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Reduced mobility'],
    timeline: [
      { t: 'Week 1–2', d: 'Pain-relief remedy & mobility check' },
      { t: 'Month 1–2', d: 'Morning stiffness eases' },
      { t: 'Month 3–5', d: 'Swelling down, movement freer' },
      { t: 'Month 6–7', d: 'Active life without daily painkillers' },
    ],
  },
  {
    id: 'digestive', icon: '🍽️', name: 'Digestive Health', category: 'Lifestyle', color: '#14b8a6',
    short: 'IBS, acidity, constipation & piles treated gently at the cause.',
    success: 91, duration: '3–5 months', patients: '20,000+',
    symptoms: ['Acidity', 'Bloating', 'Irregular bowels', 'Cramps'],
    timeline: [
      { t: 'Week 1–2', d: 'Gut-soothing remedy & food map' },
      { t: 'Month 1–2', d: 'Acidity & bloating settle' },
      { t: 'Month 3–4', d: 'Regular, comfortable digestion' },
      { t: 'Month 5', d: 'Stable gut, no dependence on antacids' },
    ],
  },
  {
    id: 'women', icon: '🌸', name: "Women's Health", category: "Women's", color: '#ec4899',
    short: 'PCOD, thyroid, irregular cycles & fertility support.',
    success: 86, duration: '5–8 months', patients: '19,000+',
    symptoms: ['Irregular periods', 'Weight gain', 'Hormonal acne', 'Mood swings'],
    timeline: [
      { t: 'Week 1–2', d: 'Hormonal assessment & remedy' },
      { t: 'Month 1–3', d: 'Cycles begin to regularise' },
      { t: 'Month 4–6', d: 'Hormones balance, symptoms fade' },
      { t: 'Month 7–8', d: 'Stable cycle & improved fertility' },
    ],
  },
  {
    id: 'child', icon: '👶', name: 'Child Immunity', category: 'Pediatric', color: '#22c55e',
    short: 'Recurrent colds, allergies & low immunity in children.',
    success: 93, duration: '3–6 months', patients: '15,000+',
    symptoms: ['Frequent colds', 'Allergies', 'Poor appetite', 'Low energy'],
    timeline: [
      { t: 'Week 1–2', d: 'Gentle, child-safe constitutional remedy' },
      { t: 'Month 1–2', d: 'Fewer infections & better appetite' },
      { t: 'Month 3–4', d: 'Stronger immunity, more active' },
      { t: 'Month 5–6', d: 'Rarely falls sick, thriving' },
    ],
  },
  {
    id: 'mental', icon: '🧠', name: 'Mind & Stress', category: 'Mental', color: '#8b5cf6',
    short: 'Anxiety, depression, insomnia & stress with therapy + homeopathy.',
    success: 89, duration: '3–6 months', patients: '12,000+',
    symptoms: ['Anxiety', 'Poor sleep', 'Low mood', 'Overthinking'],
    timeline: [
      { t: 'Week 1–2', d: 'Counselling + calming remedy' },
      { t: 'Month 1–2', d: 'Sleep improves, anxiety lowers' },
      { t: 'Month 3–4', d: 'Stable mood & coping tools' },
      { t: 'Month 5–6', d: 'Resilient, balanced wellbeing' },
    ],
  },
  {
    id: 'hairfall', icon: '💇', name: 'Hair & Scalp', category: 'Skin & Hair', color: '#0891b2',
    short: 'Hair fall, alopecia & dandruff reversed by treating the root cause.',
    success: 85, duration: '4–7 months', patients: '13,000+',
    symptoms: ['Excess hair fall', 'Thinning', 'Dandruff', 'Bald patches'],
    timeline: [
      { t: 'Week 1–3', d: 'Scalp analysis & internal remedy' },
      { t: 'Month 1–2', d: 'Hair fall reduces noticeably' },
      { t: 'Month 3–5', d: 'New regrowth begins' },
      { t: 'Month 6–7', d: 'Fuller, healthier hair' },
    ],
  },
  {
    id: 'allergy', icon: '🤧', name: 'Allergy & Sinus', category: 'Chronic', color: '#3b82f6',
    short: 'Allergic rhinitis, sinusitis & urticaria — break the cycle for good.',
    success: 90, duration: '4–6 months', patients: '21,000+',
    symptoms: ['Sneezing', 'Blocked nose', 'Itchy eyes', 'Hives'],
    timeline: [
      { t: 'Week 1–2', d: 'Trigger mapping & constitutional remedy' },
      { t: 'Month 1–2', d: 'Sneezing & congestion drop' },
      { t: 'Month 3–4', d: 'Reduced sensitivity to triggers' },
      { t: 'Month 5–6', d: 'Allergy-free seasons' },
    ],
  },
  {
    id: 'thyroid', icon: '🦋', name: 'Thyroid Care', category: 'Lifestyle', color: '#10b981',
    short: 'Hypo & hyperthyroid balanced naturally with constitutional care.',
    success: 86, duration: '5–9 months', patients: '11,000+',
    symptoms: ['Weight changes', 'Fatigue', 'Hair fall', 'Mood swings'],
    timeline: [
      { t: 'Week 1–2', d: 'Thyroid profile review & remedy' },
      { t: 'Month 1–3', d: 'Energy & weight begin to balance' },
      { t: 'Month 4–6', d: 'Levels trend toward normal' },
      { t: 'Month 7–9', d: 'Stable thyroid, tapered dosage' },
    ],
  },
]

/* ───────────────────── Animated success ring ───────────────────── */
function SuccessRing({ value, color, size = 132, stroke = 11 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(value))
    return () => cancelAnimationFrame(id)
  }, [value])
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e8eef6" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (circ * progress) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="ring-label"><CountUp to={value} />%<span>success</span></div>
    </div>
  )
}

/* ───────────────────── Count-up number ───────────────────── */
function CountUp({ to, duration = 1300 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf, start
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{n.toLocaleString('en-IN')}</>
}

/* ───────────────────── 3D tilt card ───────────────────── */
function TiltCard({ t, onOpen }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(700px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`
    el.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
  }
  const reset = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }
  return (
    <button
      ref={ref}
      className="tcard"
      style={{ '--c': t.color }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => onOpen(t)}
      aria-label={`Explore ${t.name}`}
    >
      <span className="tcard-glow" aria-hidden />
      <span className="tcard-icon" aria-hidden>{t.icon}</span>
      <span className="tcard-cat">{t.category}</span>
      <h3>{t.name}</h3>
      <p>{t.short}</p>
      <div className="tcard-meta">
        <span className="tcard-success"><b>{t.success}%</b> success</span>
        <span className="tcard-explore">Explore →</span>
      </div>
      <div className="tcard-bar"><i style={{ width: `${t.success}%` }} /></div>
    </button>
  )
}

/* ───────────────────── Detail modal ───────────────────── */
function DetailModal({ t, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="tm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="tm-panel" onClick={(e) => e.stopPropagation()} style={{ '--c': t.color }}>
        <button className="tm-close" onClick={onClose} aria-label="Close">×</button>
        <div className="tm-head">
          <span className="tm-icon" aria-hidden>{t.icon}</span>
          <div>
            <span className="tm-cat">{t.category}</span>
            <h2>{t.name}</h2>
            <p>{t.short}</p>
          </div>
        </div>

        <div className="tm-grid">
          <div className="tm-ring-col">
            <SuccessRing value={t.success} color={t.color} />
            <div className="tm-facts">
              <div><b>{t.duration}</b><span>Avg. duration</span></div>
              <div><b>{t.patients}</b><span>Treated</span></div>
            </div>
          </div>

          <div>
            <h4 className="tm-sub">Symptoms we treat</h4>
            <div className="tm-tags">
              {t.symptoms.map((s) => <span key={s} className="tm-tag">{s}</span>)}
            </div>

            <h4 className="tm-sub">Your healing journey</h4>
            <ol className="tm-timeline">
              {t.timeline.map((step) => (
                <li key={step.t}>
                  <span className="tm-dot" />
                  <div><b>{step.t}</b><p>{step.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="tm-cta">
          <button className="btn btn-accent btn-lg" onClick={() => { onClose(); goToSection('#appointment') }}>
            📅 Book this treatment
          </button>
          <a className="btn btn-ghost btn-lg" href="https://wa.me/919829593852" target="_blank" rel="noopener noreferrer">
            💬 Ask on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────── Symptom Checker quiz ───────────────────── */
const ALL_SYMPTOMS = [
  ...new Set(TREATMENTS.flatMap((t) => t.symptoms)),
]

function SymptomChecker({ onOpen }) {
  const [step, setStep] = useState(1)
  const [picked, setPicked] = useState([])

  const toggle = (s) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  const result = useMemo(() => {
    if (!picked.length) return null
    const scored = TREATMENTS.map((t) => {
      const hits = t.symptoms.filter((s) => picked.includes(s)).length
      return { t, hits }
    }).filter((x) => x.hits > 0).sort((a, b) => b.hits - a.hits)
    if (!scored.length) return null
    const top = scored[0]
    const confidence = Math.min(98, 55 + top.hits * 14)
    return { ...top, confidence }
  }, [picked])

  return (
    <div className="checker" id="symptom-checker">
      <div className="checker-head">
        <span className="eyebrow eyebrow-light">AI-style symptom matcher</span>
        <h2>Not sure what you need? Let's find out in 20 seconds.</h2>
        <p>Select what you're experiencing — we'll instantly match you to the right treatment.</p>
      </div>

      <div className="checker-body">
        <div className="checker-steps">
          <span className={step >= 1 ? 'on' : ''}>1 · Symptoms</span>
          <span className={step >= 2 ? 'on' : ''}>2 · Your match</span>
        </div>

        {step === 1 && (
          <div className="checker-pane">
            <div className="symptom-cloud">
              {ALL_SYMPTOMS.map((s) => (
                <button
                  key={s}
                  className={`symptom-chip${picked.includes(s) ? ' picked' : ''}`}
                  onClick={() => toggle(s)}
                  type="button"
                >
                  {picked.includes(s) ? '✓ ' : '+ '}{s}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary btn-lg checker-next"
              disabled={!picked.length}
              onClick={() => setStep(2)}
            >
              {picked.length ? `Find my match (${picked.length}) →` : 'Pick at least one symptom'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="checker-pane checker-result">
            {result ? (
              <>
                <div className="result-confidence">
                  <SuccessRing value={result.confidence} color={result.t.color} size={120} stroke={10} />
                  <span className="result-conf-cap">match confidence</span>
                </div>
                <div className="result-info" style={{ '--c': result.t.color }}>
                  <span className="result-icon" aria-hidden>{result.t.icon}</span>
                  <h3>We recommend: {result.t.name}</h3>
                  <p>
                    Based on your symptoms, this is your strongest match — with a{' '}
                    <b>{result.t.success}% success rate</b> over an average of {result.t.duration}.
                  </p>
                  <div className="result-actions">
                    <button className="btn btn-primary" onClick={() => onOpen(result.t)}>View treatment details</button>
                    <button className="btn btn-ghost" onClick={() => { setStep(1); setPicked([]) }}>↺ Start over</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="result-info">
                <h3>No clear match yet</h3>
                <p>Try selecting a few more symptoms, or talk to our doctors directly.</p>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back to symptoms</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ───────────────────── Before / After slider ───────────────────── */
function BeforeAfter() {
  const [pos, setPos] = useState(50)
  return (
    <div className="ba-wrap">
      <div className="ba-head">
        <span className="eyebrow">Real results</span>
        <h2>Drag to reveal the transformation</h2>
        <p>An illustrative before / after — slide the handle to compare.</p>
      </div>
      <div className="ba-compare" style={{ '--pos': `${pos}%` }}>
        <div className="ba-img ba-after">
          <span className="ba-tag ba-tag-after">After · 6 months</span>
          <span className="ba-emoji" aria-hidden>😄</span>
        </div>
        <div className="ba-img ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <span className="ba-tag ba-tag-before">Before</span>
          <span className="ba-emoji" aria-hidden>😣</span>
        </div>
        <div className="ba-divider" style={{ left: `${pos}%` }}>
          <span className="ba-handle" aria-hidden>⇆</span>
        </div>
        <input
          className="ba-range"
          type="range" min="0" max="100" value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Reveal before and after"
        />
      </div>
    </div>
  )
}

/* ───────────────────── Page ───────────────────── */
export default function Treatments() {
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TREATMENTS.filter((t) => {
      const okCat = cat === 'All' || t.category === cat
      const okQ = !q || t.name.toLowerCase().includes(q) ||
        t.short.toLowerCase().includes(q) ||
        t.symptoms.some((s) => s.toLowerCase().includes(q))
      return okCat && okQ
    })
  }, [cat, query])

  return (
    <div className="trt">
      <div className="trt-progress" style={{ width: `${progress}%` }} />

      {/* Hero */}
      <header className="trt-hero">
        <div className="trt-hero-blob trt-blob-1" />
        <div className="trt-hero-blob trt-blob-2" />
        <div className="container trt-hero-inner">
          <span className="eyebrow eyebrow-light">Our treatments</span>
          <h1>Explore care designed to <span>cure the root cause</span></h1>
          <p>
            {TREATMENTS.length}+ specialised homeopathy programs — search, filter, match your
            symptoms, and see exactly how your healing journey unfolds.
          </p>
          <div className="trt-hero-stats">
            <div><b><CountUp to={200000} />+</b><span>Patients treated</span></div>
            <div><b><CountUp to={12} /></b><span>Treatment areas</span></div>
            <div><b><CountUp to={89} />%</b><span>Avg. success</span></div>
            <div><b>0</b><span>Side effects</span></div>
          </div>
          <a href="#symptom-checker" className="btn btn-accent btn-lg trt-hero-cta">🔍 Try the Symptom Matcher</a>
        </div>
      </header>

      {/* Controls + grid */}
      <section className="section">
        <div className="container">
          <div className="trt-controls">
            <div className="trt-search">
              <span aria-hidden>🔍</span>
              <input
                type="text"
                placeholder="Search a condition or symptom… (e.g. asthma, itching, sugar)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && <button className="trt-clear" onClick={() => setQuery('')} aria-label="Clear">×</button>}
            </div>
            <div className="trt-chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`trt-chip${cat === c ? ' active' : ''}`}
                  onClick={() => setCat(c)}
                >{c}</button>
              ))}
            </div>
          </div>

          <p className="trt-count">{filtered.length} treatment{filtered.length !== 1 ? 's' : ''} found</p>

          {filtered.length ? (
            <div className="tcard-grid">
              {filtered.map((t) => <TiltCard key={t.id} t={t} onOpen={setActive} />)}
            </div>
          ) : (
            <div className="trt-empty">
              <span aria-hidden>🔎</span>
              <p>No treatments match “{query}”. Try another term or clear the filter.</p>
              <button className="btn btn-ghost" onClick={() => { setQuery(''); setCat('All') }}>Reset search</button>
            </div>
          )}
        </div>
      </section>

      {/* Symptom checker */}
      <section className="section trt-checker-sec">
        <div className="container">
          <SymptomChecker onOpen={setActive} />
        </div>
      </section>

      {/* Before / after */}
      <section className="section section-tint">
        <div className="container">
          <BeforeAfter />
        </div>
      </section>

      {/* CTA strip */}
      <section className="trt-final">
        <div className="container trt-final-inner">
          <h2>Still have questions about your condition?</h2>
          <p>Talk to a certified homeopath today — your first consultation is free.</p>
          <div className="trt-final-ctas">
            <button className="btn btn-accent btn-lg" onClick={() => goToSection('#appointment')}>📅 Book Appointment</button>
            <a className="btn btn-ghost-light btn-lg" href="tel:+919829593852">📞 Call Now</a>
          </div>
        </div>
      </section>

      {active && <DetailModal t={active} onClose={() => setActive(null)} />}
    </div>
  )
}
