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

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id), // Reference to auth user
  authorName: text("author_name"), // Display name for review
  rating: integer("rating").notNull(), // 1-5 star rating
  title: text("title"), // Optional review title
  content: text("content").notNull(), // Review content
  isVerifiedPurchase: integer("is_verified_purchase", { mode: "boolean" }).default(false),
  helpfulCount: integer("helpful_count").default(0), // Number of helpful votes
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Review helpful votes table
export const reviewHelpful = sqliteTable("review_helpful", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewId: integer("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id), // Reference to auth user
  ipHash: text("ip_hash"), // For anonymous votes fallback
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Bookmarks table
export const bookmarks = sqliteTable("bookmarks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  folderName: text("folder_name").default("default"), // For organizing bookmarks
  notes: text("notes"), // Personal notes about the book
  isRead: integer("is_read", { mode: "boolean" }).default(false), // Reading status
  readingProgress: integer("reading_progress").default(0), // Progress percentage 0-100
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Reading lists table (collections of bookmarks)
export const readingLists = sqliteTable("reading_lists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // List name (e.g., "Want to Read", "Currently Reading")
  description: text("description"), // Optional description
  isPublic: integer("is_public", { mode: "boolean" }).default(false), // Whether others can see this list
  sortOrder: integer("sort_order").default(0), // For custom ordering
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Many-to-many relationship between reading lists and books
export const readingListBooks = sqliteTable("reading_list_books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  readingListId: integer("reading_list_id").notNull().references(() => readingLists.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  addedAt: integer("added_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Book ratings aggregation (computed from reviews)
export const bookRatings = sqliteTable("book_ratings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  averageRating: integer("average_rating"), // Average rating * 10 (e.g., 4.5 stars = 45)
  totalReviews: integer("total_reviews").default(0),
  fiveStars: integer("five_stars").default(0),
  fourStars: integer("four_stars").default(0),
  threeStars: integer("three_stars").default(0),
  twoStars: integer("two_stars").default(0),
  oneStar: integer("one_star").default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" })
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
