import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

const links = [
  {
    label: 'vk6092@srmist.edu.in',
    href: 'mailto:vk6092@srmist.edu.in',
    icon: '✉',
  },
  {
    label: 'github.com/vanshkesar23',
    href: 'https://github.com/vanshkesar23',
    icon: '⟶',
  },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const linkRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set([headingRef.current, subRef.current], { opacity: 1, y: 0 })
        linkRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 })
        })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      tl.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      tl.from(
        subRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6'
      )

      tl.from(
        linkRefs.current.filter(Boolean),
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.4'
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" id="contact" ref={sectionRef} aria-label="Contact">
      <div className="contact-inner">
        <p className="contact-label">Contact</p>

        <h2 className="contact-heading" ref={headingRef}>
          Let's build <em>something</em>
          <br />
          together.
        </h2>

        <p className="contact-sub" ref={subRef}>
          Got an idea or just want to say hi? I'm always open to
          conversations.
        </p>

        <div className="contact-links">
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={
                link.href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="contact-link"
              data-cursor="pointer"
              ref={(el) => (linkRefs.current[i] = el)}
            >
              <span className="link-icon" aria-hidden="true">
                {link.icon}
              </span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
