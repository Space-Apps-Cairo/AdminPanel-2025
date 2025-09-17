import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleAccessMap: Record<string, string[]> = {
  "/admin": ["admin"],
  "/editor": ["admin", "editor"],
  "/reports": ["admin", "viewer"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  for (const [route, allowedRoles] of Object.entries(roleAccessMap)) {
    if (pathname.startsWith(route)) {
      if (!role || !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  // if (token && pathname !== "/login") {
  //   try {
  //     const authCheckResponse = await fetch(
  //       `https://staging.spaceappscairo.com/api/v1/isTokenExpired`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     if (!authCheckResponse.ok) {
  //       const res = NextResponse.redirect(new URL("/login", request.url));
  //       res.cookies.delete("token");
  //       return res;
  //     }
  //     console.log("the token is valid");
  //   } catch (error) {
  //     console.error("Auth check failed:", error);
  //     const res = NextResponse.redirect(new URL("/login", request.url));
  //     res.cookies.delete("token");
  //     return res;
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images).*)"],
};
