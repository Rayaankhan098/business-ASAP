'use client';
import { useState, useEffect, useCallback } from 'react';

function EmailStatusBanner() {
  const [status, setStatus] = useState(null); // null | 'loading' | 'ok' | 'error'
  const [msg, setMsg] = useState('');
  const [hint, setHint] = useState('');

  async function test() {
    setStatus('loading');
    setMsg('');
    setHint('');
    try {
      const res = await fetch('/api/test-email');
      const data = await res.json();
      if (data.ok) {
        setStatus('ok');
        setMsg(data.message);
      } else {
        setStatus('error');
        setMsg(data.message || 'Unknown error');
        setHint(data.hint || '');
      }
    } catch (e) {
      setStatus('error');
      setMsg('Could not reach /api/test-email — is the dev server running?');
    }
  }

  const colors = {
    ok:      { bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.25)',  text: '#4ade80' },
    error:   { bg: 'rgba(255,106,61,0.08)',  border: 'rgba(255,106,61,0.25)',  text: '#ff6a3d' },
    loading: { bg: 'rgba(124,106,255,0.08)', border: 'rgba(124,106,255,0.25)', text: '#a79eff' },
  };
  const c = status ? colors[status] : null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
          Email Notifications
        </div>
        <button
          className="clear-btn"
          onClick={test}
          disabled={status === 'loading'}
          style={{ opacity: status === 'loading' ? 0.6 : 1 }}
        >
          {status === 'loading' ? 'Sending…' : '✉ Send test email'}
        </button>
      </div>

      {status && (
        <div style={{
          marginTop: '12px',
          padding: '14px 18px',
          background: c.bg,
          border: `0.5px solid ${c.border}`,
          borderRadius: '14px',
          fontSize: '13px',
        }}>
          <div style={{ color: c.text, fontWeight: 600 }}>
            {status === 'ok' && '✅ '}
            {status === 'error' && '❌ '}
            {status === 'loading' && '⏳ '}
            {msg}
          </div>
          {hint && (
            <div style={{ color: 'var(--muted)', marginTop: '6px', lineHeight: 1.6 }}>
              {hint}
            </div>
          )}
          {status === 'error' && (
            <div style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '12px' }}>
              Fix: open <code style={{ color: 'var(--accent2)', background: 'rgba(124,106,255,0.1)', padding: '1px 6px', borderRadius: '4px' }}>.env.local</code>,
              set <code style={{ color: 'var(--accent2)', background: 'rgba(124,106,255,0.1)', padding: '1px 6px', borderRadius: '4px' }}>GMAIL_APP_PASSWORD</code> to your 16-char Gmail App Password,
              then <strong style={{ color: 'var(--text)' }}>restart the dev server</strong> and try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BUDGET_LABELS = {
  '<1k': 'Under $1k',
  '1-5k': '$1k–$5k',
  '5-15k': '$5k–$15k',
  '15k+': '$15k+',
  equity: 'Equity deal',
  '': '—',
};

const MARKET_LABELS = {
  local: 'Local',
  national: 'National',
  regional: 'Regional',
  global: 'Global',
  '': '—',
};

function esc(str) {
  return String(str || '');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ScorePill({ score }) {
  const cls = score >= 75 ? 'high' : score >= 60 ? 'mid' : 'low';
  return <span className={`score-pill ${cls}`}>{score}/100</span>;
}

function StatusBadge({ sub }) {
  if (sub.dealAccepted)
    return <span className="badge badge-green">Deal Accepted</span>;
  if (sub.fastTracked)
    return <span className="badge badge-amber">Fast-tracked</span>;
  return <span className="badge badge-amber">Needs refinement</span>;
}

function ChipList({ items }) {
  if (!items?.length) return <span className="muted-text">—</span>;
  return (
    <div className="chips-list">
      {items.map((t, i) => (
        <span key={i} className="chip-tag">{t}</span>
      ))}
    </div>
  );
}

function ApifyPanel({ sub }) {
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [errMsg, setErrMsg] = useState('');

  async function search() {
    setState('loading');
    setResults([]);
    setErrMsg('');
    try {
      const res = await fetch('/api/apify-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: sub.ideaDesc, name: sub.name }),
      });
      const data = await res.json();
      if (data.ok) {
        setResults(data.results || []);
        setQuery(data.query || '');
        setState('done');
      } else {
        setErrMsg(data.message || 'Unknown error');
        setState('error');
      }
    } catch (e) {
      setErrMsg(e.message);
      setState('error');
    }
  }

  return (
    <div style={{ marginTop: '20px', borderTop: '0.5px solid var(--border)', paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '13px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.5px' }}>
          🔍 Market Research
        </div>
        <button
          className="clear-btn"
          onClick={search}
          disabled={state === 'loading'}
          style={{ opacity: state === 'loading' ? 0.6 : 1 }}
        >
          {state === 'loading' ? '⏳ Searching Apify…' : state === 'done' ? '↻ Re-search' : 'Search idea on Apify'}
        </button>
        {state === 'done' && results.length > 0 && (
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{results.length} results</span>
        )}
      </div>

      {query && (
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px', fontStyle: 'italic' }}>
          Query: {query}
        </div>
      )}

      {state === 'error' && (
        <div style={{ padding: '12px 16px', background: 'rgba(255,106,61,0.08)', border: '0.5px solid rgba(255,106,61,0.25)', borderRadius: '12px', fontSize: '13px', color: '#ff6a3d' }}>
          ❌ {errMsg}
          {errMsg.includes('TOKEN_NOT_SET') && (
            <div style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '12px' }}>
              Add your Apify token to <code style={{ color: 'var(--accent2)' }}>.env.local</code> → restart the dev server.
            </div>
          )}
        </div>
      )}

      {state === 'done' && results.length === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No results found. Try re-searching.</div>
      )}

      {state === 'done' && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {results.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', padding: '14px 16px', background: 'var(--bg)', border: '0.5px solid var(--border2)', borderRadius: '12px', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,240,74,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent2)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.url}
              </div>
              {r.description && (
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {r.description.length > 160 ? r.description.slice(0, 160) + '…' : r.description}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailRow({ sub }) {
  return (
    <tr className="detail-row">
      <td colSpan={10}>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Idea Description</label>
            <p>{esc(sub.ideaDesc)}</p>
          </div>
          <div className="detail-item">
            <label>Target Audience</label>
            <p>{esc(sub.audience) || '—'}</p>
          </div>
          <div className="detail-item">
            <label>Timeline</label>
            <p>{esc(sub.timeline) || '—'}</p>
          </div>
          <div className="detail-item">
            <label>Recommended Tier</label>
            <p>{esc(sub.tier)}</p>
          </div>
          {sub.dealAccepted && (
            <div className="detail-item">
              <label>Deal Accepted At</label>
              <p style={{ color: '#4ade80' }}>
                {new Date(sub.dealAcceptedAt).toLocaleString('en-GB')}
              </p>
            </div>
          )}
          <div className="detail-item">
            <label>Tech Needs</label>
            <ChipList items={sub.techNeeds} />
          </div>
          <div className="detail-item">
            <label>Services</label>
            <ChipList items={sub.services} />
          </div>
        </div>
        <ApifyPanel sub={sub} />
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const [subs, setSubs] = useState([]);
  const [expanded, setExpanded] = useState({});

  const load = useCallback(() => {
    try {
      setSubs(JSON.parse(localStorage.getItem('asap_submissions') || '[]'));
    } catch (_) {
      setSubs([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggleDetail(i) {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function clearAll() {
    if (!confirm('Delete all submissions? This cannot be undone.')) return;
    localStorage.removeItem('asap_submissions');
    setSubs([]);
    setExpanded({});
  }

  // Stats
  const total = subs.length;
  const dealsAccepted = subs.filter((s) => s.dealAccepted).length;
  const fastTracked = subs.filter((s) => s.fastTracked).length;
  const avgScore = total
    ? Math.round(subs.reduce((a, s) => a + (s.score || 0), 0) / total)
    : null;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = subs.filter((s) => s.submittedAt?.startsWith(today)).length;

  const statCards = [
    { label: 'Total Submissions', val: total, cls: '' },
    { label: 'Deals Accepted', val: dealsAccepted, cls: 'green' },
    { label: 'Fast-tracked', val: fastTracked, cls: 'amber' },
    {
      label: 'Avg Score',
      val: avgScore != null ? `${avgScore}/100` : '—',
      cls: avgScore != null ? (avgScore >= 75 ? 'green' : 'amber') : '',
    },
    { label: 'Today', val: todayCount, cls: '' },
  ];

  return (
    <div id="dashboard">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="header-logo">
            business-ASAP<span>.</span>
          </div>
          <div className="header-tag">Admin</div>
        </div>
        <div className="header-right">
          <button className="clear-btn" onClick={load}>
            ↻ Refresh
          </button>
          <a href="/" className="clear-btn" style={{ textDecoration: 'none' }}>
            ← Site
          </a>
        </div>
      </header>

      <div className="dash-main">
        {/* Email status */}
        <EmailStatusBanner />

        {/* Stat cards */}
        <div className="stats-row">
          {statCards.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-card-label">{s.label}</div>
              <div className={`stat-card-val ${s.cls}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="section-head">
          <div className="section-title">Client Submissions</div>
          <button className="clear-btn danger" onClick={clearAll}>
            Clear all data
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Startup</th>
                <th>Idea</th>
                <th>Email</th>
                <th>Industry</th>
                <th>Budget</th>
                <th>Market</th>
                <th>Score</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="empty-state">
                      <strong>No submissions yet.</strong>
                      <p>Completed wizard reports will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subs.map((s, i) => (
                  <>
                    <tr key={`row-${i}`}>
                      <td>
                        <button
                          className="expand-btn"
                          onClick={() => toggleDetail(i)}
                          title="Toggle details"
                        >
                          {expanded[i] ? '−' : '+'}
                        </button>
                      </td>
                      <td>
                        <div className="name-cell">{esc(s.name)}</div>
                      </td>
                      <td className="idea-cell">
                        {s.ideaDesc && s.ideaDesc !== '—'
                          ? s.ideaDesc.length > 90
                            ? s.ideaDesc.slice(0, 90) + '…'
                            : s.ideaDesc
                          : <span className="muted-text">—</span>}
                      </td>
                      <td>
                        <div className="email-cell">{esc(s.email)}</div>
                      </td>
                      <td>
                        <span className="muted-text">
                          {Array.isArray(s.industry)
                            ? s.industry.join(', ') || '—'
                            : esc(s.industry) || '—'}
                        </span>
                      </td>
                      <td>
                        <span className="muted-text">
                          {BUDGET_LABELS[s.budget] || s.budget || '—'}
                        </span>
                      </td>
                      <td>
                        <span className="muted-text">
                          {MARKET_LABELS[s.marketSize] || s.marketSize || '—'}
                        </span>
                      </td>
                      <td>
                        <ScorePill score={s.score || 0} />
                      </td>
                      <td>
                        <StatusBadge sub={s} />
                      </td>
                      <td>
                        <span className="muted-text">{formatDate(s.submittedAt)}</span>
                        <br />
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          {formatTime(s.submittedAt)}
                        </span>
                      </td>
                    </tr>
                    {expanded[i] && <DetailRow key={`detail-${i}`} sub={s} />}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
