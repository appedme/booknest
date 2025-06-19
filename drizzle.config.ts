import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // For local development, use local SQLite file
    url: process.env.NODE_ENV === 'production'
      ? "file:./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/booknest-db.sqlite"
      : "file:./local.db",
  },
  verbose: true,
  strict: true,
});
