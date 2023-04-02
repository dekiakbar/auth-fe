import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
import { RoleEnum } from "./components/web/header/main";

export default withAuth(
  function middleware(request) {
    const {nextauth, nextUrl, url } = request;

    /**
     * Validate if user is logged in
     */
    if (
        nextUrl.pathname.startsWith("/user") &&
        !nextauth.token?.roles?.includes(RoleEnum.USER)
    ) {
        return NextResponse.redirect(new URL("/", url));
    }

    /**
     * Validate logged in user, and check has admin role
     */
    if (
        nextUrl.pathname.startsWith("/admin") &&
        !nextauth.token?.roles?.includes(RoleEnum.ADMIN)
    ) {
        return NextResponse.redirect(new URL("/", url));
    }    
  }
)

export const config = { 
    matcher: [
        "/user/:path*",
        "/admin/:path*"
    ]
}