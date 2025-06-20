#!/usr/bin/env tsx
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker';
import { users, books, comments, votes, commentLikes, reviews, reviewHelpful, bookmarks, readingLists, readingListBooks, GENRES } from '../src/lib/schema';

// Use the same database configuration as the app
const client = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
});

const db = drizzle(client);

// Curated book data with real popular books
const BOOK_DATA = [
  // Programming & Tech
  { name: "Clean Code", genre: "programming", author: "Robert C. Martin", summary: "A handbook of agile software craftsmanship that teaches the principles of writing clean, readable code." },
  { name: "The Pragmatic Programmer", genre: "programming", author: "David Thomas", summary: "Your journey to mastery. A classic guide for programmers looking to improve their craft." },
  { name: "Design Patterns", genre: "programming", author: "Gang of Four", summary: "Elements of reusable object-oriented software. The foundation of modern software design patterns." },
  { name: "You Don't Know JS", genre: "programming", author: "Kyle Simpson", summary: "A deep dive into JavaScript core mechanisms that every developer should understand." },
  { name: "Eloquent JavaScript", genre: "programming", author: "Marijn Haverbeke", summary: "A modern introduction to programming with JavaScript, from basics to advanced concepts." },
  { name: "Python Crash Course", genre: "programming", author: "Eric Matthes", summary: "A hands-on, project-based introduction to programming in Python." },
  { name: "Automate the Boring Stuff", genre: "programming", author: "Al Sweigart", summary: "Practical programming for total beginners using Python to automate everyday tasks." },
  
  // Fiction Classics
  { name: "The Great Gatsby", genre: "fiction", author: "F. Scott Fitzgerald", summary: "A classic American novel about the Jazz Age, wealth, and the elusive American Dream." },
  { name: "To Kill a Mockingbird", genre: "fiction", author: "Harper Lee", summary: "A powerful tale of racial injustice and moral growth in the American South." },
  { name: "1984", genre: "fiction", author: "George Orwell", summary: "A dystopian masterpiece about totalitarianism, surveillance, and the power of language." },
  { name: "Pride and Prejudice", genre: "fiction", author: "Jane Austen", summary: "A witty romance exploring class, marriage, and social expectations in Regency England." },
  { name: "The Catcher in the Rye", genre: "fiction", author: "J.D. Salinger", summary: "A coming-of-age story following teenager Holden Caulfield's journey through New York." },
  { name: "Lord of the Flies", genre: "fiction", author: "William Golding", summary: "A chilling exploration of human nature when civilization breaks down." },
  
  // Science Fiction
  { name: "Dune", genre: "science_fiction", author: "Frank Herbert", summary: "An epic space opera set in a feudal interstellar society in the distant future." },
  { name: "Foundation", genre: "science_fiction", author: "Isaac Asimov", summary: "The groundbreaking series about psychohistory and the fall of a galactic empire." },
  { name: "Neuromancer", genre: "science_fiction", author: "William Gibson", summary: "The seminal cyberpunk novel that defined a genre and predicted the internet age." },
  { name: "The Hitchhiker's Guide to the Galaxy", genre: "science_fiction", author: "Douglas Adams", summary: "A comedic journey through space with the most remarkable book in the galaxy." },
  { name: "Ender's Game", genre: "science_fiction", author: "Orson Scott Card", summary: "A military science fiction novel about gifted children trained to fight an alien invasion." },
  { name: "The Martian", genre: "science_fiction", author: "Andy Weir", summary: "A thrilling survival story about an astronaut stranded alone on Mars." },
  
  // Fantasy
  { name: "The Lord of the Rings", genre: "fantasy", author: "J.R.R. Tolkien", summary: "The epic fantasy trilogy that defined the genre, following Frodo's quest to destroy the One Ring." },
  { name: "Harry Potter and the Philosopher's Stone", genre: "fantasy", author: "J.K. Rowling", summary: "The magical beginning of Harry Potter's journey at Hogwarts School of Witchcraft and Wizardry." },
  { name: "A Game of Thrones", genre: "fantasy", author: "George R.R. Martin", summary: "Political intrigue and power struggles in the fantasy world of Westeros." },
  { name: "The Name of the Wind", genre: "fantasy", author: "Patrick Rothfuss", summary: "The beautifully written story of Kvothe, a legendary figure telling his own tale." },
  { name: "The Way of Kings", genre: "fantasy", author: "Brandon Sanderson", summary: "Epic fantasy with unique magic systems and compelling character development." },
  { name: "The Hobbit", genre: "fantasy", author: "J.R.R. Tolkien", summary: "Bilbo Baggins' unexpected journey to reclaim the lost Dwarf Kingdom of Erebor." },
  
  // Non-Fiction & Self-Help
  { name: "Sapiens", genre: "non_fiction", author: "Yuval Noah Harari", summary: "A brief history of humankind, exploring how Homo sapiens conquered the world." },
  { name: "Educated", genre: "non_fiction", author: "Tara Westover", summary: "A powerful memoir about education, family, and the transformative power of learning." },
  { name: "Thinking, Fast and Slow", genre: "non_fiction", author: "Daniel Kahneman", summary: "Nobel laureate's exploration of how the mind makes decisions and forms judgments." },
  { name: "Atomic Habits", genre: "self_help", author: "James Clear", summary: "An easy and proven way to build good habits and break bad ones using small changes." },
  { name: "The Power of Habit", genre: "self_help", author: "Charles Duhigg", summary: "Why we do what we do in life and business, and how to change our habits." },
  { name: "Becoming", genre: "biography", author: "Michelle Obama", summary: "The inspiring memoir of the former First Lady of the United States." },
  
  // Business & Economics
  { name: "The Lean Startup", genre: "business", author: "Eric Ries", summary: "How today's entrepreneurs use continuous innovation to create successful businesses." },
  { name: "Zero to One", genre: "business", author: "Peter Thiel", summary: "Notes on startups, monopolies, and how to build the future." },
  { name: "Good to Great", genre: "business", author: "Jim Collins", summary: "Why some companies make the leap from good to great while others don't." },
  { name: "Rich Dad Poor Dad", genre: "business", author: "Robert Kiyosaki", summary: "What the rich teach their kids about money that the poor and middle class do not." },
  { name: "The 4-Hour Workweek", genre: "business", author: "Timothy Ferriss", summary: "Escape the 9-5, live anywhere, and join the new rich with lifestyle design." },
  
  // Mystery & Thriller
  { name: "Gone Girl", genre: "mystery", author: "Gillian Flynn", summary: "A psychological thriller about a marriage gone terribly wrong." },
  { name: "The Girl with the Dragon Tattoo", genre: "mystery", author: "Stieg Larsson", summary: "A journalist and a hacker team up to solve a decades-old disappearance." },
  { name: "Big Little Lies", genre: "mystery", author: "Liane Moriarty", summary: "Secrets and lies unravel in a seaside Australian town." },
  { name: "The Silent Patient", genre: "thriller", author: "Alex Michaelides", summary: "A psychotherapist becomes obsessed with treating a woman who refuses to speak." },
  { name: "In the Woods", genre: "mystery", author: "Tana French", summary: "A haunting mystery that blurs the line between past and present." },
  
  // Romance
  { name: "Me Before You", genre: "romance", author: "Jojo Moyes", summary: "An unlikely love story that changes everything for both characters." },
  { name: "The Notebook", genre: "romance", author: "Nicholas Sparks", summary: "A timeless love story that spans decades." },
  { name: "Outlander", genre: "romance", author: "Diana Gabaldon", summary: "Time travel romance combining history, adventure, and passion." },
  { name: "Beach Read", genre: "romance", author: "Emily Henry", summary: "Two writers challenge each other to write outside their comfort zones." },
  
  // Young Adult
  { name: "The Hunger Games", genre: "young_adult", author: "Suzanne Collins", summary: "Teens fight for survival in a dystopian future where death is entertainment." },
  { name: "Divergent", genre: "young_adult", author: "Veronica Roth", summary: "A society divided by personality traits faces revolution." },
  { name: "The Fault in Our Stars", genre: "young_adult", author: "John Green", summary: "Two cancer patients fall in love and find meaning in their limited time." },
  { name: "Eleanor & Park", genre: "young_adult", author: "Rainbow Rowell", summary: "First love blooms between two misfit teenagers in 1986." },
  
  // Horror
  { name: "The Shining", genre: "horror", author: "Stephen King", summary: "A family's winter isolation at a haunted hotel turns deadly." },
  { name: "It", genre: "horror", author: "Stephen King", summary: "Children in a small town face an ancient evil that feeds on fear." },
  { name: "Dracula", genre: "horror", author: "Bram Stoker", summary: "The classic vampire novel that defined the genre." },
  
  // History & Biography
  { name: "Steve Jobs", genre: "biography", author: "Walter Isaacson", summary: "The definitive biography of Apple's visionary co-founder." },
  { name: "Einstein: His Life and Universe", genre: "biography", author: "Walter Isaacson", summary: "The life and genius of the greatest physicist of all time." },
  { name: "Guns, Germs, and Steel", genre: "history", author: "Jared Diamond", summary: "How geography and environment shaped the fates of human societies." },
  { name: "A People's History of the United States", genre: "history", author: "Howard Zinn", summary: "American history from the perspective of ordinary people." },
  
  // Philosophy & Religion
  { name: "Man's Search for Meaning", genre: "philosophy", author: "Viktor Frankl", summary: "A Holocaust survivor's profound insights on finding purpose in suffering." },
  { name: "The Alchemist", genre: "philosophy", author: "Paulo Coelho", summary: "A philosophical novel about following your dreams and finding your destiny." },
  { name: "Meditations", genre: "philosophy", author: "Marcus Aurelius", summary: "Timeless Stoic wisdom from a Roman emperor's personal journal." }
];

