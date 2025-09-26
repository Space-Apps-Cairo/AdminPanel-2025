import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based route permissions
const getRoutePermissions = () => {
  return {
    Admin: [
      "/",
      "/test",
      "/dashboard",
      "/qr/qr-bootcamp/scan",
      "/qr/qr-bootcamp/manual-attending",
      "/qr/qr-hackathon/scan",
      "/qr/qr-hackathon/manual-attending",
      "/qr/qr-hackathon/special-cases",
      "/materials",
      "/materials/volunteers",
      "/materials/materials",
      "/materials/collections",
      "/bootcamp",
      "/bootcamp/dashboard",
      "/bootcamp/bootcamps",
      "/bootcamp/workshops",
      "/bootcamp/participants",
      "/email-templates",
      "/bootcamp/registerationDetails",
      "/bootcamp/registerationDetails/skills",
      "/bootcamp/registerationDetails/education-levels",
      "/bootcamp/registerationDetails/field-of-study",
      "/bootcamp/registerationDetails/nationality",
      "/bootcamp/registerationDetails/team-status",
      "/bootcamp/registerationDetails/participation-status",
      "/forms",
      "/form-builder",
      "/hackathon",
      "/hackathon/dashboard",
      "/hackathon/teams",
      "/hackathon/teams/All",
      "/hackathon/teams/onsite",
      "/hackathon/teams/virtual",
      "/hackathon/members",
      "/hackathon/members/all-members",
      "/hackathon/members/onsite",
      "/hackathon/members/virtual",
      "/hackathon/formDetails",
      "/hackathon",
      "/hackathon/form-options",
      "/hackathon/form-options/tshirt-size",
      "/hackathon/form-options/study-levels",
      "/hackathon/form-options/participationMethod",
      "/hackathon/form-options/mentorship",
      "/hackathon/form-options/memberRole",
      "/hackathon/form-options/actualSolutions",
      "/hackathon/form-options/study-levels",
      "/email-templates",
    ],

    material: [
      "/",
      "/dashboard",
      "/qr-code",
      "/qr-code/scan",
      "/materials",
      "/materials/volunteers",
      "/materials/materials",
      "/materials/collections",
    ],

    logistics: [
      "/",
      "/dashboard",
      "/qr-code",
      "/qr-code/scan",
      "/qr-hackathon",
      "/qr-hackathon/scan",
      "/qr-hackathon/manual-attending",
      "/qr-hackathon/special-cases",
      "/bootcamp",
      "/bootcamp/dashboard",
      "/bootcamp/bootcamps",
      "/bootcamp/workshops",
      "/bootcamp/participants",
      "/email-templates",
      "/bootcamp/registerationDetails",
      "/bootcamp/registerationDetails/skills",
      "/bootcamp/registerationDetails/education-levels",
      "/bootcamp/registerationDetails/field-of-study",
      "/bootcamp/registerationDetails/nationality",
      "/bootcamp/registerationDetails/team-status",
      "/bootcamp/registerationDetails/participation-status",
      "/hackathon",
      "/hackathon/teams",
      "/hackathon/formDetails",
      "/hackathon",
      "/hackathon/form-options",
      "/hackathon/form-options/tshirt-size",
      "/hackathon/form-options/study-levels",
      "/hackathon/form-options/memberRole",
      "/hackathon/form-options/actualSolutions",
    ],

    registeration: [
      "/",
      "/dashboard",
      "/qr-code",
      "/qr-code/scan",
      "/qr-hackathon",
      "/qr-hackathon/scan",
      "/qr-hackathon/manual-attending",
      "/qr-hackathon/special-cases",
      "/bootcamp",
      "/bootcamp/dashboard",
      "/bootcamp/bootcamps",
      "/bootcamp/workshops",
      "/bootcamp/participants",
      "/email-templates",
      "/bootcamp/registerationDetails",
      "/bootcamp/registerationDetails/skills",
      "/bootcamp/registerationDetails/education-levels",
      "/bootcamp/registerationDetails/field-of-study",
      "/bootcamp/registerationDetails/nationality",
      "/bootcamp/registerationDetails/team-status",
      "/bootcamp/registerationDetails/participation-status",
      "/hackathon",
      "/hackathon/teams",
      "/hackathon/formDetails",
    ],
    filteration: ["/", "/hackathon", "/hackathon/teams"],
  };
};

// Function to check if user has access to a route
const hasRouteAccess = (pathname: string, userRole: string): boolean => {
  const permissions = getRoutePermissions();
  const allowedRoutes = permissions[userRole as keyof typeof permissions] || [];

  // Check exact match or if pathname starts with any allowed route
  return allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // Allow login page for everyone
  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check token validity
  // if (token) {
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
  //       res.cookies.delete("role");
  //       res.cookies.delete("user");
  //       return res;
  //     }

  //     console.log("Token is valid");
  //   } catch (error) {
  //     console.error("Auth check failed:", error);
  //     console.log(
  //       "Network error during auth check, allowing request to continue"
  //     );
  //   }
  // }

  // Role-based route protection
  if (role && pathname !== "/login") {
    const hasAccess = hasRouteAccess(pathname, role);

    if (!hasAccess) {
      // Redirect to dashboard if user doesn't have access to the requested route
      console.log(`Access denied for role: ${role} to route: ${pathname}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
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
            - API routes
        */
    "/((?!_next|favicon.ico|images|api).*)",
  ],
};
