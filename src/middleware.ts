

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // If user is not logged in and tries to access a protected page
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && pathname !== "/login") {
    try {
      const authCheckResponse = await fetch(
        `https://staging.spaceappscairo.com/api/v1/isTokenExpired`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!authCheckResponse.ok) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("token");
        return res;
      }

      
      const res = NextResponse.next();
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      console.log("the token is valid and refreshed (no expiry)");
      return res;
    } catch (error) {
      console.error("Auth check failed:", error);
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run for every path except Next.js internals and static assets
  matcher: [
    "/((?!_next|favicon.ico|images).*)",
  ],
};
