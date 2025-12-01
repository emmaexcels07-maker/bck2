import { NextResponse } from "next/server";


export function middleware(request) {
const token = request.cookies.get("token")?.value || null;
const protectedRoutes = ["/home"];


if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
return NextResponse.redirect(new URL("/signin", request.url));
}


return NextResponse.next();
}


export const config = {
matcher: ["/home"],
};