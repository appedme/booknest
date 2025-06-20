#!/usr/bin/env tsx
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker';
import { users, books, reviews, reviewHelpful, bookmarks, readingLists, readingListBooks } from '../src/lib/schema';

// Use the same database configuration as the app
const client = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
});

const db = drizzle(client);

async function seedExtendedFeatures() {
  console.log('🌟 Seeding extended features (reviews, bookmarks, reading lists)...');

  try {
    // Get existing users and books
    const allUsers = await db.select().from(users);
    const allBooks = await db.select().from(books);

    if (allUsers.length === 0 || allBooks.length === 0) {
      console.log('❌ No users or books found. Please run the main seeding script first.');
      return;
    }

    console.log(`📊 Found ${allUsers.length} users and ${allBooks.length} books`);

    // Create reviews
    console.log('📝 Creating reviews...');
    const reviewsData: Array<{
      bookId: number;
      userId: string;
      title: string;
      content: string;
      rating: number;
      helpfulCount: number;
    }> = [];
    
    for (let i = 0; i < 150; i++) {
      const randomUser = faker.helpers.arrayElement(allUsers);
      const randomBook = faker.helpers.arrayElement(allBooks);
      
      reviewsData.push({
        bookId: randomBook.id,
        userId: randomUser.id,
        title: faker.helpers.arrayElement([
          'Amazing read!',
          'Life-changing book',
          'Couldn\'t put it down',
          'Highly recommended',
          'Must read',
          'Brilliant work',
          'Thought-provoking',
          'Excellent storytelling',
          'A masterpiece',
          'Outstanding',
        ]),
        content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
        rating: faker.number.int({ min: 1, max: 5 }),
        helpfulCount: faker.number.int({ min: 0, max: 25 }),
      });
    }
    
    await db.insert(reviews).values(reviewsData);
    console.log(`✅ Created ${reviewsData.length} reviews`);

    // Create review helpful votes
    console.log('👍 Creating review helpful votes...');
    const allReviews = await db.select().from(reviews);
    const reviewHelpfulData: Array<{
      reviewId: number;
      userId: string;
    }> = [];
    
    for (let i = 0; i < 300; i++) {
      const randomReview = faker.helpers.arrayElement(allReviews);
      const randomUser = faker.helpers.arrayElement(allUsers);
      
      reviewHelpfulData.push({
        reviewId: randomReview.id,
        userId: randomUser.id,
      });
    }
    
    await db.insert(reviewHelpful).values(reviewHelpfulData);
    console.log(`✅ Created ${reviewHelpfulData.length} review helpful votes`);

    // Create bookmarks
    console.log('🔖 Creating bookmarks...');
    const bookmarksData: Array<{
      bookId: number;
      userId: string;
      folderName: string;
      notes: string | null;
      isRead: boolean;
      readingProgress: number;
    }> = [];
    
    for (let i = 0; i < 200; i++) {
      const randomUser = faker.helpers.arrayElement(allUsers);
      const randomBook = faker.helpers.arrayElement(allBooks);
      
      bookmarksData.push({
        bookId: randomBook.id,
        userId: randomUser.id,
        folderName: faker.helpers.arrayElement(['default', 'favorites', 'to-read', 'currently-reading', 'finished']),
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        isRead: faker.datatype.boolean(),
        readingProgress: faker.number.int({ min: 0, max: 100 }),
      });
    }
    
    await db.insert(bookmarks).values(bookmarksData);
    console.log(`✅ Created ${bookmarksData.length} bookmarks`);

    // Create reading lists
    console.log('📚 Creating reading lists...');
    const readingListsData: Array<{
      userId: string;
      name: string;
      description: string | null;
      isPublic: boolean;
      sortOrder: number;
    }> = [];
    
    for (let i = 0; i < 50; i++) {
      const randomUser = faker.helpers.arrayElement(allUsers);
      
      readingListsData.push({
        userId: randomUser.id,
        name: faker.helpers.arrayElement([
          'Want to Read',
          'Currently Reading',
          'Finished Books',
          'Favorites',
          'Classics',
          'Sci-Fi Collection',
          'Programming Books',
          'Best of 2024',
          'Weekend Reads',
          'Book Club Picks',
        ]),
        description: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        isPublic: faker.datatype.boolean(),
        sortOrder: faker.number.int({ min: 0, max: 10 }),
      });
    }
    
    await db.insert(readingLists).values(readingListsData);
    console.log(`✅ Created ${readingListsData.length} reading lists`);

    // Create reading list books (many-to-many relationships)
    console.log('📖 Adding books to reading lists...');
    const allReadingLists = await db.select().from(readingLists);
    const readingListBooksData: Array<{
      readingListId: number;
      bookId: number;
    }> = [];
    
    for (let i = 0; i < 300; i++) {
      const randomList = faker.helpers.arrayElement(allReadingLists);
      const randomBook = faker.helpers.arrayElement(allBooks);
      
      readingListBooksData.push({
        readingListId: randomList.id,
        bookId: randomBook.id,
      });
    }
    
    await db.insert(readingListBooks).values(readingListBooksData);
    console.log(`✅ Added ${readingListBooksData.length} books to reading lists`);

    console.log('\n🎉 Extended features seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   📝 Reviews: ${reviewsData.length}`);
    console.log(`   👍 Review helpful votes: ${reviewHelpfulData.length}`);
    console.log(`   🔖 Bookmarks: ${bookmarksData.length}`);
    console.log(`   📚 Reading lists: ${readingListsData.length}`);
    console.log(`   📖 Reading list books: ${readingListBooksData.length}`);
    console.log('\n🚀 Your database now includes the full extended feature set!');

  } catch (error) {
    console.error('❌ Error seeding extended features:', error);
    throw error;
  }
}

// Run the seeding function
if (require.main === module) {
  seedExtendedFeatures()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedExtendedFeatures };
