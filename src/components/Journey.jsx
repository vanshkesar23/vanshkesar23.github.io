import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

const roles = [
  {
    icon: '⚡',
    title: 'Builder',
    desc: 'Turning ideas into working products — from concept to code.',
  },
  {
    icon: '🧠',
    title: 'AI Explorer',
    desc: 'Experimenting with machine learning and intelligent applications.',
  },
  {
    icon: '✦',
    title: 'Designer',
    desc: 'Crafting user experiences that feel intentional and alive.',
  },
]

export default function Journey() {
  const sectionRef = useRef(null)
  const roleRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        roleRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 })
        })
        return
      }

      roleRefs.current.forEach((el, i) => {
        if (!el) return

        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="journey" aria-label="Journey and roles">
      <div className="journey-inner" ref={sectionRef}>
        <p className="journey-label">The Journey</p>

        <div className="journey-roles">
          {roles.map((role, i) => (
            <div
              className="journey-role"
              key={role.title}
              ref={(el) => (roleRefs.current[i] = el)}
              data-cursor="pointer"
            >
              <div className="journey-role-icon" aria-hidden="true">
                {role.icon}
              </div>
              <h3 className="journey-role-title">{role.title}</h3>
              <p className="journey-role-desc">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
