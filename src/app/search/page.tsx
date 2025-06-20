"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCard } from '@/components/features/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  BookOpen,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ArrowRight
} from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SortOption = 'relevance' | 'trending' | 'recent' | 'popular' | 'title' | 'votes';
type ViewMode = 'grid' | 'list';

export default function SearchPage() {
  const { books, isLoading, isError, mutate } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [minVotes, setMinVotes] = useState<string>("");
  const [minComments, setMinComments] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");
  const router = useRouter();

  // Get unique genres
  const genres = useMemo(() => {
    if (!books) return [];
    return Array.from(new Set(books.map(book => book.genre).filter(Boolean))).sort();
  }, [books]);

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

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    // Apply votes filter
    if (minVotes) {
      const minVotesNum = parseInt(minVotes);
      filtered = filtered.filter(book => (book.upvotes || 0) >= minVotesNum);
    }

    // Apply comments filter
    if (minComments) {
      const minCommentsNum = parseInt(minComments);
      filtered = filtered.filter(book => (book.comments?.length || 0) >= minCommentsNum);
    }

    // Apply date range filter
    if (dateRange) {
      const now = Date.now();
      let cutoff = 0;
      switch (dateRange) {
        case 'day':
          cutoff = now - (24 * 60 * 60 * 1000);
          break;
        case 'week':
          cutoff = now - (7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoff = now - (30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          cutoff = now - (365 * 24 * 60 * 60 * 1000);
          break;
      }
      if (cutoff > 0) {
        filtered = filtered.filter(book => new Date(book.createdAt).getTime() > cutoff);
      }
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
      case 'votes':
        return filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      case 'title':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'relevance':
      default:
        return filtered;
    }
  }, [books, searchQuery, selectedGenre, sortBy, minVotes, minComments, dateRange]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSortBy('relevance');
    setMinVotes("");
    setMinComments("");
    setDateRange("");
  };

  const activeFiltersCount = [searchQuery, selectedGenre, minVotes, minComments, dateRange].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 space-y-8">
          <div className="text-center py-16 space-y-6">
            <div className="h-12 bg-muted/50 rounded-lg w-96 mx-auto animate-pulse"></div>
            <div className="h-6 bg-muted/50 rounded w-64 mx-auto animate-pulse"></div>
          </div>
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
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Advanced Search
          </h1>
          <p className="text-muted-foreground">
            Find exactly what you're looking for with our powerful search filters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                  </CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear ({activeFiltersCount})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Query</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search books, authors, genres..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Genre Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="All genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="votes">Most Voted</SelectItem>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All time</SelectItem>
                      <SelectItem value="day">Last 24 hours</SelectItem>
                      <SelectItem value="week">Last week</SelectItem>
                      <SelectItem value="month">Last month</SelectItem>
                      <SelectItem value="year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Min Votes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Votes</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minVotes}
                    onChange={(e) => setMinVotes(e.target.value)}
                    min="0"
                  />
                </div>

                {/* Min Comments */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Comments</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minComments}
                    onChange={(e) => setMinComments(e.target.value)}
                    min="0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {searchQuery ? `Results for "${searchQuery}"` : 'All Books'}
                </h2>
                <p className="text-muted-foreground">
                  {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {searchQuery}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                    </Badge>
                  )}
                  {selectedGenre && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Genre: {selectedGenre}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedGenre("")} />
                    </Badge>
                  )}
                  {minVotes && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Min votes: {minVotes}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setMinVotes("")} />
                    </Badge>
                  )}
                  {minComments && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Min comments: {minComments}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setMinComments("")} />
                    </Badge>
                  )}
                  {dateRange && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {dateRange === 'day' ? 'Last 24h' : dateRange === 'week' ? 'Last week' : dateRange === 'month' ? 'Last month' : 'Last year'}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setDateRange("")} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Results Grid */}
            <AnimatePresence mode="wait">
              {filteredBooks.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">No books found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or clear some filters
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
