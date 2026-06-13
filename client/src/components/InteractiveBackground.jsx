import React, { useEffect, useRef } from 'react';

// A fixed, full-viewport animated background that reacts to the cursor.
export default function InteractiveBackground() {
  const ref = useRef(null);

  useEffect(() => {
    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          el.style.setProperty('--mx', `${(e.clientX / window.innerWidth) * 100}%`);
          el.style.setProperty('--my', `${(e.clientY / window.innerHeight) * 100}%`);
        }
        raf = 0;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950" ref={ref} aria-hidden="true">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Static corner blurs */}
      <span className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/[0.03] blur-[150px] animate-pulse duration-[8000ms]" />
      <span className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/[0.03] blur-[150px]" />
      
      {/* Interactive cursor follower glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(800px circle at var(--mx, 50%) var(--my, 50%), rgba(20, 184, 166, 0.03), transparent 70%)'
        }}
      />
    </div>
  );
}
