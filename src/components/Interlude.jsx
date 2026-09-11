import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

export default function Interlude() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return

      // Parallax text movement
      gsap.from(textRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      // Slow parallax drift on scrub
      gsap.to(textRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className="interlude"
      ref={sectionRef}
      aria-hidden="true"
    >
      {/* Organic background blob */}
      <div className="interlude-blob" aria-hidden="true" />

      {/* Large typographic moment */}
      <span className="interlude-text" ref={textRef}>
        Create.
      </span>
    </section>
  )
}
