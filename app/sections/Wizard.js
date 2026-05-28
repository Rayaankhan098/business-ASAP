'use client';
import { useState, useRef } from 'react';

const INDUSTRY_CHIPS = [
  { label: 'HealthTech', val: 'HealthTech' },
  { label: 'EdTech', val: 'EdTech' },
  { label: 'FinTech', val: 'FinTech' },
  { label: 'E-commerce', val: 'E-commerce' },
  { label: 'Logistics', val: 'Logistics' },
  { label: 'SaaS', val: 'SaaS' },
  { label: 'Social', val: 'Social' },
  { label: 'Other', val: 'Other' },
];

const BUDGET_CHIPS = [
  { label: 'Under $1k', val: '<1k' },
  { label: '$1k – $5k', val: '1-5k' },
  { label: '$5k – $15k', val: '5-15k' },
  { label: '$15k+', val: '15k+' },
  { label: 'Equity deal', val: 'equity' },
];

const TECH_CHIPS = [
  { label: 'Web App / Website', val: 'web' },
  { label: 'Mobile App', val: 'mobile' },
  { label: 'Backend / API', val: 'api' },
  { label: 'Admin Dashboard', val: 'admin' },
  { label: 'Payment Integration', val: 'payments' },
  { label: 'AI / LLM Features', val: 'ai' },
];

const SERVICES_CHIPS = [
  { label: 'Co-working Space', val: 'office' },
  { label: 'Growth Marketing', val: 'marketing' },
  { label: 'UI/UX Design', val: 'design' },
  { label: 'Legal / Compliance', val: 'legal' },
  { label: 'Project Manager', val: 'pm' },
];

const WIZARD_STEPS = [
  { num: 1, title: 'About your idea', desc: 'Name, description & industry' },
  { num: 2, title: 'Market & investment', desc: 'Audience, budget & timeline' },
  { num: 3, title: 'What you need', desc: 'Tech & services needed' },
  { num: 4, title: 'Your report', desc: 'AI viability analysis' },
];

function Chip({ label, selected, onClick }) {
  return (
    <div className={`chip${selected ? ' selected' : ''}`} onClick={onClick}>
      {label}
    </div>
  );
}

