// Re-export from the Auth.js v5 configuration for compatibility
export { auth, signIn, signOut } from "../../auth";

// For backward compatibility with components using NextAuth.js patterns
export const authOptions = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
