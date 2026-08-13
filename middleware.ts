import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && process.env.NODE_ENV === 'production') {
    const hasSessionCookie = request.cookies.getAll().some(
      (c) => c.name.includes('sb-') && c.name.includes('auth')
    );
    if (!hasSessionCookie) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*'],
};
