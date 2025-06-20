"use client";

import { useCallback, useState, useMemo } from 'react';
import { BookCard } from '@/components/features/BookCard';
import { AddBookDialog } from '@/components/features/AddBookDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, TrendingUp, Clock, BookOpen } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SortOption = 'all' | 'trending' | 'recent';

export default function Home() {
  const { books, isLoading, isError, mutate } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('all');
  const router = useRouter();

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    if (!books) return [];
    
    let filtered = books;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'trending':
        return filtered.sort((a, b) => {
          const scoreA = (a.upvotes || 0) - (a.downvotes || 0) + (a.comments?.length || 0) * 0.5;
          const scoreB = (b.upvotes || 0) - (b.downvotes || 0) + (b.comments?.length || 0) * 0.5;
          return scoreB - scoreA;
        });
      case 'recent':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return filtered;
    }
  }, [books, searchQuery, sortBy]);

  const handleBookAdded = useCallback(() => {
    mutate();
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-full max-w-md animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-red-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">We couldn't load the books. Please try again later.</p>
          <Button onClick={() => mutate()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Books</h1>
          <p className="text-gray-600 text-sm">Find your next great read</p>
        </div>
        <AddBookDialog onBookAdded={handleBookAdded}>
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Share a Book
          </Button>
        </AddBookDialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('all')}
          >
            All
          </Button>
          <Button
            variant={sortBy === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('trending')}
            className="gap-1"
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </Button>
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
            className="gap-1"
          >
            <Clock className="h-4 w-4" />
            Recent
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex items-center gap-3">
        <Link href="/genres">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Browse Genres
          </Button>
        </Link>
        <Link href="/trending">
          <Button variant="outline" size="sm" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            Trending Page
          </Button>
        </Link>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onVoteSuccess={() => mutate()}
              onComment={(bookId) => router.push(`/books/${bookId}#comments`)}
            />
          ))}
        </div>
      ) : books && books.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-primary/10 rounded-full p-6 w-20 h-20 mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-primary mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No books yet</h2>
          <p className="text-gray-600 mb-6">Be the first to share an amazing book with the community!</p>
          <AddBookDialog onBookAdded={handleBookAdded}>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Share Your First Book
            </Button>
          </AddBookDialog>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-6">
            <Search className="h-8 w-8 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all books.</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