function Badge({ type, children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

export default function Wizard({ onAnalysisComplete }) {
  const [step, setStep] = useState(1);
  const [startupName, setStartupName] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [industry, setIndustry] = useState([]);
  const [audience, setAudience] = useState('');
  const [mktSize, setMktSize] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [techNeeds, setTechNeeds] = useState([]);
  const [services, setServices] = useState([]);
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [scoreFill, setScoreFill] = useState(0);
  const cardRef = useRef(null);

  function toggleMulti(arr, setArr, val) {
    setArr((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  function goStep(n) {
    setStep(n);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  function runAnalysis() {
    let score = 58;
    if (budget === '5-15k') score += 12;
    else if (budget === '15k+') score += 18;
    else if (budget === 'equity') score += 8;
    else if (budget === '1-5k') score += 4;

    if (mktSize === 'national') score += 8;
    else if (mktSize === 'regional') score += 12;
    else if (mktSize === 'global') score += 16;

    if (techNeeds.length >= 2) score += 5;
    if (industry.length > 0) score += 3;
    score = Math.min(score, 97);

    const fastTracked = score >= 75;

    let tier = 'Tier 1 — The Blueprint';
    if (budget === 'equity') tier = 'Tier 4 — Co-Founder Circle';
    else if (budget === '15k+') tier = 'Tier 3 — Scale Engine';
    else if (budget === '5-15k') tier = 'Tier 2 — The Launchpad';

    const mktLabels = {
      local: 'Moderate',
      national: 'Strong',
      regional: 'Very Strong',
      global: 'Exceptional',
      '': 'Moderate',
    };
    const techBadge =
      techNeeds.length <= 2 ? 'green' : techNeeds.length <= 4 ? 'amber' : 'purple';
    const techLabel =
      techNeeds.length <= 2 ? 'Low complexity' : techNeeds.length <= 4 ? 'Medium' : 'High';

    const name = startupName || 'Your Startup';
    const newResult = {
      score,
      fastTracked,
      tier,
      name,
      market: mktLabels[mktSize] || 'Moderate',
      marketBadge: score >= 75 ? 'green' : 'amber',
      tech: techLabel,
      techBadge,
      message: fastTracked
        ? `Great news! "${name}" has scored ${score}/100 and is eligible for fast-tracking to our engineering team. Book a scoping call and we'll have a proposal ready within 48 hours.`
        : `"${name}" shows real potential but needs some refinement before fast-tracking. We recommend starting with The Blueprint tier to sharpen your market positioning and technical scope.`,
    };

    setResult(newResult);
    setScoreFill(0);
    setStep(4);
    setTimeout(() => setScoreFill(score), 250);

    try {
      const submission = {
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        name: startupName,
        email: email || '—',
        ideaDesc: ideaDesc || '—',
        industry,
        audience,
        marketSize: mktSize,
        budget,
        timeline,
        techNeeds,
        services,
        score,
        tier,
        fastTracked,
      };
      const existing = JSON.parse(localStorage.getItem('asap_submissions') || '[]');
      existing.unshift(submission);
      localStorage.setItem('asap_submissions', JSON.stringify(existing));

      // Fire-and-forget — send email notification to admin
      fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      }).catch(() => {});
    } catch (_) {}

    if (onAnalysisComplete) onAnalysisComplete(score, fastTracked);
  }

  function resetWizard() {
    setStep(1);
    setResult(null);
    setScoreFill(0);
    setStartupName('');
    setIdeaDesc('');
    setIndustry([]);
    setAudience('');
    setMktSize('');
    setBudget('');
    setTimeline('');
    setTechNeeds([]);
    setServices([]);
    setEmail('');
  }

  return (
    <section id="wizard">
      <div className="container">
        <div className="section-tag">Validate Your Idea</div>
        <h2>
          Get your free<br />
          viability report.
        </h2>
        <p className="section-intro">
          Answer three quick steps and our system will assess your idea&apos;s
          market potential, technical scope, and recommended path.
        </p>

        <div className="wizard-wrap">
          {/* Left: Step indicators */}
          <div>
            <div className="wizard-steps">
              {WIZARD_STEPS.map((s) => (
                <div
                  key={s.num}
                  className={`wstep${step >= s.num ? ' active' : ''}`}
                  onClick={() => s.num < step && goStep(s.num)}
                >
                  <div className="wstep-dot">{s.num}</div>
                  <div className="wstep-text">
                    <strong>{s.title}</strong>
                    <span>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form card */}
          <div className="wizard-card" ref={cardRef}>
            {/* ── Step 1 ── */}
            {step === 1 && (
              <div>
                <h3>Tell us about your idea</h3>
                <p>
                  A brief description is all we need to get started. Be specific
                  about the problem you&apos;re solving.
                </p>
                <div className="form-group">
                  <label>Startup name (or working title)</label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="e.g. QuickMed, DeliverPK, EduBot…"
                  />
                </div>
                <div className="form-group">
                  <label>Describe your idea in 2–3 sentences</label>
                  <textarea
                    value={ideaDesc}
                    onChange={(e) => setIdeaDesc(e.target.value)}
                    placeholder="What problem does it solve? Who are your customers? What makes it different?"
                  />
                </div>
                <div className="form-group">
                  <label>Industry / Category</label>
                  <div className="chip-group">
                    {INDUSTRY_CHIPS.map((c) => (
                      <Chip
                        key={c.val}
                        label={c.label}
                        selected={industry.includes(c.val)}
                        onClick={() => toggleMulti(industry, setIndustry, c.val)}
                      />
                    ))}
                  </div>
                </div>
                <div className="wizard-nav">
                  <button className="btn-primary" onClick={() => goStep(2)}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div>
                <h3>Market &amp; investment</h3>
                <p>
                  Help us understand your target market and how much you&apos;re
                  ready to invest in getting to launch.
                </p>
                <div className="form-group">
                  <label>Target audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Small business owners in Lahore aged 25–45"
                  />
                </div>
                <div className="form-group">
                  <label>Estimated market size</label>
                  <select
                    value={mktSize}
                    onChange={(e) => setMktSize(e.target.value)}
                  >
                    <option value="">Select range…</option>
                    <option value="local">Local / City-level</option>
                    <option value="national">National (Pakistan)</option>
                    <option value="regional">Regional (South Asia)</option>
                    <option value="global">Global</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Investment capacity</label>
                  <div className="chip-group">
                    {BUDGET_CHIPS.map((c) => (
                      <Chip
                        key={c.val}
                        label={c.label}
                        selected={budget === c.val}
                        onClick={() =>
                          setBudget((prev) => (prev === c.val ? '' : c.val))
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Launch timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  >
                    <option value="">Select timeline…</option>
                    <option value="asap">ASAP (1–4 weeks)</option>
                    <option value="1-3m">1–3 months</option>
                    <option value="3-6m">3–6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className="wizard-nav">
                  <button className="btn-ghost" onClick={() => goStep(1)}>
                    ← Back
                  </button>
                  <button className="btn-primary" onClick={() => goStep(3)}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div>
                <h3>What do you need?</h3>
                <p>
                  Select everything you&apos;d like business-ASAP to handle.
                  We&apos;ll scope this into a recommended tier.
                </p>
                <div className="form-group">
                  <label>Tech deliverables needed</label>
                  <div className="chip-group">
                    {TECH_CHIPS.map((c) => (
                      <Chip
                        key={c.val}
                        label={c.label}
                        selected={techNeeds.includes(c.val)}
                        onClick={() =>
                          toggleMulti(techNeeds, setTechNeeds, c.val)
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional services</label>
                  <div className="chip-group">
                    {SERVICES_CHIPS.map((c) => (
                      <Chip
                        key={c.val}
                        label={c.label}
                        selected={services.includes(c.val)}
                        onClick={() =>
                          toggleMulti(services, setServices, c.val)
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your email (for the report)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@example.com"
                  />
                </div>
                <div className="wizard-nav">
                  <button className="btn-ghost" onClick={() => goStep(2)}>
                    ← Back
                  </button>
                  <button className="btn-primary" onClick={runAnalysis}>
                    Generate Report →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 4: Result ── */}
            {step === 4 && result && (
              <div>
                <h3>Your Viability Report</h3>
                <p>AI analysis complete. Here&apos;s your startup assessment.</p>

                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
                      Overall viability score
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontWeight: 800,
                        fontSize: '18px',
                        color: 'var(--accent)',
                      }}
                    >
                      {result.score} / 100
                    </span>
                  </div>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${scoreFill}%` }}
                    />
                  </div>
                  <div className="score-label">
                    <span>Not viable</span>
                    <span>Fast-tracked ✓</span>
                  </div>
                </div>

                <div className="result-box">
                  <h4>Assessment breakdown</h4>
                  <div className="result-row">
                    <span>Market Opportunity</span>
                    <span>
                      <Badge type={result.marketBadge}>{result.market}</Badge>
                    </span>
                  </div>
                  <div className="result-row">
                    <span>Technical Complexity</span>
                    <span>
                      <Badge type={result.techBadge}>{result.tech}</Badge>
                    </span>
                  </div>
                  <div className="result-row">
                    <span>Competitive Landscape</span>
                    <span>
                      <Badge type="amber">Moderate market</Badge>
                    </span>
                  </div>
                  <div className="result-row">
                    <span>Recommended Tier</span>
                    <span>{result.tier}</span>
                  </div>
                  <div className="result-row">
                    <span>Status</span>
                    <span>
                      {result.fastTracked ? (
                        <Badge type="green">✓ Fast-tracked</Badge>
                      ) : (
                        <Badge type="amber">Needs refinement</Badge>
                      )}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'rgba(200,240,74,0.08)',
                    border: '0.5px solid rgba(200,240,74,0.2)',
                    borderRadius: 'var(--r)',
                    fontSize: '14px',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {result.message}
                </div>

                <div className="wizard-nav" style={{ marginTop: '20px' }}>
                  <a href="#pricing" className="btn-primary">
                    See pricing plans →
                  </a>
                  <button className="btn-ghost" onClick={resetWizard}>
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
