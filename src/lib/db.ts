import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export function getDB() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
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
