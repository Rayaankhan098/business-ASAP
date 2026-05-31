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

// ── Tech stack recommendations (keyed by tech-need chip value) ──
const STACK_MAP = {
  web:      { layer: 'Frontend',  tech: 'Next.js + React',              reason: 'Fast, SEO-ready, scales from MVP to enterprise' },
  mobile:   { layer: 'Mobile',    tech: 'React Native (Expo)',           reason: 'One codebase → iOS & Android, fastest path to market' },
  api:      { layer: 'Backend',   tech: 'Node.js + Express',             reason: 'Battle-tested, huge ecosystem, easy to deploy anywhere' },
  admin:    { layer: 'Database',  tech: 'PostgreSQL + Prisma',           reason: 'Reliable relational DB — ideal for dashboards & reporting' },
  payments: { layer: 'Payments',  tech: 'Stripe + JazzCash / EasyPaisa', reason: 'International + local Pakistani payment coverage in one integration' },
  ai:       { layer: 'AI / LLM',  tech: 'Claude API + OpenAI GPT-4o',   reason: 'State-of-the-art reasoning, tool use, and sub-second latency' },
};
const HOSTING_STACK = {
  layer: 'Hosting', tech: 'Vercel + Railway', reason: 'Zero-config deploys, generous free tiers, auto-scales',
};
const DEFAULT_STACK = [
  { layer: 'Frontend', tech: 'Next.js + React',    reason: 'Best starting point for any modern web product' },
  { layer: 'Backend',  tech: 'Node.js + Supabase', reason: 'Auth, storage & real-time DB in one — no DevOps overhead' },
];

