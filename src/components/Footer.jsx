export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <span className="footer-name">Vansh Kesar</span>

        <div className="footer-links">
          <a
            href="https://github.com/vanshkesar23"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            data-cursor="pointer"
          >
            GitHub
          </a>
          <a
            href="mailto:vk6092@srmist.edu.in"
            className="footer-link"
            data-cursor="pointer"
          >
            Email
          </a>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Vansh Kesar. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
