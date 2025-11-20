import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is no longer needed as we are using Firebase Authentication.
// You can remove this file if you no longer need it.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
