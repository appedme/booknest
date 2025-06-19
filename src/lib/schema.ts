import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users table (optional - can allow anonymous uploads)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Books table
export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  posterUrl: text("poster_url"),
  summary: text("summary"),
  genre: text("genre").notNull(),
  userId: integer("user_id"), // Optional - for anonymous uploads
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Votes table
export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: integer("book_id").notNull(),
  userId: integer("user_id"), // Optional - can use IP hash instead
  ipHash: text("ip_hash"), // For anonymous voting
  voteType: text("vote_type").notNull(), // 'upvote' or 'downvote'
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Comments table
export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: integer("book_id").notNull(),
  userId: integer("user_id"), // Optional
  username: text("username"), // For anonymous comments
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Genre options (you can extend this list)
export const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'Programming',
  'Business',
  'Self-Help',
  'Biography',
  'History',
  'Philosophy',
  'Art',
  'Design',
  'Health',
  'Education',
  'Reference',
  'Other'
] as const;

export type Genre = typeof GENRES[number];
