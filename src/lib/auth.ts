import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDB } from "@/lib/db";
import { AUTH_PROVIDERS, SESSION_CONFIG } from "@/constants/auth";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(getDB()),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: SESSION_CONFIG.MAX_AGE,
    updateAge: SESSION_CONFIG.UPDATE_AGE,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log("User signed in:", user.email);
    },
    async createUser({ user }) {
      console.log("New user created:", user.email);
    },
  },
};
