const pillars = [
  {
    num: '01',
    icon: '💻',
    iconBg: 'rgba(124,106,255,0.15)',
    title: 'Build',
    desc: 'We design, develop, and deploy your full tech stack — web app, mobile app, backend API, and admin dashboard. Production-ready in weeks, not months.',
  },
  {
    num: '02',
    icon: '🏢',
    iconBg: 'rgba(200,240,74,0.12)',
    title: 'Space',
    desc: 'Get a professional co-working setup or a dedicated office for your team. We handle the lease, fit-out, and setup so you can focus on what matters.',
  },
  {
    num: '03',
    icon: '👥',
    iconBg: 'rgba(255,106,61,0.12)',
    title: 'Team',
    desc: 'We hire and onboard the right people for your startup — developers, designers, marketers, and ops staff — all vetted and ready to execute from day one.',
  },
  {
    num: '04',
    icon: '🚀',
    iconBg: 'rgba(239,159,39,0.12)',
    title: 'Launch',
    desc: 'From go-to-market strategy to social campaigns and SEO, we make sure your product gets in front of the right audience the moment it goes live.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="container">
        <div className="section-tag">Platform</div>
        <h2>
          Four pillars.<br />
          One platform.
        </h2>
        <p className="section-intro">
          Everything a non-technical founder needs — from idea to launch — in a
          single, orchestrated system.
        </p>
        <div className="pillars">
          {pillars.map((p) => (
            <div className="pillar" key={p.num}>
              <div className="pillar-num">{p.num}</div>
              <div className="pillar-icon" style={{ background: p.iconBg }}>
                {p.icon}
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
