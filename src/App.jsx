import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Journey from './components/Journey'
import FeaturedWorks from './components/FeaturedWorks'
import Interlude from './components/Interlude'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loading, setLoading] = useState(true)
  const lenisRef = useRef(null)
  const contentRef = useRef(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  // Handle loader completion
  const handleLoaderComplete = useCallback(() => {
    setLoading(false)

    // Reveal main content
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.classList.add('revealed')
      }
      // Refresh ScrollTrigger after content is revealed
      ScrollTrigger.refresh()
    })
  }, [])

  return (
    <>
      {/* Accessibility: skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Intro loader */}
      <Loader onComplete={handleLoaderComplete} />

      {/* Navbar */}
      <Navbar visible={!loading} />

      {/* Main content wrapper */}
      <div
        className={`app-content${!loading ? ' revealed' : ''}`}
        ref={contentRef}
      >
        <main id="main-content">
          <Hero />
          <About />
          <Journey />
          <FeaturedWorks />
          <Interlude />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  )
}
