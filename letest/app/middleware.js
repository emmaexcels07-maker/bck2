import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    // Allow signin/signup without token
    if (pathname === "/signin" || pathname === "/signup") {
        return NextResponse.next();
    }

    // Require token for protected routes
    if (!token) {
        return NextResponse.redirect(
            new URL("/signin", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/checkout/:path*"],
};
