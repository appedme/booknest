import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";

// NextAuth.js required tables
export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Books table
export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  posterUrl: text("poster_url"),
  summary: text("summary"),
  genre: text("genre").notNull(),
  userId: text("user_id").references(() => users.id), // Reference to auth user
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
  userId: text("user_id").references(() => users.id), // Reference to auth user
  ipHash: text("ip_hash"), // For anonymous voting fallback
  voteType: text("vote_type").notNull(), // 'upvote' or 'downvote'
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Comments table
export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: integer("book_id").notNull(),
  userId: text("user_id").references(() => users.id), // Reference to auth user
  parentCommentId: integer("parent_comment_id"), // For replies - will reference comments.id
  authorName: text("author_name"), // Display name for comment
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Comment likes table
export const commentLikes = sqliteTable("comment_likes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  commentId: integer("comment_id").notNull().references(() => comments.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id), // Reference to auth user
  ipHash: text("ip_hash"), // For anonymous likes fallback
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Genre options (you can extend this list)
export const GENRES = [
  'fiction',
  'non_fiction',
  'romance',
  'mystery',
  'thriller',
  'science_fiction',
  'fantasy',
  'horror',
  'young_adult',
  'children',
  'biography',
  'autobiography',
  'history',
  'science',
  'technology',
  'programming',
  'business',
  'self_help',
  'health',
  'cooking',
  'travel',
  'art',
  'design',
  'philosophy',
  'religion',
  'education',
  'reference',
  'poetry',
  'drama',
  'other'
] as const;

export type Genre = typeof GENRES[number];