function getRandomCover(): string {
  const colors = ['3B82F6', 'EF4444', '10B981', 'F59E0B', '8B5CF6', 'EC4899', '06B6D4', 'F97316'];
  const color = faker.helpers.arrayElement(colors);
  return `https://via.placeholder.com/400x600/${color}/FFFFFF?text=Book+Cover`;
}

function getBookUrl(): string {
  const platforms = [
    'https://gitbook.com/book/',
    'https://www.amazon.com/dp/',
    'https://www.goodreads.com/book/show/',
    'https://books.google.com/books?id=',
    'https://www.notion.so/book/',
    'https://github.com/user/book-',
    'https://medium.com/@author/book-'
  ];
  const platform = faker.helpers.arrayElement(platforms);
  return platform + faker.string.alphanumeric(10);
}

function generateComment(): string {
  const comments = [
    "This book completely changed my perspective! The writing is incredible.",
    "I couldn't put it down. Stayed up until 3 AM to finish it.",
    "One of the best books I've read this year. Highly recommend!",
    "The character development was phenomenal throughout.",
    "This made me cry, laugh, and think deeply about life.",
    "I've read this multiple times and always discover something new.",
    "The research and attention to detail is remarkable.",
    "Perfect for anyone looking for a thought-provoking read.",
    "The author's expertise really shows on every page.",
    "Great plot development with unexpected twists.",
    "Beautifully written with compelling themes.",
    "This deserves all the recognition it gets.",
    "I recommended this to my entire reading group.",
    "The dialogue feels so natural and authentic.",
    "Excellent blend of entertainment and education.",
    "This book opened my mind to new ideas.",
    "Incredibly well-researched and engaging.",
    "A masterclass in storytelling technique.",
    "The pacing was perfect from start to finish.",
    "Life-changing insights that I still think about."
  ];
  return faker.helpers.arrayElement(comments);
}

