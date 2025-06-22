"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GoogleBookCard } from '@/components/features/GoogleBookCard';
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
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GENRES } from '@/lib/schema';
import { cn } from '@/lib/utils';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container py-8 space-y-8">
          <div className="text-center py-16 space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <div className="h-6 bg-muted/50 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-muted/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
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

          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Search Books
            </h1>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredBooks.length} books
            </Badge>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 bg-white/50 backdrop-blur-sm border border-white/20">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/70 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Filters:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {searchQuery}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                    </Badge>
                  )}
                  {selectedGenre && (
                    <Badge variant="secondary" className="gap-1">
                      Genre: {selectedGenre}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedGenre("")} />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 px-2 text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              <Separator />

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="bg-white/70">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Genres</SelectItem>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="bg-white/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="votes">Most Votes</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex-1"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">No books found</h3>
              <p className="text-gray-600 mb-8">
                {searchQuery || selectedGenre || minVotes || minComments || dateRange
                  ? "Try adjusting your search criteria or filters."
                  : "No books available at the moment."}
              </p>
              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid'
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1"
            )}>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <GoogleBookCard book={book} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
