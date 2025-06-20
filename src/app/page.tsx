"use client";

import { useCallback, useState } from 'react';
import { BookCard } from '@/components/features/BookCard';
import { AddBookDialog } from '@/components/features/AddBookDialog';
import { TrendingBooks } from '@/components/features/TrendingBooks';
import { LatestBooks } from '@/components/features/LatestBooks';
import { PopularBooks } from '@/components/features/PopularBooks';
import { GenreStats } from '@/components/features/GenreStats';
import { CommunityHighlights } from '@/components/features/CommunityHighlights';
import { ActiveDiscussions } from '@/components/features/ActiveDiscussions';
import { TopAuthors } from '@/components/features/TopAuthors';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Grid3X3,
  List
} from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';

type ViewMode = 'grid' | 'list';

export default function Home() {
  const { books, isLoading, isError, mutate } = useBooks();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const router = useRouter();

  const handleBookAdded = useCallback(() => {
    mutate();
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 space-y-8">
          {/* Books Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-destructive/10 rounded-full p-6 w-20 h-20 mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-destructive mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-8">We couldn't load the books. Please try again later.</p>
            <Button onClick={() => mutate()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <section className="py-8">
        <div className="container space-y-8">
          {/* Hero Sections */}
          {books && books.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content - 3 columns */}
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <TrendingBooks books={books} />
                  <LatestBooks books={books} />
                </div>
              </div>
              
              {/* Sidebar - 1 column */}
              <div className="space-y-6">
                <CommunityHighlights books={books} onBookAdded={handleBookAdded} />
                <ActiveDiscussions books={books} />
                <TopAuthors books={books} />
                <PopularBooks books={books} />
                <GenreStats books={books} />
              </div>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Books</h1>
              <p className="text-muted-foreground mt-1">
                {books?.length || 0} book{(books?.length || 0) !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Books Grid/List */}
          {books && books.length > 0 ? (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onVoteSuccess={() => mutate()}
                  onComment={(bookId: number) => router.push(`/books/${bookId}#comments`)}
                />
              ))}
            </div>
          ) : books && books.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-muted/50 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Start the Community</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Be the first to share an amazing book and help build our reading community!
              </p>
              <AddBookDialog onBookAdded={handleBookAdded}>
                <Button size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Share Your First Book
                </Button>
              </AddBookDialog>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
