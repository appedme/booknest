"use client";

import { useCallback, useState, useMemo } from 'react';
import { BookCard } from '@/components/features/BookCard';
import { TrendingBooks } from '@/components/features/TrendingBooks';
import { LatestBooks } from '@/components/features/LatestBooks';
import { CommunityHighlights } from '@/components/features/CommunityHighlights';
import { ActiveDiscussions } from '@/components/features/ActiveDiscussions';
import { AddBookDialog } from '@/components/features/AddBookDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  MessageCircle,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type SortOption = 'all' | 'trending' | 'recent' | 'popular';
type ViewMode = 'grid' | 'list';

export default function Home() {
  const { books, isLoading, isError, mutate } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
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
      case 'popular':
        return filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      default:
        return filtered;
    }
  }, [books, searchQuery, sortBy]);

  // Get stats
  const stats = useMemo(() => {
    if (!books) return { total: 0, thisWeek: 0, genres: 0, totalVotes: 0 };

    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const uniqueGenres = new Set(books.map(book => book.genre).filter(Boolean));

    return {
      total: books.length,
      thisWeek: books.filter(book => new Date(book.createdAt).getTime() > oneWeekAgo).length,
      genres: uniqueGenres.size,
      totalVotes: books.reduce((sum, book) => sum + (book.upvotes || 0) + (book.downvotes || 0), 0)
    };
  }, [books]);

  const handleBookAdded = useCallback(() => {
    mutate();
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 space-y-8">
          {/* Hero Skeleton */}
          <div className="text-center py-16 space-y-6">
            <div className="h-12 bg-muted/50 rounded-lg w-96 mx-auto animate-pulse"></div>
            <div className="h-6 bg-muted/50 rounded w-64 mx-auto animate-pulse"></div>
            <div className="h-10 bg-muted/50 rounded w-32 mx-auto animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
            ))}
          </div>

          {/* Books Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-muted/50 rounded-lg animate-pulse"></div>
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
            <h2 className="text-2xl font-semibold text-foreground mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-8">We couldn't load the books. Please try again later.</p>
            <Button onClick={() => mutate()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Trending Books Section */}
      <TrendingBooks 
        books={books || []} 
        onVoteSuccess={() => mutate()} 
        onComment={(bookId) => router.push(`/books/${bookId}#comments`)} 
      />

      {/* Latest Books Section */}
      <LatestBooks 
        books={books || []} 
        onVoteSuccess={() => mutate()} 
        onComment={(bookId) => router.push(`/books/${bookId}#comments`)} 
      />

      {/* Active Discussions Section */}
      <ActiveDiscussions books={books || []} />

      {/* Search and Filter Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-12 bg-muted/30"
      >
        <div className="container space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore All Books</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search through our entire collection or filter by your interests
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="border shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books, authors, or genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant={sortBy === 'all' ? 'default' : 'outline'}
                    onClick={() => setSortBy('all')}
                    className={`transition-all ${sortBy === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'hover:bg-accent/50'}`}
                  >
                    All
                  </Button>
                  <Button
                    variant={sortBy === 'trending' ? 'default' : 'outline'}
                    onClick={() => setSortBy('trending')}
                    className={`gap-1 transition-all ${sortBy === 'trending' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'hover:bg-accent/50'}`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </Button>
                  <Button
                    variant={sortBy === 'recent' ? 'default' : 'outline'}
                    onClick={() => setSortBy('recent')}
                    className={`gap-1 transition-all ${sortBy === 'recent' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'hover:bg-accent/50'}`}
                  >
                    <Clock className="h-4 w-4" />
                    Recent
                  </Button>
                  <Button
                    variant={sortBy === 'popular' ? 'default' : 'outline'}
                    onClick={() => setSortBy('popular')}
                    className={`gap-1 transition-all ${sortBy === 'popular' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'hover:bg-accent/50'}`}
                  >
                    <Star className="h-4 w-4" />
                    Popular
                  </Button>
                </div>

                {/* View Toggle */}
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

              {/* Quick Links */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Quick access:</span>
                <Link href="/genres">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                    <Filter className="h-3 w-3 mr-1" />
                    Browse Genres
                  </Button>
                </Link>
                <Link href="/trending">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending Books
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {searchQuery ? `Search Results` : sortBy === 'all' ? 'All Books' : sortBy.charAt(0).toUpperCase() + sortBy.slice(1) + ' Books'}
              </h3>
              <p className="text-muted-foreground">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
          </div>

          {/* Books Grid/List */}
          <AnimatePresence mode="wait">
            {filteredBooks.length > 0 ? (
              <motion.div 
                key="books-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
                }
              >
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BookCard
                      book={book}
                      onVoteSuccess={() => mutate()}
                      onComment={(bookId) => router.push(`/books/${bookId}#comments`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : books && books.length === 0 ? (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-primary mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Start the Community</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Be the first to share an amazing book and help build our reading community!
                </p>
                <AddBookDialog onBookAdded={handleBookAdded}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Share Your First Book
                  </Button>
                </AddBookDialog>
              </motion.div>
            ) : (
              <motion.div 
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-muted rounded-full p-6 w-20 h-20 mx-auto mb-6">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search terms or browse all books.</p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                  <Link href="/genres">
                    <Button variant="outline">
                      Browse Genres
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}
