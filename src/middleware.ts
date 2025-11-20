
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/tasks', '/audit-log', '/profile'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('firebase-auth-token');
  const { pathname } = req.nextUrl;

  if (!token && protectedRoutes.some(p => pathname.startsWith(p))) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/tasks', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
