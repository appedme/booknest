"use client";

import { useCallback } from 'react';
import { BookCard } from '@/components/features/BookCard';
import { AddBookDialog } from '@/components/features/AddBookDialog';
import { Button } from '@/components/ui/button';
import { BOOK_GENRES } from '@/constants/books';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';

// Client component to display books
function BooksList() {
  const { books, isLoading, isError, mutate } = useBooks();

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <span className="text-2xl">😵</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">We couldn't load the books. Please try again later.</p>
          <Button variant="outline" onClick={() => mutate()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-primary mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">No books yet</h2>
          <p className="text-muted-foreground mb-8">Be the first to share an amazing book with the community!</p>
          <AddBookDialog onBookAdded={() => mutate()} />
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
          onVoteSuccess={() => mutate()}
          onComment={(bookId) => {
            console.log('Comment:', bookId);
            // TODO: Implement comment modal
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { mutate } = useBooks();

  const handleBookAdded = useCallback(() => {
    mutate();
  }, [mutate]);
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Books
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              Share, discover, and discuss the best books with our growing community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AddBookDialog onBookAdded={handleBookAdded} />
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
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
            <Button variant="default" size="sm">
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
        <BooksList />
      </main>
    </div>
  );
}
