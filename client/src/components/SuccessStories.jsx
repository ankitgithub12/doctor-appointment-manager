import { useEffect, useState } from 'react'

const stories = [
  {
    name: 'Priya Mehta',
    age: 34,
    condition: 'Chronic Allergic Rhinitis',
    initials: 'PM',
    before: 'Daily antihistamines, constant sneezing, sleepless nights for 6 years.',
    after: 'Completely medicine-free for 14 months. Breathing freely again.',
    duration: '5 months of treatment',
    youtube: 'dQw4w9WgXcQ',
  },
  {
    name: 'Rakesh Gupta',
    age: 52,
    condition: 'Type 2 Diabetes',
    initials: 'RG',
    before: 'HbA1c of 9.2, rising insulin dependence, low energy.',
    after: 'HbA1c down to 6.1, reduced medication, back to morning walks.',
    duration: '8 months of treatment',
    youtube: 'dQw4w9WgXcQ',
  },
  {
    name: 'Neha Sharma',
    age: 28,
    condition: 'Bronchial Asthma',
    initials: 'NS',
    before: 'Inhaler 3x a day, frequent attacks, missed work regularly.',
    after: 'Zero attacks in 10 months. Inhaler retired completely.',
    duration: '6 months of treatment',
    youtube: 'dQw4w9WgXcQ',
  },
  {
    name: 'Arjun Verma',
    age: 41,
    condition: 'Psoriasis',
    initials: 'AV',
    before: 'Painful flare-ups on 40% of body, steroid creams stopped working.',
    after: '95% clear skin, no relapses, confidence fully restored.',
    duration: '9 months of treatment',
    youtube: 'dQw4w9WgXcQ',
  },
]

export default function SuccessStories() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active == null) return
    const onKey = (e) => { if (e.key === 'Escape') setActive(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  const story = active != null ? stories[active] : null

  return (
    <section className="section section-tint" id="stories">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Success stories</span>
          <h2>Their journeys toward the cure</h2>
          <p>Tap any story to watch the patient share their healing journey in their own words.</p>
        </div>

        <div className="stories-grid">
          {stories.map((s, i) => (
            <button
              className="story-card"
              key={s.name}
              onClick={() => setActive(i)}
              aria-label={`Watch ${s.name}'s video testimonial`}
            >
              <div className="story-thumb">
                <img
                  src={`https://img.youtube.com/vi/${s.youtube}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                />
                <span className="story-play" aria-hidden>▶</span>
                <span className="story-tag">{s.duration}</span>
              </div>
              <div className="story-body">
                <div className="story-person">
                  <div className="story-avatar">{s.initials}</div>
                  <div>
                    <strong>{s.name}, {s.age}</strong>
                    <span>{s.condition}</span>
                  </div>
                </div>
                <div className="story-transform">
                  <p className="story-before"><b>Before:</b> {s.before}</p>
                  <p className="story-after"><b>After:</b> {s.after}</p>
                </div>
                <span className="story-watch">▶ Watch video story</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {story && (
        <div className="video-modal" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" aria-label="Close video" onClick={() => setActive(null)}>×</button>
            <div className="video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${story.youtube}?autoplay=1`}
                title={`${story.name} testimonial`}
                allow="accelerated-output; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-caption">
              <strong>{story.name}, {story.age}</strong> · {story.condition}
              <a
                href={`https://www.youtube.com/watch?v=${story.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video-yt-link"
              >
                Open on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
