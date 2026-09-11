export default function Navbar({ visible }) {
  const scrollToContact = (e) => {
    e.preventDefault()
    const contact = document.getElementById('contact')
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`navbar${visible ? ' visible' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar-left">
        <span>Menu</span>
      </div>

      <div className="navbar-center">
        <span>Vansh Kesar</span>
      </div>

      <div className="navbar-right">
        <a
          href="#contact"
          onClick={scrollToContact}
          data-cursor="pointer"
          aria-label="Scroll to contact section"
        >
          Let&apos;s chat <span className="arrow">→</span>
        </a>
      </div>
    </nav>
  )
}
