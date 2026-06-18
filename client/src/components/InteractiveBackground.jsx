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
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-50/50" ref={ref} aria-hidden="true">
      {/* Light Mesh Gradient blobs with float animations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-200/25 blur-[120px] animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-200/25 blur-[130px] animate-float" />
      <div className="absolute top-[30%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-emerald-100/20 blur-[100px] animate-float" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #0d9488 1px, transparent 1px),
            linear-gradient(to bottom, #0d9488 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />
      
      {/* Dynamic Cursor Glowing Spot */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(20, 184, 166, 0.08), transparent 70%)'
        }}
      />
    </div>
  );
}
