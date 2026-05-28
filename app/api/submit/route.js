import nodemailer from 'nodemailer';
import { redis, KV_AVAILABLE } from '@/lib/redis';

export const runtime = 'nodejs';

const BUDGET_LABELS = {
  '<1k': 'Under $1k',
  '1-5k': '$1k – $5k',
  '5-15k': '$5k – $15k',
  '15k+': '$15k+',
  equity: 'Equity deal',
};

const MARKET_LABELS = {
  local: 'Local / City-level',
  national: 'National (Pakistan)',
  regional: 'Regional (South Asia)',
  global: 'Global',
};

function buildEmailHtml(d) {
  const scoreColor = d.score >= 75 ? '#c8f04a' : '#fbbf24';
  const statusLabel = d.fastTracked ? '✓ Fast-tracked' : 'Needs refinement';
  const statusColor = d.fastTracked ? '#c8f04a' : '#fbbf24';

  const chip = (t) =>
    `<span style="display:inline-block;background:#18181f;border:0.5px solid rgba(255,255,255,0.14);border-radius:50px;padding:3px 10px;font-size:12px;color:#888880;margin:2px;">${t}</span>`;

  const row = (label, val) => `
    <tr>
      <td style="padding:10px 0;border-bottom:0.5px solid rgba(255,255,255,0.08);color:#888880;font-size:13px;width:40%;">${label}</td>
      <td style="padding:10px 0;border-bottom:0.5px solid rgba(255,255,255,0.08);color:#f0efe8;font-size:13px;font-weight:500;">${val || '—'}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
      <span style="font-size:18px;font-weight:800;color:#f0efe8;">business-ASAP<span style="color:#c8f04a;">.</span></span>
      <span style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#888880;margin-left:8px;">New Submission</span>
    </div>

    <!-- Score banner -->
    <div style="background:linear-gradient(160deg,rgba(200,240,74,0.08) 0%,#111118 60%);border:0.5px solid rgba(200,240,74,0.2);border-radius:20px;padding:28px 24px;margin-bottom:24px;text-align:center;">
      <div style="font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#888880;margin-bottom:8px;">Viability Score</div>
      <div style="font-size:56px;font-weight:800;letter-spacing:-2px;color:${scoreColor};line-height:1;">${d.score} <span style="font-size:24px;color:#888880;">/ 100</span></div>
      <div style="margin-top:8px;">
        <span style="display:inline-block;background:rgba(200,240,74,0.12);border:0.5px solid rgba(200,240,74,0.25);border-radius:50px;padding:4px 16px;font-size:12px;font-weight:700;color:${statusColor};">${statusLabel}</span>
      </div>
    </div>

    <!-- Founder info -->
    <div style="background:#111118;border:0.5px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888880;margin-bottom:16px;">Founder</div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Startup Name', `<strong style="font-size:15px;">${d.name}</strong>`)}
        ${row('Email', d.email !== '—' ? `<a href="mailto:${d.email}" style="color:#7c6aff;text-decoration:none;">${d.email}</a>` : '—')}
        ${row('Industry', Array.isArray(d.industry) ? d.industry.join(', ') : d.industry)}
        ${row('Idea', `<span style="line-height:1.6;">${d.ideaDesc}</span>`)}
      </table>
    </div>

    <!-- Market info -->
    <div style="background:#111118;border:0.5px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888880;margin-bottom:16px;">Market & Investment</div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Target Audience', d.audience)}
        ${row('Market Size', MARKET_LABELS[d.marketSize] || d.marketSize)}
        ${row('Budget', BUDGET_LABELS[d.budget] || d.budget)}
        ${row('Timeline', d.timeline)}
      </table>
    </div>

    <!-- Needs -->
    <div style="background:#111118;border:0.5px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888880;margin-bottom:16px;">What They Need</div>
      <div style="margin-bottom:12px;">
        <div style="font-size:12px;color:#888880;margin-bottom:6px;">Tech</div>
        <div>${(d.techNeeds || []).map(chip).join('') || '<span style="color:#888880;font-size:13px;">—</span>'}</div>
      </div>
      <div>
        <div style="font-size:12px;color:#888880;margin-bottom:6px;">Services</div>
        <div>${(d.services || []).map(chip).join('') || '<span style="color:#888880;font-size:13px;">—</span>'}</div>
      </div>
    </div>

    <!-- Report -->
    <div style="background:#111118;border:0.5px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888880;margin-bottom:16px;">Report</div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Recommended Tier', d.tier)}
        ${row('Submitted', new Date(d.submittedAt).toLocaleString('en-GB'))}
      </table>
    </div>

    ${d.email && d.email !== '—' ? `
    <!-- Reply CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="mailto:${d.email}?subject=Re: Your business-ASAP application — ${d.name}&body=Hi,%0D%0A%0D%0AThank you for submitting your idea to business-ASAP. We've reviewed your viability report and would love to set up a call.%0D%0A%0D%0ABest,%0D%0Abusiness-ASAP Team"
         style="display:inline-block;background:#c8f04a;color:#0a0a0f;font-weight:700;font-size:15px;padding:14px 36px;border-radius:50px;text-decoration:none;">
        Reply to ${d.name} →
      </a>
    </div>` : ''}

    <!-- Footer -->
    <div style="border-top:0.5px solid rgba(255,255,255,0.08);padding-top:20px;text-align:center;">
      <p style="font-size:12px;color:#888880;margin:0;">business-ASAP Admin Dashboard · This email was sent automatically when a founder submitted the wizard.</p>
    </div>

  </div>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const data = await request.json();

    // ── 1. Save to Upstash Redis (KV) ──────────────────────────────────
    let kvSaved = false;
    if (KV_AVAILABLE) {
      try {
        const id = data.id || Date.now();
        const submission = { ...data, id };
        await redis.set(`submission:${id}`, submission);
        await redis.lpush('submission_ids', String(id));
        kvSaved = true;
      } catch (kvErr) {
        console.error('[submit] KV save error:', kvErr.message);
      }
    }

    // ── 2. Send email notification ──────────────────────────────────────
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass || pass === 'your-app-password-here') {
      console.warn('[submit] Email env vars not set — skipping email send.');
      return Response.json({ ok: true, email: false, kvSaved });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const clientEmail = data.email && data.email !== '—' ? data.email : null;

    await transporter.sendMail({
      from: `business-ASAP <${user}>`,
      to: user,
      replyTo: clientEmail || user,
      subject: `New submission: ${data.name || 'Unknown'} — ${data.score}/100 ${data.fastTracked ? '✓ Fast-tracked' : ''}`,
      html: buildEmailHtml(data),
    });

    return Response.json({ ok: true, email: true, kvSaved });
  } catch (err) {
    console.error('[submit] Error:', err.message);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
