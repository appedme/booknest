import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export function getDB() {
  try {
    const { env } = getCloudflareContext();
    return drizzle(env.DB, { schema });
  } catch (error) {
    // Database is only available in production (Cloudflare Workers)
    console.warn('Cloudflare context not available - database connection failed');
    throw new Error('Database connection failed. Please ensure you have a valid database connection configured.');
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
