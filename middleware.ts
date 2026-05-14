import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Get token from cookies (more secure than localStorage for server-side checks)
  const token = req.cookies.get("token")?.value;

  // If no token, redirect to home page
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If token exists, allow access
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/composeblog/:path*"], // Protect /composeblog and all sub-routes
};
