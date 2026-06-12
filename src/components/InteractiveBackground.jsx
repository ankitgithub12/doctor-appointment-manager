import { useEffect, useRef } from 'react'

// A fixed, full-viewport animated background that reacts to the cursor.
export default function InteractiveBackground() {
  const ref = useRef(null)

  useEffect(() => {
    let raf = 0
    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (el) {
          el.style.setProperty('--mx', `${(e.clientX / window.innerWidth) * 100}%`)
          el.style.setProperty('--my', `${(e.clientY / window.innerHeight) * 100}%`)
        }
        raf = 0
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="bg-fx" ref={ref} aria-hidden="true">
      <span className="bg-grid" />
      <span className="bg-blob bg-blob-1" />
      <span className="bg-blob bg-blob-2" />
      <span className="bg-blob bg-blob-3" />
      <span className="bg-glow" />
    </div>
  )
}
