const services = [
  { icon: '🩸', title: 'Diabetic Management', desc: 'Long-term blood sugar regulation through individualised homeopathic protocols.' },
  { icon: '🚽', title: 'Constipation Treatment', desc: 'Gentle, root-cause therapy that restores natural digestive rhythm.' },
  { icon: '🩹', title: 'Piles & Fissure Relief', desc: 'Non-surgical care for painful piles, fistula and chronic anal fissures.' },
  { icon: '❤️', title: 'Blood Pressure Regulation', desc: 'Balancing high and low BP without dependence on long-term suppressants.' },
  { icon: '😮‍💨', title: 'Bronchial Asthma', desc: 'Reduce attacks, dependence on inhalers, and rebuild respiratory strength.' },
  { icon: '🤧', title: 'Respiratory Tract Infections', desc: 'Recurrent cold, cough and sinus problems treated at the root.' },
  { icon: '🫁', title: 'Pneumonia Care', desc: 'Supportive homeopathic care for recovery and long-term lung health.' },
  { icon: '🌸', title: 'Allergic Rhinitis', desc: 'End the seasonal sneezing cycle with constitutional homeopathy.' },
  { icon: '💨', title: 'COPD Management', desc: 'Slow progression, ease breathing, and improve quality of life.' },
  { icon: '🌬️', title: 'Interstitial Lung Disease', desc: 'Adjunct homeopathic support for ILD symptom relief and stability.' },
  { icon: '🧠', title: 'Counselling & Therapy', desc: 'Therapy sessions for stress, anxiety, sleep and emotional well-being.' },
  { icon: '🧘‍♂️', title: 'Wellness & Lifestyle', desc: 'Personalised plans blending diet, yoga and naturopathy with homeopathy.' },
]

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Our services</span>
          <h2>Comprehensive treatments under one roof</h2>
          <p>
            From chronic illness management to wellness counselling — we offer 12 specialised
            services rooted in classical homeopathy.
          </p>
        </div>
        <div className="services-grid">
          {services.map(s => (
            <article className="service-card" key={s.title}>
              <div className="service-icon" aria-hidden>{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <a href="#appointment" className="service-link">Book treatment →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
