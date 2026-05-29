'use client';
import { useState, useEffect } from 'react';

const LINKS = [
  { href: '#how',     label: 'How it works' },
  { href: '#wizard',  label: 'Validate idea' },
  { href: '#pricing', label: 'Our Deal' },
  { href: '#roadmap', label: 'Roadmap' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function close() { setOpen(false); }

  return (
    <>
      <nav>
        <a href="#" className="nav-logo" onClick={close}>
          business-ASAP<span>.</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="#cta" className="nav-cta">Get started</a>
          </li>
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          className={`nav-hamburger${open ? ' is-open' : ''}`}
          onClick={() => setOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="mobile-nav-overlay" onClick={close}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <ul className="mobile-nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={close}>{l.label}</a>
                </li>
              ))}
              <li style={{ paddingTop: '8px' }}>
                <a href="#cta" className="btn-primary" onClick={close}
                   style={{ display: 'block', textAlign: 'center' }}>
                  Get started
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
