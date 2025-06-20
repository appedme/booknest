"use client";

import { useState, useMemo } from 'react';
import { GoogleBooksHeader } from '@/components/features/GoogleBooksHeader';
import { GoogleBookCard } from '@/components/features/GoogleBookCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  TrendingUp,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  Grid3X3,
  List
} from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ViewMode = 'grid' | 'list';
type SortOption = 'trending' | 'recent' | 'popular' | 'title';

export default function Home() {
  const { books, isLoading, isError, mutate } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('trending');

  // Filter and sort books
  const processedBooks = useMemo(() => {
    if (!books) return [];

    let filtered = books;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'trending':
        return filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'recent':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return filtered.sort((a, b) => (b.upvotes + b.comments.length) - (a.upvotes + a.comments.length));
      case 'title':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [books, searchQuery, sortBy]);

  const handleVote = async (bookId: number, type: 'up' | 'down') => {
    // Implement voting logic here
    console.log(`Voting ${type} for book ${bookId}`);
    mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <GoogleBooksHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <GoogleBooksHeader />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-normal text-gray-900 mb-2">Unable to load books</h2>
            <p className="text-gray-600">Please check your connection and try again.</p>
          </div>
          <Button 
            onClick={() => mutate()} 
            className="bg-google-blue hover:bg-google-blue-dark text-white"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GoogleBooksHeader />
      
      {/* Hero Section with Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-normal text-gray-900 mb-2">
            Discover your next great read
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore millions of books, get recommendations, and connect with other readers
          </p>
          
          {/* Main Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search books, authors, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-full shadow-sm hover:shadow-md focus:shadow-lg transition-shadow duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats and Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-google-blue mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Trending Now</h3>
              <p className="text-sm text-gray-600">
                {books?.filter(b => b.upvotes > 0).length || 0} popular books
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-google-blue mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Recently Added</h3>
              <p className="text-sm text-gray-600">
                {books?.filter(b => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(b.createdAt) > weekAgo;
                }).length || 0} new this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-google-blue mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Community Favorites</h3>
              <p className="text-sm text-gray-600">
                {books?.reduce((sum, book) => sum + book.upvotes, 0) || 0} total recommendations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-normal text-gray-900">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Books'}
            </h2>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {processedBooks.length} {processedBooks.length === 1 ? 'book' : 'books'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded px-3 py-1 bg-white"
              >
                <option value="trending">Trending</option>
                <option value="recent">Recently added</option>
                <option value="popular">Most popular</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-google-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-google-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {processedBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-normal text-gray-900 mb-2">
              {searchQuery ? 'No books found' : 'No books available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or browse all books.'
                : 'Be the first to share a book with the community.'
              }
            </p>
            {searchQuery ? (
              <Button 
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="mr-4"
              >
                Clear search
              </Button>
            ) : null}
            <Link href="/create">
              <Button className="bg-google-blue hover:bg-google-blue-dark text-white">
                Add a book
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            layout
            className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6' 
                : 'space-y-4'
              }
            `}
          >
            {processedBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={viewMode === 'list' ? 'border-b border-gray-200 pb-4' : ''}
              >
                <GoogleBookCard 
                  book={book} 
                  onVote={handleVote}
                  compact={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More / Pagination */}
        {processedBooks.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Load more books
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions Floating Button */}
      <Link href="/create">
        <Button 
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 bg-google-blue hover:bg-google-blue-dark shadow-lg"
          size="lg"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
