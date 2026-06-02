import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get("token");

  const isLoginPage =
    request.nextUrl.pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/children/:path*",
  ],
};