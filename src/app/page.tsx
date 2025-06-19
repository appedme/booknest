import { Suspense } from 'react';

// Book interface
interface Book {
  id: number;
  name: string;
  url: string;
  posterUrl: string | null;
  summary: string | null;
  genre: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  comments: Array<{
    id: number;
    content: string;
    authorName: string | null;
    createdAt: string;
  }>;
}

// Server component to fetch books
async function BooksList() {
  try {
    const response = await fetch('http://localhost:3000/api/books', {
      cache: 'no-store' // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const books: Book[] = await response.json();

    if (books.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No books found</h2>
          <p className="text-gray-500">Be the first to share a book!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {book.posterUrl && (
              <img
                src={book.posterUrl}
                alt={book.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {book.genre}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>👍 {book.upvotes}</span>
                  <span>👎 {book.downvotes}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {book.name}
              </h3>

              {book.summary && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {book.summary}
                </p>
              )}

              <div className="flex items-center justify-between">
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  Read Book →
                </a>
                <span className="text-xs text-gray-400">
                  {book.comments.length} comments
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Error loading books</h2>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 BookNest</h1>
              <p className="ml-4 text-gray-600">Share and discover amazing books</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
              Add Book
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
              All Genres
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
              Programming
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
              Fiction
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
              Non-Fiction
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading books...</p>
          </div>
        }>
          <BooksList />
        </Suspense>
      </main>
    </div>
  );
}
