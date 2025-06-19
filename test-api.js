// Simple test script to verify API endpoints
// Run this after starting the dev server with: node test-api.js

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing BookNest API Endpoints...\n');

  try {
    // Test 1: Get all books (should be empty initially)
    console.log('1. Testing GET /api/books');
    const booksResponse = await fetch(`${BASE_URL}/api/books`);
    const books = await booksResponse.json();
    console.log('✅ Books endpoint working. Found books:', books.length);

    // Test 2: Create a new book
    console.log('\n2. Testing POST /api/books');
    const newBook = {
      name: 'JavaScript: The Good Parts',
      url: 'https://example.com/js-good-parts.pdf',
      posterUrl: 'https://example.com/poster.jpg',
      summary: 'A great book about JavaScript fundamentals',
      genre: 'Programming'
    };

    const createResponse = await fetch(`${BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook)
    });

    if (createResponse.ok) {
      const createdBook = await createResponse.json();
      console.log('✅ Book created successfully:', createdBook.name);
      
      // Test 3: Get the specific book
      console.log('\n3. Testing GET /api/books/[id]');
      const bookResponse = await fetch(`${BASE_URL}/api/books/${createdBook.id}`);
      const book = await bookResponse.json();
      console.log('✅ Individual book endpoint working:', book.name);

      // Test 4: Add a comment
      console.log('\n4. Testing POST /api/comments');
      const commentResponse = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: createdBook.id,
          content: 'Great book! Highly recommended.',
          authorName: 'Test User'
        })
      });

      if (commentResponse.ok) {
        console.log('✅ Comment added successfully');
      }

      // Test 5: Add a vote
      console.log('\n5. Testing POST /api/votes');
      const voteResponse = await fetch(`${BASE_URL}/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: createdBook.id,
          voteType: 'upvote'
        })
      });

      if (voteResponse.ok) {
        console.log('✅ Vote added successfully');
      }

      // Test 6: Get genres
      console.log('\n6. Testing GET /api/genres');
      const genresResponse = await fetch(`${BASE_URL}/api/genres`);
      const genres = await genresResponse.json();
      console.log('✅ Genres endpoint working. Available genres:', genres.length);

    } else {
      console.log('❌ Failed to create book');
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure to start the dev server first: pnpm dev');
  }
}

testAPI();
