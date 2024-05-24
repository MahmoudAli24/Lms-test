import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from "axios";

export const {signIn, signOut, auth, handlers: {GET, POST}} = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const {username, password} = credentials;
                const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/userauth`, {username, password});
                const user = response.data;
                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        async session({session, token}) {
            if (token) {
                session.user = token.user
            }
            return session;
        },
        async jwt({token, user}) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async authorized({auth, request}) {
            const isLoggedIn = auth?.user;
            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            // console.log("auth", auth)
            // console.log("isLoggedIn", isLoggedIn)

            const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
            if (isOnDashboard) {
                if (isLoggedIn) return;
                return {
                    status: 302,
                    redirect: "/login"
                }
            }
            if (request.nextUrl.pathname.startsWith("/login")) {
                if (isLoggedIn) {
                    return {
                        status: 302,
                        redirect: "/dashboard"
                    }
                }
            }
        }
    },
    pages: {
        signIn: '/login',
    },
    // secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    // trustHost: true,
    secret: process.env.AUTH_SECRET,
    jwt: {
        secret: process.env.JWT_SECRET,
    },
});