import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { books, comments, commentLikes, votes } from '../src/lib/schema';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  const sqlite = new Database('./local.db');
  const db = drizzle(sqlite);

  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(commentLikes);
    await db.delete(comments);
    await db.delete(votes);
    await db.delete(books);

    // Sample books data
    const booksData = [
      { name: "Clean Code", url: "https://example.com/clean-code", genre: "programming", summary: "A handbook of agile software craftsmanship by Robert C. Martin" },
      { name: "The Great Gatsby", url: "https://example.com/great-gatsby", genre: "fiction", summary: "A classic American novel by F. Scott Fitzgerald" },
      { name: "Dune", url: "https://example.com/dune", genre: "science_fiction", summary: "Epic space opera by Frank Herbert" },
      { name: "Pride and Prejudice", url: "https://example.com/pride-prejudice", genre: "romance", summary: "Romantic novel by Jane Austen" },
      { name: "1984", url: "https://example.com/1984", genre: "fiction", summary: "Dystopian novel by George Orwell" },
      { name: "To Kill a Mockingbird", url: "https://example.com/mockingbird", genre: "fiction", summary: "Classic novel by Harper Lee" },
      { name: "The Lord of the Rings", url: "https://example.com/lotr", genre: "fantasy", summary: "Epic fantasy by J.R.R. Tolkien" },
      { name: "Harry Potter", url: "https://example.com/harry-potter", genre: "fantasy", summary: "Magical adventure by J.K. Rowling" },
      { name: "The Shining", url: "https://example.com/shining", genre: "horror", summary: "Horror novel by Stephen King" },
      { name: "Sapiens", url: "https://example.com/sapiens", genre: "history", summary: "History of humankind by Yuval Noah Harari" },
      // Add more books to reach 50+
      { name: "Atomic Habits", url: "https://example.com/atomic-habits", genre: "self_help", summary: "Habit formation guide by James Clear" },
      { name: "The Lean Startup", url: "https://example.com/lean-startup", genre: "business", summary: "Startup methodology by Eric Ries" },
      { name: "Neuromancer", url: "https://example.com/neuromancer", genre: "science_fiction", summary: "Cyberpunk novel by William Gibson" },
      { name: "Gone Girl", url: "https://example.com/gone-girl", genre: "thriller", summary: "Psychological thriller by Gillian Flynn" },
      { name: "The Alchemist", url: "https://example.com/alchemist", genre: "philosophy", summary: "Philosophical novel by Paulo Coelho" },
      { name: "Educated", url: "https://example.com/educated", genre: "biography", summary: "Memoir by Tara Westover" },
      { name: "Becoming", url: "https://example.com/becoming", genre: "autobiography", summary: "Memoir by Michelle Obama" },
      { name: "The Da Vinci Code", url: "https://example.com/da-vinci-code", genre: "mystery", summary: "Mystery thriller by Dan Brown" },
      { name: "Life of Pi", url: "https://example.com/life-of-pi", genre: "fiction", summary: "Adventure novel by Yann Martel" },
      { name: "The Kite Runner", url: "https://example.com/kite-runner", genre: "fiction", summary: "Drama by Khaled Hosseini" },
      { name: "Thinking Fast and Slow", url: "https://example.com/thinking-fast-slow", genre: "science", summary: "Psychology book by Daniel Kahneman" },
      { name: "Zero to One", url: "https://example.com/zero-to-one", genre: "business", summary: "Startup guide by Peter Thiel" },
      { name: "The Handmaid's Tale", url: "https://example.com/handmaids-tale", genre: "fiction", summary: "Dystopian novel by Margaret Atwood" },
      { name: "Brave New World", url: "https://example.com/brave-new-world", genre: "science_fiction", summary: "Dystopian novel by Aldous Huxley" },
      { name: "The Catcher in the Rye", url: "https://example.com/catcher-rye", genre: "fiction", summary: "Coming-of-age novel by J.D. Salinger" },
      { name: "Where the Crawdads Sing", url: "https://example.com/crawdads-sing", genre: "mystery", summary: "Mystery novel by Delia Owens" },
      { name: "The Seven Husbands of Evelyn Hugo", url: "https://example.com/evelyn-hugo", genre: "romance", summary: "Contemporary fiction by Taylor Jenkins Reid" },
      { name: "Project Hail Mary", url: "https://example.com/project-hail-mary", genre: "science_fiction", summary: "Hard sci-fi by Andy Weir" },
      { name: "The Midnight Library", url: "https://example.com/midnight-library", genre: "philosophy", summary: "Philosophical fiction by Matt Haig" },
      { name: "Foundation", url: "https://example.com/foundation", genre: "science_fiction", summary: "Space opera by Isaac Asimov" },
      { name: "The Hitchhiker's Guide to the Galaxy", url: "https://example.com/hitchhiker-guide", genre: "science_fiction", summary: "Comedy sci-fi by Douglas Adams" },
      { name: "Ender's Game", url: "https://example.com/enders-game", genre: "science_fiction", summary: "Military sci-fi by Orson Scott Card" },
      { name: "A Game of Thrones", url: "https://example.com/game-of-thrones", genre: "fantasy", summary: "Epic fantasy by George R.R. Martin" },
      { name: "The Name of the Wind", url: "https://example.com/name-of-wind", genre: "fantasy", summary: "Fantasy novel by Patrick Rothfuss" },
      { name: "The Way of Kings", url: "https://example.com/way-of-kings", genre: "fantasy", summary: "Epic fantasy by Brandon Sanderson" },
      { name: "Good to Great", url: "https://example.com/good-to-great", genre: "business", summary: "Business strategy by Jim Collins" },
      { name: "The 4-Hour Workweek", url: "https://example.com/4-hour-workweek", genre: "business", summary: "Productivity guide by Timothy Ferriss" },
      { name: "Rich Dad Poor Dad", url: "https://example.com/rich-dad-poor-dad", genre: "business", summary: "Financial education by Robert Kiyosaki" },
      { name: "The Girl with the Dragon Tattoo", url: "https://example.com/dragon-tattoo", genre: "mystery", summary: "Crime thriller by Stieg Larsson" },
      { name: "And Then There Were None", url: "https://example.com/and-then-there-were-none", genre: "mystery", summary: "Mystery novel by Agatha Christie" },
      { name: "The Silence of the Lambs", url: "https://example.com/silence-of-lambs", genre: "thriller", summary: "Psychological thriller by Thomas Harris" },
      { name: "Beloved", url: "https://example.com/beloved", genre: "fiction", summary: "Historical fiction by Toni Morrison" },
      { name: "Moby Dick", url: "https://example.com/moby-dick", genre: "fiction", summary: "Classic novel by Herman Melville" },
      { name: "War and Peace", url: "https://example.com/war-and-peace", genre: "fiction", summary: "Epic novel by Leo Tolstoy" },
      { name: "Jane Eyre", url: "https://example.com/jane-eyre", genre: "romance", summary: "Gothic romance by Charlotte Brontë" },
      { name: "Wuthering Heights", url: "https://example.com/wuthering-heights", genre: "romance", summary: "Gothic novel by Emily Brontë" },
      { name: "Dracula", url: "https://example.com/dracula", genre: "horror", summary: "Gothic horror by Bram Stoker" },
      { name: "Frankenstein", url: "https://example.com/frankenstein", genre: "horror", summary: "Gothic novel by Mary Shelley" },
      { name: "The Color Purple", url: "https://example.com/color-purple", genre: "fiction", summary: "Novel by Alice Walker" },
      { name: "One Hundred Years of Solitude", url: "https://example.com/hundred-years-solitude", genre: "fiction", summary: "Magical realism by Gabriel García Márquez" },
      { name: "The Book Thief", url: "https://example.com/book-thief", genre: "fiction", summary: "Historical fiction by Markus Zusak" },
      { name: "The Odyssey", url: "https://example.com/odyssey", genre: "fiction", summary: "Epic poem by Homer" },
      { name: "The Picture of Dorian Gray", url: "https://example.com/dorian-gray", genre: "fiction", summary: "Philosophical novel by Oscar Wilde" },
      { name: "The Brothers Karamazov", url: "https://example.com/brothers-karamazov", genre: "philosophy", summary: "Philosophical novel by Fyodor Dostoevsky" },
      { name: "JavaScript: The Good Parts", url: "https://example.com/js-good-parts", genre: "programming", summary: "JavaScript guide by Douglas Crockford" },
      { name: "You Don't Know JS", url: "https://example.com/you-dont-know-js", genre: "programming", summary: "JavaScript series by Kyle Simpson" },
      { name: "Design Patterns", url: "https://example.com/design-patterns", genre: "programming", summary: "Software design by Gang of Four" },
      { name: "The Pragmatic Programmer", url: "https://example.com/pragmatic-programmer", genre: "programming", summary: "Programming guide by David Thomas and Andrew Hunt" }
    ];

    // Insert books
    console.log('📚 Seeding books...');
    const insertedBooks = [];
    
    for (let i = 0; i < booksData.length; i++) {
      const book = booksData[i];
      
      const result = await db.insert(books).values({
        name: book.name,
        url: book.url,
        genre: book.genre,
        summary: book.summary,
        posterUrl: faker.image.url({ width: 300, height: 400 }),
        userId: `user_${faker.number.int({ min: 1, max: 20 })}`,
        createdAt: faker.date.between({ 
          from: new Date('2023-01-01'), 
          to: new Date() 
        }),
        updatedAt: new Date()
      }).returning();
      
      insertedBooks.push(result[0]);
    }

    console.log(`✅ Successfully inserted ${insertedBooks.length} books!`);

    // Insert comments
    console.log('💬 Seeding comments...');
    const commentTemplates = [
      "This book completely changed my perspective!",
      "One of the best books I've read this year.",
      "Couldn't put it down. Highly recommend!",
      "The character development is phenomenal.",
      "This book made me think deeply about life.",
      "Perfect for anyone interested in this topic.",
      "Found this through a friend's recommendation - so glad I did!",
      "The plot twists kept me guessing.",
      "Beautiful writing and compelling characters.",
      "This book opened my eyes in ways I never expected."
    ];

    const userNames = [
      "Alex Chen", "Maria Rodriguez", "David Kim", "Sarah Johnson", "Michael Brown",
      "Emily Davis", "James Wilson", "Lisa Anderson", "Robert Taylor", "Jennifer Martinez",
      "Christopher Garcia", "Jessica Miller", "Daniel Jones", "Ashley Williams", "Matthew Lee"
    ];

    let totalComments = 0;
    
    for (const book of insertedBooks) {
      const numComments = faker.number.int({ min: 2, max: 8 });
      
      for (let i = 0; i < numComments; i++) {
        const template = faker.helpers.arrayElement(commentTemplates);
        const userName = faker.helpers.arrayElement(userNames);
        const userId = `user_${faker.number.int({ min: 1, max: 20 })}`;
        
        await db.insert(comments).values({
          bookId: book.id,
          content: template,
          userId: userId,
          authorName: userName,
          createdAt: faker.date.between({ 
            from: book.createdAt, 
            to: new Date() 
          })
        });
        
        totalComments++;
      }
    }

    console.log(`✅ Successfully inserted ${totalComments} comments!`);

    // Insert votes
    console.log('🗳️ Seeding votes...');
    let totalVotes = 0;
    
    for (const book of insertedBooks) {
      const numVotes = faker.number.int({ min: 5, max: 30 });
      
      for (let i = 0; i < numVotes; i++) {
        const userId = `user_${faker.number.int({ min: 1, max: 20 })}`;
        const voteType = faker.datatype.boolean(0.8) ? 'upvote' : 'downvote';
        
        try {
          await db.insert(votes).values({
            bookId: book.id,
            userId: userId,
            voteType: voteType,
            createdAt: faker.date.between({ 
              from: book.createdAt, 
              to: new Date() 
            })
          });
          totalVotes++;
        } catch (error) {
          // Ignore duplicate votes
        }
      }
    }

    console.log(`✅ Successfully inserted ${totalVotes} votes!`);

    // Print summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   📚 Books: ${insertedBooks.length}`);
    console.log(`   💬 Comments: ${totalComments}`);
    console.log(`   🗳️ Votes: ${totalVotes}`);
    console.log(`   👥 Users: 20`);
    
    console.log('\n📈 Statistics:');
    console.log(`   • Average comments per book: ${(totalComments / insertedBooks.length).toFixed(1)}`);
    console.log(`   • Average votes per book: ${(totalVotes / insertedBooks.length).toFixed(1)}`);
    
    console.log('\n🌟 Your BookNest database is now populated with comprehensive test data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };
