import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { books, comments, commentLikes, votes } from '../src/lib/schema';
import { faker } from '@faker-js/faker';

// Enhanced sample data
const SAMPLE_BOOKS = [
  // Programming & Tech
  { title: "Clean Code", author: "Robert C. Martin", genre: "Programming", description: "A handbook of agile software craftsmanship that teaches the principles of writing clean, readable code.", isbn: "9780132350884", publishedYear: 2008, poster: "https://images-na.ssl-images-amazon.com/images/I/41SH-SvWPxL._SX376_BO1,204,203,200_.jpg" },
  { title: "The Pragmatic Programmer", author: "David Thomas, Andrew Hunt", genre: "Programming", description: "Your journey to mastery. A classic guide for programmers looking to improve their craft.", isbn: "9780201616224", publishedYear: 1999, poster: "https://images-na.ssl-images-amazon.com/images/I/41BKx1AxQWL._SX396_BO1,204,203,200_.jpg" },
  { title: "Design Patterns", author: "Erich Gamma", genre: "Programming", description: "Elements of reusable object-oriented software. The foundation of modern software design patterns.", isbn: "9780201633610", publishedYear: 1994, poster: "https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg" },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", genre: "Programming", description: "Unearthing the excellence in JavaScript. A concise guide to the beautiful parts of JavaScript.", isbn: "9780596517748", publishedYear: 2008, poster: "https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg" },
  { title: "You Don't Know JS", author: "Kyle Simpson", genre: "Programming", description: "A book series diving deep into the core mechanisms of the JavaScript language.", isbn: "9781491924464", publishedYear: 2014, poster: "https://images-na.ssl-images-amazon.com/images/I/41T5H8u7fUL._SX331_BO1,204,203,200_.jpg" },
  
  // Fiction
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", description: "A classic American novel about the Jazz Age and the American Dream.", isbn: "9780743273565", publishedYear: 1925, poster: "https://images-na.ssl-images-amazon.com/images/I/51XlneyU5FL._SX326_BO1,204,203,200_.jpg" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", description: "A gripping tale of racial injustice and lost innocence in the American South.", isbn: "9780060935467", publishedYear: 1960, poster: "https://images-na.ssl-images-amazon.com/images/I/51IXWZzlgSL._SX330_BO1,204,203,200_.jpg" },
  { title: "1984", author: "George Orwell", genre: "Fiction", description: "A dystopian social science fiction novel about totalitarian control.", isbn: "9780451524935", publishedYear: 1949, poster: "https://images-na.ssl-images-amazon.com/images/I/51Dl7UcaQVL._SX326_BO1,204,203,200_.jpg" },
  { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", description: "A romantic novel of manners set in Georgian England.", isbn: "9780141439518", publishedYear: 1813, poster: "https://images-na.ssl-images-amazon.com/images/I/51wScUt0gHL._SX324_BO1,204,203,200_.jpg" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", description: "A controversial novel about teenage rebellion and alienation.", isbn: "9780316769174", publishedYear: 1951, poster: "https://images-na.ssl-images-amazon.com/images/I/53icJTwegaL._SX324_BO1,204,203,200_.jpg" },
  
  // Science Fiction
  { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", description: "An epic space opera set in the distant future amidst a feudal interstellar society.", isbn: "9780441013593", publishedYear: 1965, poster: "https://images-na.ssl-images-amazon.com/images/I/51iqKuN5XWL._SX331_BO1,204,203,200_.jpg" },
  { title: "Foundation", author: "Isaac Asimov", genre: "Science Fiction", description: "The first book in the groundbreaking Foundation series about the fall and rise of galactic civilization.", isbn: "9780553293357", publishedYear: 1951, poster: "https://images-na.ssl-images-amazon.com/images/I/51H1gZWOKwL._SX305_BO1,204,203,200_.jpg" },
  { title: "Neuromancer", author: "William Gibson", genre: "Science Fiction", description: "The seminal cyberpunk novel that defined a genre.", isbn: "9780441569595", publishedYear: 1984, poster: "https://images-na.ssl-images-amazon.com/images/I/51iaXhP8zsL._SX308_BO1,204,203,200_.jpg" },
  { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", genre: "Science Fiction", description: "A comedic science fiction series following Arthur Dent's adventures through space.", isbn: "9780345391803", publishedYear: 1979, poster: "https://images-na.ssl-images-amazon.com/images/I/51MzUz8rQcL._SX305_BO1,204,203,200_.jpg" },
  { title: "Ender's Game", author: "Orson Scott Card", genre: "Science Fiction", description: "A military science fiction novel about child soldiers trained to fight an alien invasion.", isbn: "9780812550702", publishedYear: 1985, poster: "https://images-na.ssl-images-amazon.com/images/I/51X7lwJOWJL._SX304_BO1,204,203,200_.jpg" },
  
  // Fantasy
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", description: "An epic high fantasy adventure following the quest to destroy the One Ring.", isbn: "9780544003415", publishedYear: 1954, poster: "https://images-na.ssl-images-amazon.com/images/I/51EstVXM8aL._SX331_BO1,204,203,200_.jpg" },
  { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", genre: "Fantasy", description: "The first book in the beloved series about a young wizard's adventures.", isbn: "9780439708180", publishedYear: 1997, poster: "https://images-na.ssl-images-amazon.com/images/I/51HSkTKlauL._SX346_BO1,204,203,200_.jpg" },
  { title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", description: "The first book in the epic Song of Ice and Fire series.", isbn: "9780553103540", publishedYear: 1996, poster: "https://images-na.ssl-images-amazon.com/images/I/51VFVyGqypL._SX331_BO1,204,203,200_.jpg" },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", description: "The first book in the Kingkiller Chronicle series.", isbn: "9780756404079", publishedYear: 2007, poster: "https://images-na.ssl-images-amazon.com/images/I/51-A-hb-f6L._SX331_BO1,204,203,200_.jpg" },
  { title: "The Way of Kings", author: "Brandon Sanderson", genre: "Fantasy", description: "The first book in the epic Stormlight Archive series.", isbn: "9780765365279", publishedYear: 2010, poster: "https://images-na.ssl-images-amazon.com/images/I/51Z8UcJ8d+L._SX331_BO1,204,203,200_.jpg" },
  
  // Non-Fiction
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "History", description: "A brief history of humankind exploring how Homo sapiens conquered the world.", isbn: "9780062316097", publishedYear: 2014, poster: "https://images-na.ssl-images-amazon.com/images/I/51Sn8PEXwcL._SX329_BO1,204,203,200_.jpg" },
  { title: "Educated", author: "Tara Westover", genre: "Memoir", description: "A powerful memoir about education, family, and the transformative power of learning.", isbn: "9780399590504", publishedYear: 2018, poster: "https://images-na.ssl-images-amazon.com/images/I/51JLnGz7V7L._SX329_BO1,204,203,200_.jpg" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Psychology", description: "An exploration of the two systems that drive the way we think.", isbn: "9780374533557", publishedYear: 2011, poster: "https://images-na.ssl-images-amazon.com/images/I/41wI53Hq-rL._SX329_BO1,204,203,200_.jpg" },
  { title: "The Power of Now", author: "Eckhart Tolle", genre: "Self-Help", description: "A guide to spiritual enlightenment through living in the present moment.", isbn: "9781577314806", publishedYear: 1997, poster: "https://images-na.ssl-images-amazon.com/images/I/51BMOOFMsWL._SX331_BO1,204,203,200_.jpg" },
  { title: "Atomic Habits", author: "James Clear", genre: "Self-Help", description: "An easy and proven way to build good habits and break bad ones.", isbn: "9780735211292", publishedYear: 2018, poster: "https://images-na.ssl-images-amazon.com/images/I/51Tlm0GZTXL._SX329_BO1,204,203,200_.jpg" },
  
  // Business & Economics
  { title: "The Lean Startup", author: "Eric Ries", genre: "Business", description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.", isbn: "9780307887894", publishedYear: 2011, poster: "https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX325_BO1,204,203,200_.jpg" },
  { title: "Zero to One", author: "Peter Thiel", genre: "Business", description: "Notes on startups, or how to build the future.", isbn: "9780804139298", publishedYear: 2014, poster: "https://images-na.ssl-images-amazon.com/images/I/51T-sMqSMiL._SX329_BO1,204,203,200_.jpg" },
  { title: "Good to Great", author: "Jim Collins", genre: "Business", description: "Why some companies make the leap... and others don't.", isbn: "9780066620992", publishedYear: 2001, poster: "https://images-na.ssl-images-amazon.com/images/I/51iyJqfUhOL._SX329_BO1,204,203,200_.jpg" },
  { title: "The 4-Hour Workweek", author: "Timothy Ferriss", genre: "Business", description: "Escape 9-5, live anywhere, and join the new rich.", isbn: "9780307465351", publishedYear: 2007, poster: "https://images-na.ssl-images-amazon.com/images/I/51KwJOvkS4L._SX331_BO1,204,203,200_.jpg" },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "Finance", description: "What the rich teach their kids about money that the poor and middle class do not.", isbn: "9781612680194", publishedYear: 1997, poster: "https://images-na.ssl-images-amazon.com/images/I/51wOOMQ+dQL._SX330_BO1,204,203,200_.jpg" },
  
  // Mystery & Thriller
  { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Mystery", description: "A gripping thriller about a journalist and a hacker investigating a dark family secret.", isbn: "9780307269751", publishedYear: 2005, poster: "https://images-na.ssl-images-amazon.com/images/I/41l8XQL6hzL._SX327_BO1,204,203,200_.jpg" },
  { title: "Gone Girl", author: "Gillian Flynn", genre: "Thriller", description: "A psychological thriller about a marriage gone terribly wrong.", isbn: "9780307588364", publishedYear: 2012, poster: "https://images-na.ssl-images-amazon.com/images/I/41CdOc8jfEL._SX325_BO1,204,203,200_.jpg" },
  { title: "The Da Vinci Code", author: "Dan Brown", genre: "Mystery", description: "A mystery thriller that follows symbologist Robert Langdon.", isbn: "9780307474278", publishedYear: 2003, poster: "https://images-na.ssl-images-amazon.com/images/I/41qNKjNb6dL._SX329_BO1,204,203,200_.jpg" },
  { title: "And Then There Were None", author: "Agatha Christie", genre: "Mystery", description: "Ten strangers are invited to an island where they are murdered one by one.", isbn: "9780062073488", publishedYear: 1939, poster: "https://images-na.ssl-images-amazon.com/images/I/51gQEqSGCaL._SX284_BO1,204,203,200_.jpg" },
  { title: "The Silence of the Lambs", author: "Thomas Harris", genre: "Thriller", description: "A young FBI cadet must gain the trust of Dr. Hannibal Lecter to catch a serial killer.", isbn: "9780312924584", publishedYear: 1988, poster: "https://images-na.ssl-images-amazon.com/images/I/41xHFQT53bL._SX280_BO1,204,203,200_.jpg" },
  
  // Additional diverse books to reach 50+
  { title: "The Alchemist", author: "Paulo Coelho", genre: "Philosophy", description: "A philosophical novel about a shepherd's journey to find treasure.", isbn: "9780061122415", publishedYear: 1988, poster: "https://images-na.ssl-images-amazon.com/images/I/41pR3YTKVvL._SX323_BO1,204,203,200_.jpg" },
  { title: "Life of Pi", author: "Yann Martel", genre: "Adventure", description: "A young man's survival story with a Bengal tiger on a lifeboat.", isbn: "9780156027328", publishedYear: 2001, poster: "https://images-na.ssl-images-amazon.com/images/I/51T9a5bFjNL._SX329_BO1,204,203,200_.jpg" },
  { title: "The Kite Runner", author: "Khaled Hosseini", genre: "Drama", description: "A story of friendship, betrayal, and redemption set in Afghanistan.", isbn: "9781573222457", publishedYear: 2003, poster: "https://images-na.ssl-images-amazon.com/images/I/51OVpyC5PML._SX329_BO1,204,203,200_.jpg" },
  { title: "Beloved", author: "Toni Morrison", genre: "Literary Fiction", description: "A haunting novel about slavery and its aftermath.", isbn: "9781400033416", publishedYear: 1987, poster: "https://images-na.ssl-images-amazon.com/images/I/51-v6YfYTHL._SX333_BO1,204,203,200_.jpg" },
  { title: "The Handmaid's Tale", author: "Margaret Atwood", genre: "Dystopian", description: "A dystopian novel about a totalitarian society and reproductive rights.", isbn: "9780385490818", publishedYear: 1985, poster: "https://images-na.ssl-images-amazon.com/images/I/51p7ZgpghuL._SX327_BO1,204,203,200_.jpg" },
  
  // More recent bestsellers and diverse genres
  { title: "Where the Crawdads Sing", author: "Delia Owens", genre: "Mystery", description: "A coming-of-age murder mystery set in the marshlands of North Carolina.", isbn: "9780735219090", publishedYear: 2018, poster: "https://images-na.ssl-images-amazon.com/images/I/51iqZZwDp5L._SX327_BO1,204,203,200_.jpg" },
  { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", genre: "Romance", description: "A reclusive Hollywood icon tells her life story to an unknown journalist.", isbn: "9781501161933", publishedYear: 2017, poster: "https://images-na.ssl-images-amazon.com/images/I/41jjvkCGtYL._SX327_BO1,204,203,200_.jpg" },
  { title: "Becoming", author: "Michelle Obama", genre: "Memoir", description: "The former First Lady's deeply personal memoir.", isbn: "9781524763138", publishedYear: 2018, poster: "https://images-na.ssl-images-amazon.com/images/I/51wJlImTpHL._SX329_BO1,204,203,200_.jpg" },
  { title: "The Midnight Library", author: "Matt Haig", genre: "Philosophy", description: "A novel about life's infinite possibilities and second chances.", isbn: "9780525559474", publishedYear: 2020, poster: "https://images-na.ssl-images-amazon.com/images/I/51B+uYX5c4L._SX329_BO1,204,203,200_.jpg" },
  { title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction", description: "A lone astronaut must save humanity in this hard science fiction novel.", isbn: "9780593135204", publishedYear: 2021, poster: "https://images-na.ssl-images-amazon.com/images/I/51v1LPHfU3L._SX329_BO1,204,203,200_.jpg" },
  
  // Classic literature
  { title: "Moby Dick", author: "Herman Melville", genre: "Classic", description: "The epic tale of Captain Ahab's obsessive quest for the white whale.", isbn: "9780142437247", publishedYear: 1851, poster: "https://images-na.ssl-images-amazon.com/images/I/51qrnhWfFEL._SX329_BO1,204,203,200_.jpg" },
  { title: "War and Peace", author: "Leo Tolstoy", genre: "Classic", description: "An epic novel chronicling the history of the French invasion of Russia.", isbn: "9780307266934", publishedYear: 1869, poster: "https://images-na.ssl-images-amazon.com/images/I/51pAW8MfQVL._SX326_BO1,204,203,200_.jpg" },
  { title: "Jane Eyre", author: "Charlotte Brontë", genre: "Classic", description: "The story of an orphaned girl who becomes a governess and falls in love.", isbn: "9780141441146", publishedYear: 1847, poster: "https://images-na.ssl-images-amazon.com/images/I/51O4cjdImtL._SX324_BO1,204,203,200_.jpg" },
  { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", genre: "Classic", description: "A philosophical novel about faith, doubt, and reason.", isbn: "9780374528379", publishedYear: 1880, poster: "https://images-na.ssl-images-amazon.com/images/I/51c-QYGDKoL._SX329_BO1,204,203,200_.jpg" },
  { title: "Wuthering Heights", author: "Emily Brontë", genre: "Classic", description: "A tale of passionate love and destructive obsession.", isbn: "9780141439556", publishedYear: 1847, poster: "https://images-na.ssl-images-amazon.com/images/I/51x+PuZvPML._SX324_BO1,204,203,200_.jpg" },
  
  // Horror
  { title: "The Shining", author: "Stephen King", genre: "Horror", description: "A psychological horror novel about a family isolated in a haunted hotel.", isbn: "9780307743657", publishedYear: 1977, poster: "https://images-na.ssl-images-amazon.com/images/I/51W1xF7YHDL._SX329_BO1,204,203,200_.jpg" },
  { title: "Dracula", author: "Bram Stoker", genre: "Horror", description: "The classic vampire novel that defined the genre.", isbn: "9780486411095", publishedYear: 1897, poster: "https://images-na.ssl-images-amazon.com/images/I/51RIjDfaXVL._SX331_BO1,204,203,200_.jpg" },
  { title: "Frankenstein", author: "Mary Shelley", genre: "Horror", description: "The story of Victor Frankenstein and his monstrous creation.", isbn: "9780486282114", publishedYear: 1818, poster: "https://images-na.ssl-images-amazon.com/images/I/51QQ8xJdOaL._SX331_BO1,204,203,200_.jpg" },
  
  // More diverse contemporary fiction
  { title: "The Color Purple", author: "Alice Walker", genre: "Literary Fiction", description: "An epistolary novel about the life of African American women in the early 20th century South.", isbn: "9780156028356", publishedYear: 1982, poster: "https://images-na.ssl-images-amazon.com/images/I/51z4HdTOC7L._SX327_BO1,204,203,200_.jpg" },
  { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", genre: "Magical Realism", description: "A multi-generational story of the Buendía family in the fictional town of Macondo.", isbn: "9780060883287", publishedYear: 1967, poster: "https://images-na.ssl-images-amazon.com/images/I/51-rW3lOXsL._SX329_BO1,204,203,200_.jpg" },
  { title: "The Book Thief", author: "Markus Zusak", genre: "Historical Fiction", description: "A story narrated by Death about a young girl living with foster parents in Nazi Germany.", isbn: "9780375842207", publishedYear: 2005, poster: "https://images-na.ssl-images-amazon.com/images/I/51fX0VFsNkL._SX329_BO1,204,203,200_.jpg" }
];

const USER_NAMES = [
  "Alex Chen", "Maria Rodriguez", "David Kim", "Sarah Johnson", "Michael Brown",
  "Emily Davis", "James Wilson", "Lisa Anderson", "Robert Taylor", "Jennifer Martinez",
  "Christopher Garcia", "Jessica Miller", "Daniel Jones", "Ashley Williams", "Matthew Lee",
  "Amanda Thomas", "Joshua Jackson", "Nicole White", "Andrew Harris", "Stephanie Clark",
  "Kevin Lewis", "Rebecca Robinson", "Brian Walker", "Michelle Hall", "Brandon Young",
  "Samantha Allen", "Tyler King", "Kimberly Wright", "Justin Scott", "Rachel Green",
  "Jonathan Adams", "Lauren Baker", "Ryan Nelson", "Megan Carter", "Nicholas Mitchell",
  "Hannah Perez", "Jacob Roberts", "Elizabeth Turner", "Alexander Phillips", "Victoria Campbell",
  "Nathan Parker", "Grace Evans", "Ethan Edwards", "Chloe Collins", "Mason Stewart",
  "Ava Sanchez", "Logan Morris", "Zoe Reed", "Lucas Cook", "Lily Bailey"
];

const COMMENT_TEMPLATES = [
  "This book completely changed my perspective on {topic}. Highly recommend!",
  "One of the best {genre} books I've read this year. {author} really knows how to craft a story.",
  "I couldn't put this down! Read it in one sitting.",
  "The character development in this book is absolutely phenomenal.",
  "This book made me laugh, cry, and think deeply about life.",
  "Perfect for anyone interested in {topic}. Very well written and engaging.",
  "I found this book through a friend's recommendation and I'm so glad I did!",
  "The plot twists in this book kept me guessing until the very end.",
  "Beautiful prose and compelling characters. A must-read!",
  "This book opened my eyes to {topic} in ways I never expected.",
  "Fascinating read! The author's expertise really shows through.",
  "I've read this book multiple times and discover something new each time.",
  "Great introduction to {topic} for beginners.",
  "The world-building in this book is incredible.",
  "Emotional and thought-provoking. Still thinking about it weeks later.",
  "Couldn't have asked for a better ending to this series.",
  "This book challenged my assumptions and made me think differently.",
  "Perfect balance of entertainment and education.",
  "The author's writing style is both accessible and profound.",
  "A timeless classic that everyone should read at least once."
];

const REPLY_TEMPLATES = [
  "I completely agree! This book really resonated with me too.",
  "Interesting perspective! I hadn't thought about it that way.",
  "Thanks for the recommendation - adding this to my reading list!",
  "I felt the same way about the ending. So satisfying!",
  "Have you read any other books by this author?",
  "This review convinced me to pick up this book. Thank you!",
  "I had a different interpretation of that character, but I love hearing other viewpoints.",
  "The themes in this book are so relevant to today's world.",
  "I wish more people would read this book. It's truly special.",
  "Your review perfectly captures why I love this book so much.",
  "I'm curious - what did you think about the subplot with {character}?",
  "This book has been on my wishlist forever. Your review pushed me to finally read it!",
  "I recommended this to my book club based on reviews like yours.",
  "The way you described this makes me want to reread it again.",
  "Such a thoughtful analysis. Thanks for sharing your insights!"
];

async function seedDatabase() {
  // Initialize database
  const sqlite = new Database('./local.db');
  const db = drizzle(sqlite);

  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(commentLikes);
    await db.delete(comments);
    await db.delete(votes);
    await db.delete(bookmarks);
    await db.delete(books);

    // Seed books
    console.log('📚 Seeding books...');
    const insertedBooks = [];
    
    for (let i = 0; i < SAMPLE_BOOKS.length; i++) {
      const book = SAMPLE_BOOKS[i];
      const userName = USER_NAMES[i % USER_NAMES.length];
      
      const insertedBook = await db.insert(books).values({
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        poster: book.poster,
        userId: `user_${i % 25 + 1}`, // Distribute across 25 users
        userName: userName,
        upvotes: faker.number.int({ min: 0, max: 150 }),
        downvotes: faker.number.int({ min: 0, max: 20 }),
        createdAt: faker.date.between({ 
          from: new Date('2023-01-01'), 
          to: new Date() 
        }).toISOString(),
        updatedAt: new Date().toISOString()
      }).returning();
      
      insertedBooks.push(insertedBook[0]);
      
      if (i % 10 === 0) {
        console.log(`   📖 Inserted ${i + 1}/${SAMPLE_BOOKS.length} books...`);
      }
    }

    console.log(`✅ Successfully inserted ${insertedBooks.length} books!`);

    // Seed comments
    console.log('💬 Seeding comments...');
    const insertedComments = [];
    
    for (const book of insertedBooks) {
      const numComments = faker.number.int({ min: 1, max: 8 });
      
      for (let i = 0; i < numComments; i++) {
        const commenterIndex = faker.number.int({ min: 0, max: USER_NAMES.length - 1 });
        const commenterName = USER_NAMES[commenterIndex];
        
        const template = faker.helpers.arrayElement(COMMENT_TEMPLATES);
        const content = template
          .replace('{topic}', book.genre.toLowerCase())
          .replace('{genre}', book.genre.toLowerCase())
          .replace('{author}', book.author.split(' ')[0]);
        
        const comment = await db.insert(comments).values({
          bookId: book.id,
          content: content,
          userId: `user_${commenterIndex + 1}`,
          userName: commenterName,
          parentId: null,
          createdAt: faker.date.between({ 
            from: new Date(book.createdAt), 
            to: new Date() 
          }).toISOString(),
          updatedAt: new Date().toISOString()
        }).returning();
        
        insertedComments.push(comment[0]);
        
        // Add some replies
        const numReplies = faker.number.int({ min: 0, max: 3 });
        for (let j = 0; j < numReplies; j++) {
          const replierIndex = faker.number.int({ min: 0, max: USER_NAMES.length - 1 });
          const replierName = USER_NAMES[replierIndex];
          
          const replyTemplate = faker.helpers.arrayElement(REPLY_TEMPLATES);
          const replyContent = replyTemplate
            .replace('{character}', faker.person.firstName());
          
          const reply = await db.insert(comments).values({
            bookId: book.id,
            content: replyContent,
            userId: `user_${replierIndex + 1}`,
            userName: replierName,
            parentId: comment[0].id,
            createdAt: faker.date.between({ 
              from: new Date(comment[0].createdAt), 
              to: new Date() 
            }).toISOString(),
            updatedAt: new Date().toISOString()
          }).returning();
          
          insertedComments.push(reply[0]);
        }
      }
    }

    console.log(`✅ Successfully inserted ${insertedComments.length} comments and replies!`);

    // Seed comment likes
    console.log('👍 Seeding comment likes...');
    let likeCount = 0;
    
    for (const comment of insertedComments) {
      const numLikes = faker.number.int({ min: 0, max: 15 });
      
      for (let i = 0; i < numLikes; i++) {
        const likerIndex = faker.number.int({ min: 0, max: USER_NAMES.length - 1 });
        
        try {
          await db.insert(commentLikes).values({
            commentId: comment.id,
            userId: `user_${likerIndex + 1}`,
            isLike: faker.datatype.boolean(0.8), // 80% likes, 20% dislikes
            createdAt: faker.date.between({ 
              from: new Date(comment.createdAt), 
              to: new Date() 
            }).toISOString()
          });
          likeCount++;
        } catch (error) {
          // Ignore duplicate key errors (same user liking same comment twice)
        }
      }
    }

    console.log(`✅ Successfully inserted ${likeCount} comment likes!`);

    // Seed votes
    console.log('🗳️ Seeding book votes...');
    let voteCount = 0;
    
    for (const book of insertedBooks) {
      const numVotes = faker.number.int({ min: 5, max: 30 });
      
      for (let i = 0; i < numVotes; i++) {
        const voterIndex = faker.number.int({ min: 0, max: USER_NAMES.length - 1 });
        
        try {
          await db.insert(votes).values({
            bookId: book.id,
            userId: `user_${voterIndex + 1}`,
            voteType: faker.datatype.boolean(0.85) ? 'up' : 'down', // 85% upvotes
            createdAt: faker.date.between({ 
              from: new Date(book.createdAt), 
              to: new Date() 
            }).toISOString()
          });
          voteCount++;
        } catch (error) {
          // Ignore duplicate key errors
        }
      }
    }

    console.log(`✅ Successfully inserted ${voteCount} votes!`);

    // Seed bookmarks
    console.log('🔖 Seeding bookmarks...');
    let bookmarkCount = 0;
    
    for (const book of insertedBooks) {
      const numBookmarks = faker.number.int({ min: 0, max: 12 });
      
      for (let i = 0; i < numBookmarks; i++) {
        const bookmarkerIndex = faker.number.int({ min: 0, max: USER_NAMES.length - 1 });
        
        try {
          await db.insert(bookmarks).values({
            bookId: book.id,
            userId: `user_${bookmarkerIndex + 1}`,
            createdAt: faker.date.between({ 
              from: new Date(book.createdAt), 
              to: new Date() 
            }).toISOString()
          });
          bookmarkCount++;
        } catch (error) {
          // Ignore duplicate key errors
        }
      }
    }

    console.log(`✅ Successfully inserted ${bookmarkCount} bookmarks!`);

    // Print summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeding Summary:');
    console.log(`   📚 Books: ${insertedBooks.length}`);
    console.log(`   💬 Comments & Replies: ${insertedComments.length}`);
    console.log(`   👍 Comment Likes: ${likeCount}`);
    console.log(`   🗳️ Book Votes: ${voteCount}`);
    console.log(`   🔖 Bookmarks: ${bookmarkCount}`);
    console.log(`   👥 Unique Users: ${USER_NAMES.length}`);
    
    console.log('\n📈 Database Statistics:');
    console.log(`   • Average comments per book: ${(insertedComments.length / insertedBooks.length).toFixed(1)}`);
    console.log(`   • Average likes per comment: ${(likeCount / insertedComments.length).toFixed(1)}`);
    console.log(`   • Average votes per book: ${(voteCount / insertedBooks.length).toFixed(1)}`);
    console.log(`   • Average bookmarks per book: ${(bookmarkCount / insertedBooks.length).toFixed(1)}`);
    
    console.log('\n🌟 Your BookNest database is now populated with rich, realistic data!');
    console.log('   Start your development server to explore the seeded content.');

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
