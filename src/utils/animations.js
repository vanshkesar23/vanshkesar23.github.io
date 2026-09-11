import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Check if user prefers reduced motion */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reveal elements by sliding up from below with fade
 * Used for text lines, cards, etc.
 */
export const createTextReveal = (elements, trigger, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0, clipPath: 'none' })
    return null
  }

  return gsap.from(elements, {
    y: options.y || 60,
    opacity: 0,
    duration: options.duration || 1,
    stagger: options.stagger || 0.12,
    ease: options.ease || 'power3.out',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 80%',
      toggleActions: 'play none none none',
    },
  })
}

/**
 * Parallax an element on scroll (scrub-based)
 */
export const createParallax = (element, trigger, speed = 100) => {
  if (prefersReducedMotion()) return null

  return gsap.to(element, {
    y: speed,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/**
 * Simple fade-in with optional Y offset
 */
export const createFadeIn = (element, trigger, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 })
    return null
  }

  return gsap.from(element, {
    opacity: 0,
    y: options.y || 40,
    duration: options.duration || 1,
    delay: options.delay || 0,
    ease: 'power3.out',
    scrollTrigger: trigger
      ? {
          trigger,
          start: options.start || 'top 80%',
          toggleActions: 'play none none none',
        }
      : undefined,
  })
}

/**
 * Scale reveal from smaller size
 */
export const createScaleReveal = (element, trigger, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { scale: 1, opacity: 1 })
    return null
  }

  return gsap.from(element, {
    scale: options.scale || 0.85,
    opacity: 0,
    duration: options.duration || 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 80%',
      toggleActions: 'play none none none',
    },
  })
}

/**
 * Horizontal line expand animation
 */
export const createLineExpand = (element, trigger, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { scaleX: 1 })
    return null
  }

  gsap.set(element, { scaleX: 0, transformOrigin: 'left center' })

  return gsap.to(element, {
    scaleX: 1,
    duration: options.duration || 1.2,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 80%',
      toggleActions: 'play none none none',
    },
  })
}
