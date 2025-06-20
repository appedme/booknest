import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function getDB() {
  try {
    // Dynamic import for Cloudflare context to avoid build issues
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = getCloudflareContext();
    return drizzle(context.env.DB, { schema });
  } catch (error) {
    console.warn('Cloudflare context not available - this is expected during build time');
    // Return a mock database for build time
    return null;
  }
}

// For sync usage, we'll create a simple wrapper
export function getDBSync() {
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const context = getCloudflareContext();
    return drizzle(context.env.DB, { schema });
  } catch (error) {
    console.warn('Cloudflare context not available - this is expected during build time');
    return null;
  }
}

// Export db instance for NextAuth adapter with better error handling
export const db = (() => {
  try {
    return getDBSync();
  } catch (dbError) {
    // Return null for build time when database is not available
    console.warn('Database connection failed during initialization, auth will fall back to JWT:', dbError);
    return null;
  }
})();
