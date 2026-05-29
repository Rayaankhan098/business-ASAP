export const runtime = 'nodejs';

export async function POST(request) {
  const { password } = await request.json();

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    return Response.json({ ok: false, message: 'Auth not configured on server.' }, { status: 500 });
  }

  if (password !== adminPassword) {
    return Response.json({ ok: false, message: 'Incorrect password.' }, { status: 401 });
  }

  // Set session cookie — HttpOnly, Secure in prod, 7-day expiry
  const isProd = process.env.NODE_ENV === 'production';
  const response = Response.json({ ok: true });
  response.headers.set(
    'Set-Cookie',
    `asap_admin=${sessionSecret}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${isProd ? '; Secure' : ''}`
  );
  return response;
}

export async function DELETE() {
  const response = Response.json({ ok: true });
  response.headers.set('Set-Cookie', 'asap_admin=; Path=/; HttpOnly; Max-Age=0');
  return response;
}
