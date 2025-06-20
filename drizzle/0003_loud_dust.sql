CREATE TABLE `book_ratings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`average_rating` integer,
	`total_reviews` integer DEFAULT 0,
	`five_stars` integer DEFAULT 0,
	`four_stars` integer DEFAULT 0,
	`three_stars` integer DEFAULT 0,
	`two_stars` integer DEFAULT 0,
	`one_star` integer DEFAULT 0,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`folder_name` text DEFAULT 'default',
	`notes` text,
	`is_read` integer DEFAULT false,
	`reading_progress` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reading_list_books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reading_list_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	`added_at` integer NOT NULL,
	FOREIGN KEY (`reading_list_id`) REFERENCES `reading_lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reading_lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_public` integer DEFAULT false,
	`sort_order` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `review_helpful` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`review_id` integer NOT NULL,
	`user_id` text,
	`ip_hash` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`user_id` text,
	`author_name` text,
	`rating` integer NOT NULL,
	`title` text,
	`content` text NOT NULL,
	`is_verified_purchase` integer DEFAULT false,
	`helpful_count` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
