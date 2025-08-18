import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // If user is not logged in and tries to access a protected page
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and tries to access login page, redirect to home
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  // Run for every path except Next.js internals and static assets
  matcher: [
    /*
          Match all requests except:
            - URLs starting with /_next/
            - /favicon.ico
        */
    "/((?!_next|favicon.ico|images).*)",
  ],
};
