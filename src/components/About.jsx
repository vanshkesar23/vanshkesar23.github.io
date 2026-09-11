import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

const lines = [
  { text: "I'm a Computer Intelligence student", em: false },
  { text: 'at SRM Institute of Science & Technology,', em: false },
  { text: 'passionate about building real products', em: true },
  { text: 'with AI, code, and design \u2014', em: false },
  { text: 'turning curiosity into things that work.', em: true },
]

export default function About() {
  const sectionRef = useRef(null)
  const lineRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        lineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: 0, opacity: 1 })
        })
        return
      }

      lineRefs.current.forEach((el, i) => {
        if (!el) return

        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="about" aria-label="About me">
      <div className="about-inner">
        <div className="about-label">
          <span>About</span>
        </div>

        <p className="about-text">
          {lines.map((line, i) => (
            <span className="about-line" key={i}>
              <span
                className="about-line-inner"
                ref={(el) => (lineRefs.current[i] = el)}
                style={{ display: 'inline', transform: 'none', opacity: 1 }}
              >
                {line.em ? <em>{line.text}</em> : line.text}{' '}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
