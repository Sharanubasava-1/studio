// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const USER = "admin";
const PASS = "password123";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const base64 = authHeader.split(" ")[1];
    // Edge runtime supports atob()
    const decoded = atob(base64);
    const [user, pass] = decoded.split(":");

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse(
    JSON.stringify({
      error: "Unauthorized access. Please provide valid credentials.",
    }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        'WWW-Authenticate': 'Basic realm="TaskManager"',
      },
    }
  );
}

// ✅ Protect only /api routes
export const config = {
  matcher: ["/api/:path*"],
};
