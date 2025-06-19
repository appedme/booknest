"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";
import type { User } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();

  const login = useCallback(async (provider: string = "google") => {
    try {
      // In development, simulate successful login
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Simulating login');
        return Promise.resolve();
      }
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // In development, simulate successful logout
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Simulating logout');
        return Promise.resolve();
      }
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  // For development, simulate authenticated user if session fails
  const devUser: User = {
    id: 'dev-user-123',
    name: 'Development User',
    email: 'dev@booknest.com',
    image: 'https://via.placeholder.com/150'
  };

  const isDev = process.env.NODE_ENV === 'development';
  const user = session?.user as User | undefined || (isDev ? devUser : undefined);
  const isAuthenticated = !!session?.user || isDev;

  return {
    user,
    isAuthenticated,
    isLoading: status === "loading" && !isDev,
    login,
    logout,
    session,
  };
}
