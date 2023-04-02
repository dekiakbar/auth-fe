import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { User,Account,Profile } from "next-auth";
import { CredentialInput } from "next-auth/providers";

type signInType = {
    user: User,
    account: Account
    profile?: Profile
    email?: {
        verificationRequest?: boolean;
    },
    credentials?: Record<string, CredentialInput>;
}

export const authOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_SECRET ?? ''
        })
    ],
    pages:{
        signIn: '/auth/signIn'
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }:signInType) {
            const url = process.env.API_URL + "/auth/signIn";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: user,
                    account: account,
                    profile: profile,
                    email: email,
                    credentials: credentials
                }),
            });
            
            const body = await response.json();
            if (response.ok) {
                const mergedUser = {...user, ...body};
                account.access_token = body.accessToken;
                account.roles = body.roles;

                return mergedUser;
            }
            
            return false;
        },
        async jwt({ token, account, profile }) {
            if (account) {
              token.access_token = account.access_token
              token.roles = account.roles
            }
            return token
        },
        async session({ session, token, user }) {
            session.access_token = token.access_token
            session.roles = token.roles
            
            return session
        }
    },
}

export default NextAuth(authOptions)