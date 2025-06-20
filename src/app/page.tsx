"use client";

import { useCallback, useState, useMemo } from 'react';
import { BookCard } from '@/components/features/BookCard';
import { TrendingBooks } from '@/components/features/TrendingBooks';
import { LatestBooks } from '@/components/features/LatestBooks';
import { CommunityHighlights } from '@/components/features/CommunityHighlights';
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
  Star,
  ArrowRight,
  Heart,
  MessageCircle,
  Grid3X3,
  List
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
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-8">
            {/* Community Highlights Section */}
            <CommunityHighlights books={books || []} />

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

            {/* Search and Filter Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border rounded-xl p-6"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Explore All Books</h2>
                  <p className="text-muted-foreground">
                    Search through our entire collection or filter by your interests
                  </p>
                </div>

                {/* Search and Filters */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search books, authors, or genres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                    <Link href="/search">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Advanced Search
                      </Button>
                    </Link>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Button
                      variant={sortBy === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('all')}
                      className={sortBy === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                    >
                      All
                    </Button>
                    <Button
                      variant={sortBy === 'trending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('trending')}
                      className={sortBy === 'trending' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Trending
                    </Button>
                    <Button
                      variant={sortBy === 'recent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('recent')}
                      className={sortBy === 'recent' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Recent
                    </Button>
                    <Button
                      variant={sortBy === 'popular' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('popular')}
                      className={sortBy === 'popular' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Popular
                    </Button>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center justify-between">
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
                    <div className="text-sm text-muted-foreground">
                      {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                      {searchQuery && ` for "${searchQuery}"`}
                    </div>
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
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                        : "space-y-4"
                      }
                    >
                      {filteredBooks.slice(0, 6).map((book, index) => (
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
                      className="text-center py-8"
                    >
                      <div className="bg-muted rounded-full p-6 w-16 h-16 mx-auto mb-4">
                        <Search className="h-6 w-6 text-muted-foreground mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your search terms.</p>
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {filteredBooks.length > 6 && (
                  <div className="text-center pt-4">
                    <Link href="/search">
                      <Button variant="outline" className="hover:bg-primary/10">
                        View All Results
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search Bar */}
              <div className="bg-card border rounded-xl p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search books, authors, or genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              {/* Active Discussions */}
              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-foreground">Active Discussions</h3>
                  </div>
                  <div className="space-y-3">
                    {books?.filter(book => (book.comments?.length || 0) > 0)
                      .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
                      .slice(0, 3)
                      .map((book) => (
                        <Link key={book.id} href={`/books/${book.id}`}>
                          <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">{book.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MessageCircle className="h-3 w-3" />
                              <span>{book.comments?.length || 0} comments</span>
                              <Badge variant="secondary" className="text-xs">{book.genre}</Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Rankings */}
              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-foreground">Trending Books</h3>
                  </div>
                  <div className="space-y-3">
                    {books?.sort((a, b) => {
                      const scoreA = (a.upvotes || 0) - (a.downvotes || 0) + (a.comments?.length || 0) * 0.5;
                      const scoreB = (b.upvotes || 0) - (b.downvotes || 0) + (b.comments?.length || 0) * 0.5;
                      return scoreB - scoreA;
                    })
                      .slice(0, 3)
                      .map((book, index) => (
                        <Link key={book.id} href={`/books/${book.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">{book.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Heart className="h-3 w-3" />
                                <span>{(book.upvotes || 0) - (book.downvotes || 0)}</span>
                                <Badge variant="secondary" className="text-xs">{book.genre}</Badge>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold text-foreground">Trending Topics</h3>
                  </div>
                  <div className="space-y-2">
                    {Array.from(new Set(books?.map(book => book.genre).filter(Boolean)))
                      .slice(0, 6)
                      .map((genre) => {
                        const genreCount = books?.filter(book => book.genre === genre).length || 0;
                        return (
                          <Link key={genre} href={`/genres?filter=${genre}`}>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                              <span className="text-sm font-medium">#{genre}</span>
                              <Badge variant="outline" className="text-xs">{genreCount}</Badge>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <AddBookDialog onBookAdded={handleBookAdded}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Share a Book
                      </Button>
                    </AddBookDialog>
                    <Link href="/genres">
                      <Button variant="outline" className="w-full">
                        <Filter className="h-4 w-4 mr-2" />
                        Browse Genres
                      </Button>
                    </Link>
                    <Link href="/trending">
                      <Button variant="outline" className="w-full">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Trending
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
