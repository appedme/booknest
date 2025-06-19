"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";
import type { User } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();

  const login = useCallback(async (provider: string = "google") => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  const user = session?.user as User | undefined;
  const isAuthenticated = !!session?.user;

  return {
    user,
    isAuthenticated,
    isLoading: status === "loading",
    login,
    logout,
    session,
  };
}
