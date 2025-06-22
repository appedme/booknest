import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import path from "path";

export async function getDB() {
  try {
    // In development or when LIBSQL_URL is set, use libsql client with dynamic import
    if (process.env.NODE_ENV === 'development' || process.env.LIBSQL_URL) {
      const [{ drizzle: drizzleLibSQL }, { createClient }] = await Promise.all([
        import("drizzle-orm/libsql"),
        import("@libsql/client")
      ]);
      
      const dbPath = process.env.LIBSQL_URL || `file:${path.join(process.cwd(), 'local.db')}`;
      const client = createClient({
        url: dbPath,
        authToken: process.env.LIBSQL_AUTH_TOKEN
      });
      return drizzleLibSQL(client, { schema });
    }

    // In production (Cloudflare), use D1 directly
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext({ async: true });
    return drizzle(context.env.DB, { schema });
  } catch (error) {
    console.warn('Database connection failed:', error);
    
    // Fallback to local database if available
    try {
      const [{ drizzle: drizzleLibSQL }, { createClient }] = await Promise.all([
        import("drizzle-orm/libsql"),
        import("@libsql/client")
      ]);
      
      const dbPath = path.join(process.cwd(), 'local.db');
      const client = createClient({
        url: `file:${dbPath}`
      });
      return drizzleLibSQL(client, { schema });
    } catch (fallbackError) {
      console.error('Fallback database connection also failed:', fallbackError);
      return null;
    }
  }
}

// For sync usage during build time, avoid Cloudflare context entirely
export function getDBSync() {
  try {
    // Always use local SQLite database for sync calls to avoid Cloudflare context issues
    // Use require for sync loading in build context
    const { drizzle: drizzleLibSQL } = require("drizzle-orm/libsql");
    const { createClient } = require("@libsql/client");
    
    const dbPath = path.join(process.cwd(), 'local.db');
    const client = createClient({
      url: `file:${dbPath}`
    });
    return drizzleLibSQL(client, { schema });
  } catch (error) {
    console.warn('Database connection failed:', error);
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
