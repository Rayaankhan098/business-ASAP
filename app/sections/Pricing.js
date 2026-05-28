'use client';
import { useState } from 'react';

const OBJECTIONS = [
  {
    emoji: '💸',
    title: '"Agencies charge $20k–$80k just to build the app."',
    text: 'With us you pay $0 upfront. That cash stays in your pocket to grow the business — not pay invoices. 25% of a thriving company is worth far more than saving a one-time agency fee.',
  },
  {
    emoji: '🤝',
    title: '"We\'re aligned — not just hired."',
    text: 'A freelancer gets paid whether you succeed or fail. We only win if you win. That means we\'re motivated to push your business forward with everything we have — not just deliver and disappear.',
  },
  {
    emoji: '🏗️',
    title: '"We build everything — not just the app."',
    text: 'Tech, office, team, legal, marketing — it all costs money. We absorb those costs so you can focus on growth. The 25% covers an entire team of professionals working full-time on your business.',
  },
  {
    emoji: '📈',
    title: '"75% of something beats 100% of nothing."',
    text: "Most founders never launch because they can't afford to. We remove every barrier. You keep 75% of a real, running, revenue-generating business — fully built, fully staffed, fully live.",
  },
  {
    emoji: '🔒',
    title: '"You stay in control."',
    text: "You hold the majority stake and the decision-making power. We're your silent operating partner — handling execution while you steer the vision. No board takeovers, no loss of direction.",
  },
  {
    emoji: '⚡',
    title: '"Most startups die before launch."',
    text: "90% of ideas never make it off the ground — not because they're bad, but because the founder ran out of money or momentum. We eliminate both problems on day one.",
  },
];

export default function Pricing({ score, fastTracked }) {
  const [dealAccepted, setDealAccepted] = useState(false);

  function acceptDeal() {
    try {
      const subs = JSON.parse(localStorage.getItem('asap_submissions') || '[]');
      if (subs.length) {
        subs[0].dealAccepted = true;
        subs[0].dealAcceptedAt = new Date().toISOString();
        localStorage.setItem('asap_submissions', JSON.stringify(subs));
      } else {
        const record = {
          id: Date.now(),
          submittedAt: new Date().toISOString(),
          dealAccepted: true,
          dealAcceptedAt: new Date().toISOString(),
          name: '(Direct deal — no wizard)',
          email: '—',
          score: 0,
          tier: '—',
          fastTracked: false,
        };
        localStorage.setItem('asap_submissions', JSON.stringify([record]));
      }
    } catch (_) {}
    setDealAccepted(true);
  }

  return (
    <section id="pricing">
      <div className="container">
        <div className="section-tag">Our Deal</div>
        <h2>
          No upfront cost.<br />
          We get your business<br />
          up and running.
        </h2>
        <p className="section-intro">
          We don&apos;t charge you a single dollar. We take 25% of your company,
          roll up our sleeves, and turn your idea into a fully operational
          business — from zero to live.
        </p>

        {/* Deal CTA / Confirmation */}
        {!dealAccepted ? (
          <div
            style={{
              marginTop: '56px',
              textAlign: 'center',
              padding: '48px 32px',
              background:
                'linear-gradient(160deg, rgba(200,240,74,0.06) 0%, var(--bg) 60%)',
              border: '0.5px solid rgba(200,240,74,0.2)',
              borderRadius: 'var(--r2)',
            }}
          >
            {score != null && (
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '6px',
                  }}
                >
                  Your viability score
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: '56px',
                    fontWeight: 800,
                    letterSpacing: '-2px',
                    color: fastTracked ? 'var(--accent)' : 'var(--amber)',
                    lineHeight: 1,
                  }}
                >
                  {score} / 100
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--muted)',
                    marginTop: '4px',
                  }}
                >
                  {fastTracked
                    ? '✓ Your idea is fast-track eligible'
                    : "Shows potential — let's build on it"}
                </div>
              </div>
            )}
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--text)',
                marginBottom: '10px',
              }}
            >
              Ready to move forward?
            </div>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--muted)',
                maxWidth: '440px',
                margin: '0 auto 28px',
              }}
            >
              If you&apos;re in, hit the button below. We&apos;ll receive your
              submission instantly and reach out within 24 hours to kick things
              off.
            </p>
            <button
              className="btn-primary"
              style={{ fontSize: '17px', padding: '16px 48px' }}
              onClick={acceptDeal}
            >
              Accept the Deal →
            </button>
          </div>
        ) : (
          <div
            style={{
              marginTop: '56px',
              textAlign: 'center',
              padding: '48px 32px',
              background: 'rgba(74,222,128,0.06)',
              border: '0.5px solid rgba(74,222,128,0.25)',
              borderRadius: 'var(--r2)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: '24px',
                fontWeight: 800,
                color: '#4ade80',
                marginBottom: '10px',
              }}
            >
              Deal accepted!
            </div>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--muted)',
                maxWidth: '440px',
                margin: '0 auto',
              }}
            >
              We&apos;ve received your agreement. Our team will contact you
              within 24 hours. Welcome to business-ASAP.
            </p>
          </div>
        )}

        {/* Objection handling */}
        <div style={{ marginTop: '64px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '36px',
              fontWeight: 800,
              textAlign: 'center',
              color: 'var(--text)',
              marginBottom: '10px',
            }}
          >
            Why 25% is a great deal for you
          </h2>
          <h3
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '22px',
              fontWeight: 700,
              textAlign: 'center',
              color: 'var(--muted)',
              marginBottom: '12px',
            }}
          >
            Think of it this way.
          </h3>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: '15px',
              maxWidth: '540px',
              margin: '0 auto 48px',
            }}
          >
            A business that doesn&apos;t exist is worth 0%. We turn your idea
            into a real, running company — and you still own 75% of it.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {OBJECTIONS.map((obj, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg3)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--r2)',
                  padding: '28px 24px',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '12px' }}>
                  {obj.emoji}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '8px',
                  }}
                >
                  {obj.title}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  {obj.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
