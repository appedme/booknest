import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // For local development, use the Wrangler D1 database
    url: "file:./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/booknest-db.sqlite",
  },
  verbose: true,
  strict: true,
});
