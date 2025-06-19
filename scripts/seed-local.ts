#!/usr/bin/env node

/**
 * Local SQLite Database Seeder
 * This script seeds the local SQLite database used in development mode
 */

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { users, books, votes, comments, GENRES } from '../src/lib/schema';

// Use the same database configuration as the app
const client = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
});

const db = drizzle(client);

const sampleUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: 'https://images.unsplash.com/photo-1494790108755-2616c354921c?w=400&h=400&fit=crop&crop=face',
    },
    {
        id: '3',
        name: 'Book Lover',
        email: 'booklover@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
];

const sampleBooks = [
    {
        name: 'The Great Gatsby',
        url: 'https://example.com/great-gatsby',
        posterUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        summary: 'A classic American novel about the Jazz Age and the American Dream. Set in the summer of 1922, it tells the story of Nick Carraway and his mysterious neighbor Jay Gatsby.',
        genre: 'Fiction',
        userId: '1',
    },
    {
        name: 'To Kill a Mockingbird',
        url: 'https://example.com/mockingbird',
        posterUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        summary: 'A gripping tale of racial injustice and loss of innocence set in the American South during the 1930s. The story is told through the eyes of Scout Finch.',
        genre: 'Fiction',
        userId: '2',
    },
    {
        name: '1984',
        url: 'https://example.com/1984',
        posterUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop',
        summary: 'George Orwell\'s dystopian masterpiece about totalitarianism, surveillance, and the power of language. Set in a world where Big Brother watches everything.',
        genre: 'Fiction',
        userId: '3',
    },
    {
        name: 'Clean Code',
        url: 'https://example.com/clean-code',
        posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        summary: 'Robert C. Martin\'s guide to writing clean, maintainable code. Essential reading for any serious programmer.',
        genre: 'Programming',
        userId: '1',
    },
    {
        name: 'The Catcher in the Rye',
        url: 'https://example.com/catcher-rye',
        posterUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        summary: 'J.D. Salinger\'s coming-of-age story following Holden Caulfield as he navigates teenage life and alienation in New York City.',
        genre: 'Fiction',
        userId: '2',
    },
    {
        name: 'The Lord of the Rings',
        url: 'https://example.com/lotr',
        posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        summary: 'Tolkien\'s epic fantasy trilogy about Frodo Baggins\' quest to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.',
        genre: 'Fiction',
        userId: '3',
    },
];

const sampleComments = [
    {
        content: 'This book completely changed my perspective on the American Dream. Fitzgerald\'s writing is absolutely beautiful.',
        authorName: 'Jane Smith',
        userId: '2',
        bookId: 1,
    },
    {
        content: 'A timeless classic that every student should read. The themes are still relevant today.',
        authorName: 'Book Lover',
        userId: '3',
        bookId: 2,
    },
    {
        content: 'Orwell was way ahead of his time. This book feels more relevant than ever in today\'s digital age.',
        authorName: 'John Doe',
        userId: '1',
        bookId: 3,
    },
    {
        content: 'Essential reading for any developer. The principles in this book will make you a better programmer.',
        authorName: 'Book Lover',
        userId: '3',
        bookId: 4,
    },
    {
        content: 'Holden\'s voice is so authentic and relatable, even decades after publication.',
        authorName: 'John Doe',
        userId: '1',
        bookId: 5,
    },
    {
        content: 'The world-building in Middle-earth is unparalleled. A masterwork of fantasy literature.',
        authorName: 'Jane Smith',
        userId: '2',
        bookId: 6,
    },
];

const sampleVotes = [
    { userId: '1', bookId: 1, voteType: 'upvote' },
    { userId: '2', bookId: 1, voteType: 'upvote' },
    { userId: '3', bookId: 2, voteType: 'upvote' },
    { userId: '1', bookId: 2, voteType: 'upvote' },
    { userId: '2', bookId: 3, voteType: 'upvote' },
    { userId: '3', bookId: 3, voteType: 'upvote' },
    { userId: '1', bookId: 4, voteType: 'upvote' },
    { userId: '2', bookId: 5, voteType: 'upvote' },
    { userId: '3', bookId: 6, voteType: 'upvote' },
    { userId: '1', bookId: 6, voteType: 'upvote' },
];

async function seedLocal() {
    try {
        console.log('🌱 Starting local SQLite database seeding...');
        console.log(`📍 Database URL: ${process.env.DATABASE_URL || 'file:local.db'}`);

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        try {
            await db.delete(votes);
            await db.delete(comments);
            await db.delete(books);
            await db.delete(users);
        } catch (error) {
            console.log('⚠️  Some tables may not exist yet, continuing...');
        }

        // Insert users
        console.log('👥 Inserting users...');
        const insertedUsers = await db.insert(users).values(sampleUsers).returning();
        console.log(`✅ Inserted ${insertedUsers.length} users`);

        // Insert books
        console.log('📖 Inserting books...');
        const insertedBooks = await db.insert(books).values(sampleBooks).returning();
        console.log(`✅ Inserted ${insertedBooks.length} books`);

        // Insert comments
        console.log('💬 Inserting comments...');
        const insertedComments = await db.insert(comments).values(sampleComments).returning();
        console.log(`✅ Inserted ${insertedComments.length} comments`);

        // Insert votes
        console.log('👍 Inserting votes...');
        const insertedVotes = await db.insert(votes).values(sampleVotes).returning();
        console.log(`✅ Inserted ${insertedVotes.length} votes`);

        console.log('🎉 Local database seeding completed successfully!');
        console.log(`📊 Summary:
    - Users: ${insertedUsers.length}
    - Books: ${insertedBooks.length}  
    - Comments: ${insertedComments.length}
    - Votes: ${insertedVotes.length}
    - Available genres: ${GENRES.join(', ')}`);
    } catch (error) {
        console.error('❌ Error seeding local database:', error);
        process.exit(1);
    } finally {
        client.close();
    }
}

// Run the seed function
seedLocal();