function generateReply(): string {
  const replies = [
    "I totally agree! That part really stood out to me too.",
    "Interesting perspective! I had a different take on it.",
    "Thanks for sharing this insight.",
    "Yes! That was exactly my reaction.",
    "Great point! I hadn't considered that angle.",
    "This is why I love book discussions!",
    "You've convinced me to give it another read.",
    "I had the opposite reaction, but I see your point.",
    "This comment captures what I was thinking perfectly.",
    "I'm glad someone else noticed that detail!"
  ];
  return faker.helpers.arrayElement(replies);
}

async function clearData() {
  console.log('🗑️  Clearing existing data...');
  await db.delete(commentLikes);
  await db.delete(comments);
  await db.delete(votes);
  await db.delete(books);
  console.log('✅ Data cleared');
}

async function createUsers() {
  console.log('👥 Creating users...');
  
  const userData: Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: null;
    image: string;
  }> = [];
  
  // Create diverse, realistic users
  for (let i = 0; i < 35; i++) {
    userData.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      emailVerified: null,
      image: faker.image.avatar()
    });
  }
  
  // Add some book-themed users
  const bookUsers = [
    { name: 'Luna Bookworm', email: 'luna.bookworm@example.com' },
    { name: 'Reed Chapters', email: 'reed.chapters@example.com' },
    { name: 'Story Seeker', email: 'story.seeker@example.com' },
    { name: 'Novel Navigator', email: 'novel.navigator@example.com' },
    { name: 'Page Turner', email: 'page.turner@example.com' }
  ];
  
  for (const user of bookUsers) {
    userData.push({
      id: faker.string.uuid(),
      name: user.name,
      email: user.email,
      emailVerified: null,
      image: faker.image.avatar()
    });
  }
  
  // Insert users
  for (const user of userData) {
    try {
      await db.insert(users).values(user);
    } catch (error) {
      // Skip if user already exists
    }
  }
  
  console.log(`✅ Created ${userData.length} users`);
  return userData.map(u => u.id);
}

async function createBooks(userIds: string[]) {
  console.log('📚 Creating books...');
  
  const bookIds: number[] = [];
  
  // Add curated books
  for (const book of BOOK_DATA) {
    const result = await db.insert(books).values({
      name: book.name,
      url: getBookUrl(),
      posterUrl: getRandomCover(),
      summary: book.summary,
      genre: book.genre,
      userId: faker.helpers.arrayElement(userIds),
      createdAt: faker.date.between({ from: '2023-01-01', to: new Date() }),
      updatedAt: new Date()
    }).returning({ id: books.id });
    
    if (result[0]) bookIds.push(result[0].id);
  }
  
  // Add additional random books to reach 60+
  while (bookIds.length < 65) {
    const result = await db.insert(books).values({
      name: faker.book.title(),
      url: getBookUrl(),
      posterUrl: getRandomCover(),
      summary: faker.lorem.paragraphs(2),
      genre: faker.helpers.arrayElement(GENRES),
      userId: faker.helpers.arrayElement(userIds),
      createdAt: faker.date.between({ from: '2023-01-01', to: new Date() }),
      updatedAt: new Date()
    }).returning({ id: books.id });
    
    if (result[0]) bookIds.push(result[0].id);
  }
  
  console.log(`✅ Created ${bookIds.length} books`);
  return bookIds;
}

async function createVotes(bookIds: number[], userIds: string[]) {
  console.log('🗳️  Creating votes...');
  
  let voteCount = 0;
  for (const bookId of bookIds) {
    const numVotes = faker.number.int({ min: 0, max: 25 });
    const voters = faker.helpers.arrayElements(userIds, numVotes);
    
    for (const userId of voters) {
      await db.insert(votes).values({
        bookId,
        userId,
        ipHash: null,
        voteType: faker.helpers.weightedArrayElement([
          { weight: 8, value: 'upvote' },
          { weight: 2, value: 'downvote' }
        ]),
        createdAt: faker.date.between({ from: '2023-01-01', to: new Date() })
      });
      voteCount++;
    }
  }
  
  console.log(`✅ Created ${voteCount} votes`);
}

