import React, { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="fixed bottom-6 right-24 w-14 h-14 bg-slate-900/80 backdrop-blur border border-slate-800 text-slate-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-black/20 hover:scale-105 active:scale-95 transition-all duration-200 z-40 hover:text-teal-400 focus:outline-none"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  );
}
