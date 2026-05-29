'use client';
import { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '' });

  function showToast(msg) {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3200);
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function submitCTA() {
    if (!email || !EMAIL_RE.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }
    showToast('🎉 Booking link sent to ' + email);
    setEmail('');
  }

  return (
    <>
      <section id="cta">
        <div className="container">
          <div className="section-tag">Get started</div>
          <h2>Ready to launch?</h2>
          <p>
            Drop your email and we&apos;ll send you a discovery call link. No
            pressure, no commitment — just a real conversation about your idea.
          </p>
          <div className="intake-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitCTA()}
              placeholder="your@email.com"
            />
            <button className="btn-primary" onClick={submitCTA}>
              Book a call →
            </button>
          </div>
        </div>
      </section>

      <div className={`toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  );
}
