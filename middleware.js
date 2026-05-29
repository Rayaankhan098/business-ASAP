import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('asap_admin')?.value;
  const secret  = process.env.SESSION_SECRET;

  const authenticated = secret && session === secret;

  if (!authenticated) {
    // Protect API routes with 401
    if (request.nextUrl.pathname.startsWith('/api/submissions') ||
        request.nextUrl.pathname.startsWith('/api/deal-accept')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Redirect dashboard to login
    const url = new URL('/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/submissions/:path*', '/api/deal-accept/:path*'],
};
