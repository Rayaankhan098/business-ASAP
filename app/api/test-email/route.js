import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function GET() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass || pass === 'your-app-password-here') {
    return Response.json({
      ok: false,
      reason: 'ENV_NOT_SET',
      message: 'GMAIL_USER or GMAIL_APP_PASSWORD is missing or still placeholder in .env.local',
      GMAIL_USER: user || '(missing)',
      GMAIL_APP_PASSWORD: pass ? (pass === 'your-app-password-here' ? '(still placeholder)' : '(set ✓)') : '(missing)',
    }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    // Verify the connection first
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: `business-ASAP <${user}>`,
      to: user,
      subject: '✅ business-ASAP — Email connection working!',
      html: `
        <div style="background:#0a0a0f;padding:40px;font-family:Arial,sans-serif;color:#f0efe8;">
          <h2 style="color:#c8f04a;font-size:24px;margin:0 0 16px;">✅ Email is connected!</h2>
          <p style="color:#888880;font-size:15px;">Your business-ASAP dashboard is now wired up to send you an email every time a founder completes the wizard.</p>
          <p style="color:#888880;font-size:13px;margin-top:24px;">Sent from: ${user}</p>
        </div>
      `,
    });

    return Response.json({ ok: true, message: `Test email sent to ${user}` });
  } catch (err) {
    return Response.json({
      ok: false,
      reason: 'SEND_FAILED',
      message: err.message,
      hint: err.message.includes('Invalid login') || err.message.includes('Username and Password')
        ? 'Invalid credentials. Make sure you used a Gmail App Password (not your regular password). Go to myaccount.google.com → Security → App passwords.'
        : err.message.includes('Less secure')
        ? 'Enable 2-Step Verification on your Google account first, then generate an App Password.'
        : 'Check your .env.local values and restart the dev server.',
    }, { status: 500 });
  }
}