async function createComments(bookIds: number[], userIds: string[]) {
  console.log('💬 Creating comments and replies...');
  
  const commentIds: number[] = [];
  let commentCount = 0;
  
  // Create top-level comments
  for (const bookId of bookIds) {
    const numComments = faker.number.int({ min: 2, max: 10 });
    const commenters = faker.helpers.arrayElements(userIds, numComments);
    
    for (const userId of commenters) {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      const result = await db.insert(comments).values({
        bookId,
        userId,
        parentCommentId: null,
        authorName: user[0]?.name || faker.person.fullName(),
        content: generateComment(),
        createdAt: faker.date.between({ from: '2023-01-01', to: new Date() })
      }).returning({ id: comments.id });
      
      if (result[0]) {
        commentIds.push(result[0].id);
        commentCount++;
      }
    }
  }
  
  // Create replies (40% of comments get replies)
  let replyCount = 0;
  for (const commentId of commentIds) {
    if (faker.number.float() < 0.4) {
      const numReplies = faker.number.int({ min: 1, max: 4 });
      const repliers = faker.helpers.arrayElements(userIds, numReplies);
      
      const originalComment = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);
      
      for (const userId of repliers) {
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        
        await db.insert(comments).values({
          bookId: originalComment[0].bookId,
          userId,
          parentCommentId: commentId,
          authorName: user[0]?.name || faker.person.fullName(),
          content: generateReply(),
          createdAt: faker.date.between({ 
            from: originalComment[0].createdAt, 
            to: new Date() 
          })
        });
        replyCount++;
      }
    }
  }
  
  console.log(`✅ Created ${commentCount} comments and ${replyCount} replies`);
  return commentIds;
}

async function createCommentLikes(commentIds: number[], userIds: string[]) {
  console.log('👍 Creating comment likes...');
  
  let likeCount = 0;
  for (const commentId of commentIds) {
    const numLikes = faker.number.int({ min: 0, max: 12 });
    const likers = faker.helpers.arrayElements(userIds, numLikes);
    
    for (const userId of likers) {
      await db.insert(commentLikes).values({
        commentId,
        userId,
        ipHash: null,
        createdAt: faker.date.between({ from: '2023-01-01', to: new Date() })
      });
      likeCount++;
    }
  }
  
  console.log(`✅ Created ${likeCount} comment likes`);
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');
  console.log('');
  
  try {
    // Import eq operator
    const { eq } = await import('drizzle-orm');
    
    await clearData();
    
    const userIds = await createUsers();
    const bookIds = await createBooks(userIds);
    
    await createVotes(bookIds, userIds);
    const commentIds = await createComments(bookIds, userIds);
    await createCommentLikes(commentIds, userIds);
    
    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${userIds.length}`);
    console.log(`   📚 Books: ${bookIds.length}`);
    console.log(`   🗳️  Votes: Multiple per book (realistic distribution)`);
    console.log(`   💬 Comments: Multiple per book with nested replies`);
    console.log(`   👍 Likes: Multiple per comment`);
    console.log('');
    console.log('📖 Featured Books Include:');
    console.log('   • Programming: Clean Code, Design Patterns, Python Crash Course');
    console.log('   • Fiction: The Great Gatsby, 1984, To Kill a Mockingbird');
    console.log('   • Sci-Fi: Dune, Foundation, The Martian');
    console.log('   • Fantasy: Lord of the Rings, Harry Potter, Game of Thrones');
    console.log('   • Business: The Lean Startup, Zero to One, Rich Dad Poor Dad');
    console.log('   • And many more across all genres!');
    console.log('');
    console.log('🚀 You can now run: pnpm dev');
    console.log('💡 Visit: http://localhost:3001/create to see the enhanced UI');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
