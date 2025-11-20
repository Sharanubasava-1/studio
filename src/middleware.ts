
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/tasks', '/audit-log', '/profile'];
const publicRoutes = ['/login', '/signup'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('firebase-auth-token');
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));

  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  
  if (token && publicRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/tasks', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
