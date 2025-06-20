import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { getDBSync } from "@/lib/db"

// Get database instance for auth adapter
const authDB = getDBSync();

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Only use DrizzleAdapter if database is available, otherwise fallback to JWT
  ...(authDB ? { adapter: DrizzleAdapter(authDB) } : {}),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
  },
  events: {
    signIn({ user }) {
      console.log("User signed in:", user.email)
    },
    createUser({ user }) {
      console.log("New user created:", user.email)
    },
  },
})
