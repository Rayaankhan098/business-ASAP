'use client';
import { useEffect, useRef } from 'react';

const PHASES = [
  {
    num: '1',
    phase: 'Phase 1 — Right Now',
    title: 'Launch the Platform (Website & App)',
    desc: 'The entire operation starts with a single digital product. No office needed — just a website and a mobile app that lets founders submit their idea, their requirements, and their budget in minutes.',
    tasks: [
      'Build and launch the intake website (you are looking at it)',
      'Develop the companion mobile app for idea submission on the go',
      'Allow clients to tell us their idea — or let us suggest one for them',
      'Capture requirements: website, app, office space, team size, and investment range',
    ],
  },
  {
    num: '2',
    phase: 'Phase 2 — Early Growth',
    title: 'Build the Network & Take First Clients',
    desc: "The platform only works if we have the right people behind it. We build our supplier and talent network before we make promises we can't keep.",
    tasks: [
      'Form partnerships with freelance developers, designers, and legal advisors',
      'Connect with co-working and office space providers for client setups',
      'Onboard first 3–5 paying clients and deliver end-to-end — web, app, and operations',
      'Collect testimonials and refine the intake process based on real feedback',
    ],
  },
  {
    num: '3',
    phase: 'Phase 3 — Reputation & Scale',
    title: 'Become the Go-To Name for Non-Technical Founders',
    desc: 'At this stage, word of mouth and a track record of successful launches is our biggest sales tool. Every business we build makes the next client easier to close.',
    tasks: [
      'Showcase live client businesses as proof of concept on the platform',
      'Run targeted social campaigns aimed at aspiring founders with ideas but no tech background',
      'Establish a referral system — clients who refer new founders earn benefits',
      'Grow a skilled in-house team across tech, design, business development, and operations',
    ],
  },
  {
    num: '4',
    phase: 'Phase 4 — Physical Presence',
    title: 'Open the Business-ASAP Office',
    desc: 'Once revenue is stable and the team is proven, we open a physical headquarters — a space where founders can walk in with an idea and walk out with a business plan, a signed agreement, and a launch date.',
    tasks: [
      'Lease a professional office space that doubles as a client consultation hub',
      'Host in-person founder workshops and idea validation sessions',
      'Staff the office with full-time business analysts, developers, and growth strategists',
      'Expand to multiple cities — one office per major market',
    ],
  },
];

export default function Roadmap() {
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay || 0);
            setTimeout(() => e.target.classList.add('visible'), delay);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="roadmap">
      <div className="container">
        <div className="section-tag">Execution Plan</div>
        <h2>
          From one idea to<br />
          a business-building machine.
        </h2>
        <p className="section-intro">
          We started exactly where our clients start — with an idea, no office,
          and zero upfront capital. Here is how we built business-ASAP from the
          ground up, and how we will do the same for you.
        </p>

        <div className="timeline">
          {PHASES.map((phase, i) => (
            <div
              key={i}
              className="tl-item"
              data-delay={i * 100}
              ref={(el) => (itemRefs.current[i] = el)}
            >
              <div className="tl-dot">{phase.num}</div>
              <div className="tl-phase">{phase.phase}</div>
              <div className="tl-title">{phase.title}</div>
              <div className="tl-desc">{phase.desc}</div>
              <div className="tl-tasks">
                {phase.tasks.map((task, j) => (
                  <div key={j} className="tl-task">
                    {task}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
