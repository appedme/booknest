"use client";

import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/features/BookCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame, Calendar, ThumbsUp, MessageCircle, Clock, BookOpen, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type SortOption = 'hot' | 'new' | 'top' | 'discussed';

export default function TrendingPage() {
  const { books, isLoading } = useBooks();
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const router = useRouter();

  // Calculate trending metrics and sort books
  const trendingBooks = useMemo(() => {
    if (!books) return [];

    const booksWithMetrics = books.map(book => {
      const age = Date.now() - new Date(book.createdAt).getTime();
      const ageInDays = age / (1000 * 60 * 60 * 24);
      
      // Hot score: combines votes and comments with time decay
      const hotScore = ((book.upvotes || 0) - (book.downvotes || 0) + (book.comments?.length || 0) * 0.5) / Math.pow(ageInDays + 1, 1.5);
      
      // Top score: simple vote ratio
      const topScore = (book.upvotes || 0) - (book.downvotes || 0);
      
      // Discussion score: comments weighted by recency
      const discussionScore = (book.comments?.length || 0) / Math.pow(ageInDays + 1, 0.5);

      return {
        ...book,
        hotScore,
        topScore,
        discussionScore,
        ageInDays
      };
    });

    // Sort based on selected option
    switch (sortBy) {
      case 'hot':
        return booksWithMetrics.sort((a, b) => b.hotScore - a.hotScore);
      case 'new':
        return booksWithMetrics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'top':
        return booksWithMetrics.sort((a, b) => b.topScore - a.topScore);
      case 'discussed':
        return booksWithMetrics.sort((a, b) => b.discussionScore - a.discussionScore);
      default:
        return booksWithMetrics;
    }
  }, [books, sortBy]);

  // Get trending stats
  const trendingStats = useMemo(() => {
    if (!books) return { totalBooks: 0, todayBooks: 0, weekBooks: 0, totalVotes: 0 };
    
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    return {
      totalBooks: books.length,
      todayBooks: books.filter(book => new Date(book.createdAt).getTime() > oneDayAgo).length,
      weekBooks: books.filter(book => new Date(book.createdAt).getTime() > oneWeekAgo).length,
      totalVotes: books.reduce((sum, book) => sum + (book.upvotes || 0) + (book.downvotes || 0), 0)
    };
  }, [books]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Trending Books</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what's popular in the BookNest community. Find the most loved and discussed books.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{trendingStats.totalBooks}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-green-600">{trendingStats.weekBooks}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-orange-600">{trendingStats.todayBooks}</p>
                </div>
                <Flame className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-purple-600">{trendingStats.totalVotes}</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={sortBy === 'hot' ? 'default' : 'outline'}
            onClick={() => setSortBy('hot')}
            className="gap-2"
          >
            <Flame className="h-4 w-4" />
            Hot
          </Button>
          <Button
            variant={sortBy === 'new' ? 'default' : 'outline'}
            onClick={() => setSortBy('new')}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            New
          </Button>
          <Button
            variant={sortBy === 'top' ? 'default' : 'outline'}
            onClick={() => setSortBy('top')}
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            Top Rated
          </Button>
          <Button
            variant={sortBy === 'discussed' ? 'default' : 'outline'}
            onClick={() => setSortBy('discussed')}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Most Discussed
          </Button>
        </div>

        {/* Top 3 Trending Books */}
        {trendingBooks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Top Trending
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingBooks.slice(0, 3).map((book, index) => (
                <Card key={book.id} className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="absolute top-4 right-4">
                    <Badge className={`${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    } text-white font-bold`}>
                      #{index + 1}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-2">{book.name}</h3>
                        <Badge variant="secondary" className="mt-2">{book.genre}</Badge>
                      </div>
                      
                      {book.summary && (
                        <p className="text-sm text-gray-600 line-clamp-3">{book.summary}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-green-600">
                            <ThumbsUp className="h-4 w-4" />
                            {book.upvotes || 0}
                          </span>
                          <span className="flex items-center gap-1 text-blue-600">
                            <MessageCircle className="h-4 w-4" />
                            {book.comments?.length || 0}
                          </span>
                        </div>
                        <span className="text-gray-500">
                          {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => router.push(`/books/${book.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Trending Books */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            All Trending Books ({trendingBooks.length})
          </h2>
          
          {trendingBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                  onComment={(bookId) => router.push(`/books/${bookId}#comments`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trending books yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Books will appear here as the community starts sharing and voting. Be the first to add a book!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
