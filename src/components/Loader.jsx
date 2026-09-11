import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../utils/animations'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const nameRef = useRef(null)
  const lineRef = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(false)
      onComplete?.()
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false)
          onComplete?.()
        },
      })

      // Phase 1: Expand the accent line
      tl.to(lineRef.current, {
        width: 'clamp(80px, 20vw, 200px)',
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.3,
      })

      // Phase 2: Reveal the name
      tl.to(
        nameRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.3'
      )

      // Phase 3: Hold, then fade out
      tl.to(loaderRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        delay: 0.8,
      })
    }, loaderRef)

    // Set initial states
    gsap.set(nameRef.current, { opacity: 0, y: 20 })

    return () => ctx.revert()
  }, [onComplete])

  if (!visible) return null

  return (
    <div className="loader" ref={loaderRef} aria-hidden="true">
      <span className="loader-name" ref={nameRef}>
        Vansh Kesar
      </span>
      <div className="loader-line" ref={lineRef} />
    </div>
  )
}