// ── Competitor landscape by industry ──
const COMPETITOR_MAP = {
  HealthTech:   [
    { name: 'Marham',       note: 'Doctor-booking & teleconsult platform' },
    { name: 'Sehat Kahani', note: 'Telemedicine for women & children' },
    { name: 'DoctHERS',     note: 'Female healthcare network' },
  ],
  EdTech:       [
    { name: 'Sabaq',   note: 'Video lessons K–12, curriculum-aligned' },
    { name: 'Maqsad',  note: 'Competitive exam prep (MDCAT, CSS)' },
    { name: 'Edvon',   note: 'Skills & coding bootcamps' },
  ],
  FinTech:      [
    { name: 'NayaPay', note: 'Digital wallet & card issuer' },
    { name: 'Sadapay', note: 'Neobank targeting freelancers' },
    { name: 'Finja',   note: 'SME lending, payroll & BNPL' },
  ],
  'E-commerce': [
    { name: 'Daraz',        note: 'Marketplace giant (Alibaba-backed)' },
    { name: 'iShopping.pk', note: 'Electronics & lifestyle retail' },
    { name: 'Yayvo',        note: 'Multi-category online store' },
  ],
  Logistics:    [
    { name: 'Bykea',  note: 'Bike delivery & ride-hailing' },
    { name: 'PostEx', note: 'COD logistics for e-commerce sellers' },
    { name: 'TCS',    note: 'Legacy courier pivoting digital-first' },
  ],
  SaaS:         [
    { name: 'Contour', note: 'HR SaaS built for Pakistan market' },
    { name: 'ZenHR',   note: 'HRMS for MENA & South Asia' },
    { name: 'Vyapar',  note: 'SME accounting & invoicing (India/PK)' },
  ],
  Social:       [
    { name: 'TikTok',       note: 'Short-form video — dominant in PK' },
    { name: 'Instagram',    note: 'Visual social (global reach)' },
    { name: 'Snack Video',  note: 'Fast-growing local short-video rival' },
  ],
  Other:        [
    { name: 'Local incumbents', note: 'Search your niche on Google.pk to find them' },
    { name: 'Regional players', note: 'South Asian markets often have untapped gaps' },
  ],
};

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
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef(null);

  function toggleMulti(arr, setArr, val) {
    setArr((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  function goStep(n) {
    // Validate current step before advancing
    if (n > step) {
      const errs = {};
      if (step === 1) {
        if (!startupName.trim()) errs.startupName = 'Please enter a startup name.';
        if (!ideaDesc.trim()) errs.ideaDesc = 'Please describe your idea.';
      }
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    setErrors({});
    setStep(n);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  function runAnalysis() {
    setGenerating(true);

    // ── Base score ────────────────────────────────────────────────────────
    let score = 58;
    const warnings = [];

    // Budget contribution
    if (budget === '5-15k') score += 12;
    else if (budget === '15k+') score += 18;
    else if (budget === 'equity') score += 8;
    else if (budget === '1-5k') score += 4;

    // Market size contribution
    if (mktSize === 'national') score += 8;
    else if (mktSize === 'regional') score += 12;
    else if (mktSize === 'global') score += 16;

    // Scope signals
    if (techNeeds.length >= 2) score += 5;
    if (industry.length > 0) score += 3;

    // ── Budget vs. complexity mismatch detection ──────────────────────────
    const FEATURE_LABELS = { mobile: 'Mobile App', ai: 'AI/LLM Features', payments: 'Payment Integration' };
    const expensiveFeatures = techNeeds.filter((t) => ['mobile', 'ai', 'payments'].includes(t));

    if (budget === '<1k') {
      if (expensiveFeatures.length > 0) {
        const names = expensiveFeatures.map((f) => FEATURE_LABELS[f]).join(' + ');
        warnings.push(
          `Your budget ($<1k) does not match your technical requirements. ${names} typically require $5k–$15k minimum. Start with a web-only MVP and add these in Phase 2.`
        );
        score -= 10;
      } else if (techNeeds.length >= 3) {
        warnings.push(
          `Your budget ($<1k) is tight for ${techNeeds.length} deliverables. Focus on your top 2 features for the MVP — that's how you maximise runway.`
        );
        score -= 6;
      }
      if (services.length >= 2) {
        warnings.push(
          `Multiple add-on services (marketing, design, legal) are hard to fund at $<1k. We can absorb these costs, but expect a phased launch scope.`
        );
      }
    } else if (budget === '1-5k') {
      if (techNeeds.includes('mobile') && techNeeds.includes('ai')) {
        warnings.push(
          `Mobile App + AI/LLM together typically cost $8k–$20k+. At $1k–$5k, we recommend a web app with AI first — mobile can ship in Phase 2.`
        );
        score -= 5;
      } else if (techNeeds.length >= 4) {
        warnings.push(
          `${techNeeds.length} tech deliverables at $1k–$5k leaves thin margins. We'll scope the MVP to your top 2–3 features and phase the rest post-launch.`
        );
        score -= 3;
      }
    }

    score = Math.min(Math.max(score, 28), 97);
    const fastTracked = score >= 75;

    // ── Tier ──────────────────────────────────────────────────────────────
    let tier = 'Tier 1 — The Blueprint';
    if (budget === 'equity') tier = 'Tier 4 — Co-Founder Circle';
    else if (budget === '15k+') tier = 'Tier 3 — Scale Engine';
    else if (budget === '5-15k') tier = 'Tier 2 — The Launchpad';

    // ── Tech stack ────────────────────────────────────────────────────────
    const stack = techNeeds.length
      ? [...techNeeds.map((t) => STACK_MAP[t]).filter(Boolean), HOSTING_STACK]
      : [...DEFAULT_STACK, HOSTING_STACK];

    // ── Competitors ───────────────────────────────────────────────────────
    const primaryIndustry = industry[0] || 'Other';
    const competitors = COMPETITOR_MAP[primaryIndustry] || COMPETITOR_MAP['Other'];

    // ── Market / tech labels ──────────────────────────────────────────────
    const mktLabels = { local: 'Moderate', national: 'Strong', regional: 'Very Strong', global: 'Exceptional', '': 'Moderate' };
    const techBadge = techNeeds.length <= 2 ? 'green' : techNeeds.length <= 4 ? 'amber' : 'purple';
    const techLabel = techNeeds.length <= 2 ? 'Low complexity' : techNeeds.length <= 4 ? 'Medium' : 'High';

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
      warnings,
      stack,
      competitors,
      primaryIndustry,
      message: fastTracked
        ? `"${name}" scored ${score}/100 and is eligible for fast-tracking. Our engineering team can have a scoped proposal ready within 48 hours of your discovery call.`
        : warnings.length > 0
        ? `"${name}" shows real potential, but has budget/scope conflicts flagged above. Address these before your call — or let us help you re-scope at zero cost.`
        : `"${name}" shows strong potential. We recommend starting with ${tier} to sharpen your market positioning and technical scope before scaling up.`,
    };

    setResult(newResult);
    setScoreFill(0);
    setGenerating(false);
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
    setErrors({});
    setGenerating(false);
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
                    onChange={(e) => { setStartupName(e.target.value); setErrors((p) => ({ ...p, startupName: '' })); }}
                    placeholder="e.g. QuickMed, DeliverPK, EduBot…"
                    style={errors.startupName ? { borderColor: 'rgba(255,106,61,0.6)' } : {}}
                  />
                  {errors.startupName && <div className="field-error">{errors.startupName}</div>}
                </div>
                <div className="form-group">
                  <label>Describe your idea in 2–3 sentences</label>
                  <textarea
                    value={ideaDesc}
                    onChange={(e) => { setIdeaDesc(e.target.value); setErrors((p) => ({ ...p, ideaDesc: '' })); }}
                    placeholder="What problem does it solve? Who are your customers? What makes it different?"
                    style={errors.ideaDesc ? { borderColor: 'rgba(255,106,61,0.6)' } : {}}
                  />
                  {errors.ideaDesc && <div className="field-error">{errors.ideaDesc}</div>}
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
                  <button
                    className="btn-primary"
                    onClick={runAnalysis}
                    disabled={generating}
                    style={generating ? { opacity: 0.65, cursor: 'not-allowed' } : {}}
                  >
                    {generating ? '⏳ Generating report…' : 'Generate Report →'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 4: Result ── */}
            {step === 4 && result && (
              <div>
                <h3>Your Viability Report</h3>
                <p>
                  Report generated for{' '}
                  <strong style={{ color: 'var(--text)' }}>{result.name}</strong>.
                </p>

                {/* Score bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Overall viability score</span>
                    <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '18px', color: 'var(--accent)' }}>
                      {result.score} / 100
                    </span>
                  </div>
                  <div className="score-bar">
                    {/* overlay shrinks from right, revealing gradient = score colour */}
                    <div className="score-bar-fill" style={{ width: `${100 - scoreFill}%` }} />
                  </div>
                  <div className="score-label">
                    <span>Not viable</span>
                    <span>Fast-tracked ✓</span>
                  </div>
                </div>

                {/* Budget/scope warnings */}
                {result.warnings.length > 0 && (
                  <div style={{ marginBottom: '16px', padding: '14px 16px', background: 'rgba(239,159,39,0.08)', border: '0.5px solid rgba(239,159,39,0.35)', borderRadius: 'var(--r)' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '13px', fontWeight: 700, color: '#ef9f27', marginBottom: '8px' }}>
                      ⚠ Budget &amp; Scope Alerts
                    </div>
                    {result.warnings.map((w, i) => (
                      <div key={i} style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65, paddingTop: i > 0 ? '6px' : 0 }}>
                        • {w}
                      </div>
                    ))}
                  </div>
                )}

                {/* Assessment breakdown */}
                <div className="result-box">
                  <h4>Assessment breakdown</h4>
                  <div className="result-row">
                    <span>Market Opportunity</span>
                    <span><Badge type={result.marketBadge}>{result.market}</Badge></span>
                  </div>
                  <div className="result-row">
                    <span>Technical Complexity</span>
                    <span><Badge type={result.techBadge}>{result.tech}</Badge></span>
                  </div>
                  <div className="result-row">
                    <span>Competitive Landscape</span>
                    <span><Badge type="amber">{result.primaryIndustry}</Badge></span>
                  </div>
                  <div className="result-row">
                    <span>Recommended Tier</span>
                    <span>{result.tier}</span>
                  </div>
                  <div className="result-row">
                    <span>Status</span>
                    <span>
                      {result.fastTracked
                        ? <Badge type="green">✓ Fast-tracked</Badge>
                        : <Badge type="amber">Needs refinement</Badge>}
                    </span>
                  </div>
                </div>

                {/* Suggested tech stack */}
                <div className="result-box" style={{ marginTop: '16px' }}>
                  <h4>🛠 Suggested Tech Stack</h4>
                  {result.stack.map((s, i) => (
                    <div key={i} className="result-row" style={{ alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ minWidth: '82px', flexShrink: 0, paddingTop: '2px' }}>{s.layer}</span>
                      <div style={{ textAlign: 'right', flex: 1 }}>
                        <div style={{ color: 'var(--accent2)', fontWeight: 600, fontSize: '13px' }}>{s.tech}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '2px', lineHeight: 1.4 }}>{s.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Competitor snapshot */}
                <div className="result-box" style={{ marginTop: '16px' }}>
                  <h4>🏆 Competitor Snapshot — {result.primaryIndustry}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', marginTop: '-8px' }}>
                    Know who you&apos;re up against before you build.
                  </p>
                  {result.competitors.map((c, i) => (
                    <div key={i} className="result-row">
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'right', maxWidth: '55%' }}>{c.note}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation message */}
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(200,240,74,0.08)', border: '0.5px solid rgba(200,240,74,0.2)', borderRadius: 'var(--r)', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
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
