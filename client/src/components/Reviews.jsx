import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView.js'

const reviewStats = [
  { num: 2300, suffix: '+', label: 'Verified reviews' },
  { num: 4.9, suffix: '/5', label: 'Average rating', decimals: 1 },
  { num: 98, suffix: '%', label: 'Would recommend' },
  { num: 50000, suffix: '+', label: 'Patients treated' },
]

function useCountUp(target, start, { duration = 1600, decimals = 0 } = {}) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf
    let startedAt
    const step = (ts) => {
      if (startedAt === undefined) startedAt = ts
      const progress = Math.min((ts - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(target * eased)
      if (progress < 1) raf = requestAnimationFrame(step)
      else setValue(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-IN')
}

function ReviewStat({ stat, start }) {
  const display = useCountUp(stat.num, start, { decimals: stat.decimals || 0 })
  return (
    <div className="review-stat">
      <span className="review-stat-num">{display}{stat.suffix}</span>
      <span className="review-stat-label">{stat.label}</span>
    </div>
  )
}

const reviews = [
  { name: 'Priya Mehta', role: 'Allergic Rhinitis', initials: 'PM', rating: 5, video: 'dQw4w9WgXcQ',
    text: "Dr. Khandelwal actually listens. After 6 years of seasonal allergies, I'm finally living without daily antihistamines. Truly life-changing care." },
  { name: 'Rakesh Gupta', role: 'Type 2 Diabetes', initials: 'RG', rating: 5,
    text: "My blood sugar is the most stable it's been in 8 years. The personalised plan and constant check-ins made all the difference." },
  { name: 'Neha Sharma', role: 'Bronchial Asthma', initials: 'NS', rating: 5, video: 'dQw4w9WgXcQ',
    text: "I came in for chronic asthma and left with a complete wellness routine. The clinic feels warm, never rushed. Highly recommend." },
  { name: 'Arjun Verma', role: 'Psoriasis', initials: 'AV', rating: 5,
    text: "95% clear skin in 9 months after years of failed steroid creams. I finally have my confidence back. Forever grateful to this team." },
  { name: 'Meera Iyer', role: 'Thyroid & Weight', initials: 'MI', rating: 5,
    text: "Lost 11kg and my thyroid levels normalised without any harsh medication. The diet + homeopathy combo genuinely works." },
  { name: 'Sandeep Rao', role: "Child's Immunity", initials: 'SR', rating: 5, video: 'dQw4w9WgXcQ',
    text: "My son used to fall sick every month. After treatment he's barely missed a school day all year. Wonderful pediatric care." },
]

const PER_VIEW = 3

export default function Reviews() {
  const [start, setStart] = useState(0)
  const [perView, setPerView] = useState(PER_VIEW)
  const [video, setVideo] = useState(null)
  const [statsRef, statsInView] = useInView({ threshold: 0.4 })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setPerView(w <= 560 ? 1 : w <= 960 ? 2 : PER_VIEW)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxStart = Math.max(0, reviews.length - perView)
  const clampedStart = Math.min(start, maxStart)
  const visible = reviews.slice(clampedStart, clampedStart + perView)

  const prev = () => setStart((s) => Math.max(0, s - 1))
  const next = () => setStart((s) => Math.min(maxStart, s + 1))

  useEffect(() => {
    if (video == null) return
    const onKey = (e) => { if (e.key === 'Escape') setVideo(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [video])

  return (
    <section className="section section-tint" id="reviews">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Patient reviews</span>
          <h2>Loved by thousands of families</h2>
          <p>4.9/5 average across 2,300+ verified Google &amp; Practo reviews.</p>
        </div>

        <div className="review-stats" ref={statsRef}>
          {reviewStats.map((s) => (
            <ReviewStat key={s.label} stat={s} start={statsInView} />
          ))}
        </div>

        <div className="reviews-slider">
          <button className="slider-arrow" onClick={prev} disabled={clampedStart === 0} aria-label="Previous reviews">‹</button>

          <div className="reviews-track">
            {visible.map((r) => (
              <article className="review-card" key={r.name}>
                <div className="review-head">
                  <div className="test-avatar">{r.initials}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.role}</span>
                  </div>
                  {r.video && (
                    <button
                      className="review-video-btn"
                      onClick={() => setVideo(r.video)}
                      aria-label={`Watch ${r.name}'s video review`}
                    >▶</button>
                  )}
                </div>
                <div className="stars">{'★'.repeat(r.rating)}</div>
                <p className="review-text">{r.text}</p>
                {r.video && (
                  <button className="review-watch" onClick={() => setVideo(r.video)}>▶ Watch video review</button>
                )}
              </article>
            ))}
          </div>

          <button className="slider-arrow" onClick={next} disabled={clampedStart >= maxStart} aria-label="Next reviews">›</button>
        </div>

        <div className="slider-dots">
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              className={`slider-dot${i === clampedStart ? ' active' : ''}`}
              onClick={() => setStart(i)}
              aria-label={`Go to review group ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {video && (
        <div className="video-modal" role="dialog" aria-modal="true" onClick={() => setVideo(null)}>
          <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" aria-label="Close video" onClick={() => setVideo(null)}>×</button>
            <div className="video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${video}?autoplay=1`}
                title="Patient video review"
                allow="accelerated-output; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
