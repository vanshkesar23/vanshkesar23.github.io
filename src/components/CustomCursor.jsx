import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const isTouch = useRef(false)

  // Check for touch device on mount
  useEffect(() => {
    isTouch.current = window.matchMedia('(pointer: coarse)').matches
  }, [])

  const onMouseMove = useCallback((e) => {
    if (isTouch.current) return

    gsap.to(ringRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: 'power3.out',
    })

    gsap.to(dotRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: 'power2.out',
    })
  }, [])

  useEffect(() => {
    if (isTouch.current) return

    window.addEventListener('mousemove', onMouseMove)

    // Hover detection for interactive elements
    const handleMouseEnter = () => ringRef.current?.classList.add('hovering')
    const handleMouseLeave = () => ringRef.current?.classList.remove('hovering')

    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [data-cursor="pointer"]'
      )
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      })
      return interactives
    }

    // Initial setup + MutationObserver for dynamically added elements
    let interactives = addHoverListeners()

    const observer = new MutationObserver(() => {
      // Remove old listeners
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      // Re-add
      interactives = addHoverListeners()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [onMouseMove])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
