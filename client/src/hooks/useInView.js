import { useEffect, useRef, useState } from 'react'

// Returns a ref + whether the element has entered the viewport (once).
export function useInView({ threshold = 0.25, once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Respect reduced-motion / no-IO environments: show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) obs.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once])

  return [ref, inView]
}
