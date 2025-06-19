import { Suspense } from 'react';
import { BookCard } from '@/components/features/BookCard';
import { AddBookDialog } from '@/components/features/AddBookDialog';
import { Button } from '@/components/ui/button';
import { BOOK_GENRES } from '@/constants/books';
import { Book } from '@/types';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

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
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No books yet</h2>
            <p className="text-gray-600 mb-8">Be the first to share an amazing book with the community!</p>
            <AddBookDialog onBookAdded={() => window.location.reload()} />
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onComment={(bookId) => {
              console.log('Comment:', bookId);
              // TODO: Implement comment modal
            }}
          />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <span className="text-2xl">😵</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">We couldn't load the books. Please try again later.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
}

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Discover Amazing Books
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Share, discover, and discuss the best books with our growing community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AddBookDialog onBookAdded={() => window.location.reload()} />
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <TrendingUp className="h-5 w-5 mr-2" />
                Explore Trending
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Sparkles className="h-4 w-4 mr-2" />
              All Books
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </Button>
            {BOOK_GENRES.slice(0, 5).map((genre) => (
              <Button key={genre} variant="outline" size="sm" className="hidden sm:inline-flex">
                {genre}
              </Button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        }>
          <BooksList />
        </Suspense>
      </main>
    </div>
  );
}
