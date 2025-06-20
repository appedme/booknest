"use client";

import { useCallback, useState, useMemo } from 'react';
import { BookCard } from '@/components/features/BookCard';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container py-8 space-y-8">
          {/* Hero Skeleton */}
          <div className="text-center py-16 space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>

          {/* Books Skeleton */}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-red-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-8">We couldn't load the books. Please try again later.</p>
            <Button onClick={() => mutate()} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5">
                <Sparkles className="h-3 w-3 mr-1" />
                Discover Your Next Great Read
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
                Share & Discover
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Amazing Books</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Join thousands of book lovers sharing recommendations, discovering hidden gems, and building the ultimate reading community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AddBookDialog onBookAdded={handleBookAdded}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-3">
                  <Zap className="h-5 w-5 mr-2" />
                  Share Your Book
                </Button>
              </AddBookDialog>
              <Link href="/trending">
                <Button size="lg" variant="outline" className="border-2 hover:bg-gray-50 text-lg px-8 py-3">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Explore Trending
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-y border-gray-200 bg-white/70 backdrop-blur">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-white/80">
              <CardContent className="p-4 text-center">
                <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Books</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/80">
              <CardContent className="p-4 text-center">
                <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-2">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.thisWeek}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/80">
              <CardContent className="p-4 text-center">
                <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-2">
                  <Filter className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.genres}</div>
                <div className="text-sm text-gray-600">Genres</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/80">
              <CardContent className="p-4 text-center">
                <div className="bg-orange-100 rounded-full p-3 w-fit mx-auto mb-2">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalVotes}</div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container space-y-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search books, authors, or genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Button
                  variant={sortBy === 'all' ? 'default' : 'outline'}
                  onClick={() => setSortBy('all')}
                  className={sortBy === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                >
                  All
                </Button>
                <Button
                  variant={sortBy === 'trending' ? 'default' : 'outline'}
                  onClick={() => setSortBy('trending')}
                  className={`gap-1 ${sortBy === 'trending' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </Button>
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  onClick={() => setSortBy('recent')}
                  className={`gap-1 ${sortBy === 'recent' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
                >
                  <Clock className="h-4 w-4" />
                  Recent
                </Button>
                <Button
                  variant={sortBy === 'popular' ? 'default' : 'outline'}
                  onClick={() => setSortBy('popular')}
                  className={`gap-1 ${sortBy === 'popular' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
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
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">Quick access:</span>
              <Link href="/genres">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Filter className="h-3 w-3 mr-1" />
                  Browse Genres
                </Button>
              </Link>
              <Link href="/trending">
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending Books
                </Button>
              </Link>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results` : sortBy === 'all' ? 'All Books' : sortBy.charAt(0).toUpperCase() + sortBy.slice(1) + ' Books'}
              </h2>
              <p className="text-gray-600">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
          </div>

          {/* Books Grid/List */}
          {filteredBooks.length > 0 ? (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
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
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Start the Community</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Be the first to share an amazing book and help build our reading community!
              </p>
              <AddBookDialog onBookAdded={handleBookAdded}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
