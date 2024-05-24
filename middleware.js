import { NextResponse } from 'next/server'
import {auth} from "@/auth";

  export default auth((req) => {
    const isLoggedIn = req.auth?.user;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

    if (isOnDashboard) {
        if (isLoggedIn) return;
        return NextResponse.redirect(new URL('/login', req.url))
    }
    if (req.nextUrl.pathname.startsWith("/login") ) {
        if (isLoggedIn){
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }
})
// See "Matching Paths" below to learn more

// export const middleware = auth;
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)" , '/dashboard/:path*'],
}