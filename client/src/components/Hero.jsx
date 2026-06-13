import React, { useRef } from 'react';

const lines = [
  '100% Safe & Natural Treatment',
  'No Side Effects · No Steroids',
  'Cures the Root Cause — Permanently',
];

export default function Hero() {
  const boxRef = useRef(null);

  // Subtle 3D tilt that follows the cursor.
  const onMove = (e) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    const el = boxRef.current;
    if (el) el.style.transform = '';
  };

  return (
    <section className="relative bg-slate-950 pt-32 pb-20 overflow-hidden" id="home">
      {/* Background glow glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Copy section */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 py-1.5 px-3 rounded-full font-semibold">
            🏆 <strong>200,000+</strong> Happy patients treated across India &amp; abroad
          </span>

          {/* Interactive hero box */}
          <div
            className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl transition-transform duration-250 ease-out select-none group"
            ref={boxRef}
            onMouseMove={onMove}
            onMouseLeave={reset}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Custom interactive glowing card highlight */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(400px circle at var(--gx, 50%) var(--gy, 50%), rgba(20, 184, 166, 0.08), transparent 80%)',
              }}
            />

            <div className="flex items-center gap-3 border-b border-slate-800 pb-5 mb-5">
              <span className="w-11 h-11 bg-teal-500 text-slate-950 font-black flex items-center justify-center rounded-2xl text-lg shadow-lg shadow-teal-500/10">
                H
              </span>
              <div>
                <strong className="text-slate-100 text-md block font-extrabold">HomeHub Homeopathy</strong>
                <small className="text-slate-400 text-xs block">Safe • Natural • Root-Cause Cure</small>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {lines.map((l, i) => (
                <li
                  key={l}
                  className="flex items-center gap-3 text-slate-350 text-sm md:text-md animate-fadeIn"
                  style={{ animationDelay: `${0.1 + i * 0.15}s` }}
                >
                  <span className="w-5 h-5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-xs font-bold" aria-hidden>
                    ✓
                  </span>{' '}
                  {l}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a
                href="tel:+919829593852"
                className="flex-1 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl p-4 flex items-center gap-3 hover:shadow-lg transition-all group/call"
              >
                <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center relative flex-shrink-0">
                  <span className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping opacity-75" />
                  📞
                </div>
                <div className="text-left leading-tight">
                  <small className="text-slate-500 text-[10px] block uppercase font-bold">Call us now</small>
                  <span className="text-slate-200 font-mono font-bold text-sm group-hover/call:text-teal-400 transition-colors">
                    +91 98295 93852
                  </span>
                </div>
              </a>
              <a
                href="#free-consultation"
                className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-4 rounded-2xl flex items-center justify-center transition hover:shadow-lg hover:shadow-teal-500/10 text-sm active:scale-[0.98] text-center"
              >
                Avail Free Consultation →
              </a>
            </div>
          </div>
        </div>

        {/* Media / Authority Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 hover:border-slate-700/50 transition-all duration-300">
            {/* Ambient behind glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-teal-500/5 to-blue-500/5 opacity-50 pointer-events-none" />

            <div className="space-y-4 relative z-10 text-center">
              <div className="w-20 h-20 bg-slate-950 border border-slate-800 text-slate-100 text-4xl rounded-2xl flex items-center justify-center mx-auto shadow-md" aria-hidden>
                👨‍⚕️
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100">Dr. Abhishek Khandelwal</h3>
                <span className="text-xs text-slate-400 font-medium block">Founder &amp; Chief Homeopath</span>
                <span className="text-xs text-teal-450 block">BHMS, MD (Homeopathy)</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="text-xs bg-slate-950 border border-slate-850 text-slate-300 py-1 px-3 rounded-lg">
                  12+ Years Exp.
                </span>
                <span className="text-xs bg-slate-950 border border-slate-850 text-slate-300 py-1 px-3 rounded-lg">
                  CCH Certified
                </span>
              </div>
            </div>

            {/* Float Badge 1 */}
            <div className="absolute -top-4 -right-4 bg-slate-900 border border-slate-800 text-slate-200 text-xs py-2 px-3 rounded-xl shadow-lg flex items-center gap-1.5 font-bold hover:scale-105 transition-transform">
              ⭐ <span className="text-teal-400">4.9 Rating</span>
            </div>

            {/* Float Badge 2 */}
            <div className="absolute -bottom-4 -left-4 bg-slate-900 border border-slate-800 text-slate-200 text-xs py-2 px-3 rounded-xl shadow-lg flex items-center gap-1.5 font-bold hover:scale-105 transition-transform">
              🛡️ <span className="text-blue-400">Govt. Registered</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
