export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow"></div>
      <div>
        <div className="hero-badge">Now onboarding founders</div>
        <h1>
          Launch your<br />
          <em>tech startup</em><br />
          in 30 days.
        </h1>
        <p className="hero-sub">
          Code, office space, and team — all handled. business-ASAP turns your
          idea into a live business without the chaos.
        </p>
        <div className="hero-actions">
          <a href="#wizard" className="btn-primary">Validate my idea →</a>
          <a href="#how" className="btn-ghost">See how it works</a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">3<span>wk</span></div>
            <div className="stat-label">Average MVP delivery</div>
          </div>
          <div className="stat">
            <div className="stat-num">60<span>%</span></div>
            <div className="stat-label">Cost reduction vs agencies</div>
          </div>
          <div className="stat">
            <div className="stat-num">4</div>
            <div className="stat-label">Services, one platform</div>
          </div>
        </div>
      </div>
    </section>
  );
}
