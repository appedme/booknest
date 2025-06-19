import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export function getDB() {
  try {
    const { env } = getCloudflareContext();
    return drizzle(env.DB, { schema });
  } catch (error) {
    // In development, create a mock database or handle gracefully
    console.warn('Cloudflare context not available - using development mode');
    // Return a mock or throw error for auth-related endpoints
    throw new Error('Database not available in development mode');
  }
}

// Export db instance for NextAuth adapter
export const db = (() => {
  try {
    const { env } = getCloudflareContext();
    return drizzle(env.DB, { schema });
  } catch (error) {
    // Fallback for build time when context is not available
    return null as any;
  }
})();
