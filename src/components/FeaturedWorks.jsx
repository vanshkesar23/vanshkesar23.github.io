import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 'fixmywallet',
    number: '01',
    name: 'FixMyWallet',
    desc: 'A financial-management platform that helps users understand, track, and take control of their transactions and money — built to make personal finance feel simple and clear.',
    tags: ['Python', 'Web App', 'Finance'],
    github: 'https://github.com/vanshkesar23/FIXMYWALLET',
    icon: '💳',
    className: 'project-fixmywallet',
  },
  {
    id: 'fitprint',
    number: '02',
    name: 'Fitprint',
    desc: 'An AI-powered fashion platform that delivers personalized style recommendations and experiences — using machine learning to understand individual preferences.',
    tags: ['AI / ML', 'Python', 'Fashion Tech'],
    github: 'https://github.com/vanshkesar23/Fitprint',
    icon: '👗',
    className: 'project-fitprint',
  },
]

export default function FeaturedWorks() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const projectRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(headingRef.current, { opacity: 1, y: 0 })
        projectRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 })
        })
        return
      }

      // Heading reveal
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // Each project card reveals
      projectRefs.current.forEach((el) => {
        if (!el) return

        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className="featured"
      id="work"
      ref={sectionRef}
      aria-label="Featured work"
    >
      <h2 className="featured-heading" ref={headingRef}>
        Featured <em>Works</em>
      </h2>

      {projects.map((project, i) => (
        <article
          className={`featured-project ${project.className}`}
          key={project.id}
          ref={(el) => (projectRefs.current[i] = el)}
        >
          {/* Visual area */}
          <div className="featured-visual">
            <div className="featured-visual-bg">
              <span className="project-icon" aria-hidden="true">
                {project.icon}
              </span>
            </div>
            <div className="featured-visual-glow" aria-hidden="true" />
          </div>

          {/* Info */}
          <div className="featured-info">
            <span className="featured-number">{project.number}</span>
            <h3 className="featured-name">{project.name}</h3>
            <p className="featured-desc">{project.desc}</p>

            <div className="featured-tags">
              {project.tags.map((tag) => (
                <span className="featured-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-link"
              data-cursor="pointer"
              aria-label={`View ${project.name} on GitHub`}
            >
              View on GitHub{' '}
              <span className="link-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </article>
      ))}
    </section>
  )
}
