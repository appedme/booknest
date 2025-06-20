import { drizzle } from "drizzle-orm/d1";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export function getDB() {
  // Local development setup using libsql client
  if (typeof window === 'undefined' && (process.env.NODE_ENV === 'development' || !process.env.CLOUDFLARE_ENV)) {
    try {
      const client = createClient({
        url: "file:./local.db",
      });
      return drizzleLibsql(client, { schema });
    } catch (error) {
      console.error("Failed to connect to local database:", error);
      throw new Error('Local database connection failed. Please ensure local.db exists.');
    }
  }

  // Production/Cloudflare Workers environment
  try {
    const { env } = getCloudflareContext();
    return drizzle(env.DB, { schema });
  } catch (cfError) {
    console.warn('Cloudflare context not available - falling back to development mode');
    // Fallback to local development
    try {
      const client = createClient({
        url: "file:./local.db",
      });
      return drizzleLibsql(client, { schema });
    } catch (fallbackError) {
      console.error("Both production and development database connections failed:", cfError, fallbackError);
      throw new Error('Database connection failed. Please ensure you have a valid database connection configured.');
    }
  }
}

// Export db instance for NextAuth adapter with better error handling
export const db = (() => {
  try {
    return getDB();
  } catch (dbError) {
    // Return null for build time when database is not available
    console.warn('Database connection failed during initialization, auth will fall back to JWT:', dbError);
    return null;
  }
})();
