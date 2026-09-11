import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef(null)
  const glowRef = useRef(null)
  const contentRef = useRef(null)
  const headingRef = useRef(null)
  const subtitleRef = useRef(null)

  // Mouse-following glow effect
  const onMouseMove = useCallback((e) => {
    if (!glowRef.current || prefersReducedMotion()) return

    const { clientX, clientY } = e
    gsap.to(glowRef.current, {
      x: clientX - window.innerWidth / 2,
      y: clientY - window.innerHeight / 2,
      duration: 1.2,
      ease: 'power2.out',
    })
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    window.addEventListener('mousemove', onMouseMove)

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return

      // Entrance animation for heading
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 2.8, // After loader finishes
      })

      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 3.2,
      })

      // Parallax on scroll — push content up faster
      gsap.to(contentRef.current, {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, section)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      ctx.revert()
    }
  }, [onMouseMove])

  return (
    <section className="hero" ref={sectionRef} aria-label="Hero">
      {/* Mouse-following radial glow */}
      <div className="hero-glow" ref={glowRef} aria-hidden="true" />

      {/* Organic blob shapes */}
      <div className="hero-blob" aria-hidden="true" />
      <div className="hero-blob-2" aria-hidden="true" />

      {/* Content */}
      <div className="hero-content" ref={contentRef}>
        <h1 className="hero-heading" ref={headingRef}>
          Vansh <em>Kesar</em>
        </h1>
        <p className="hero-subtitle" ref={subtitleRef}>
          Student · Builder · AI Explorer
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-text">Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}
