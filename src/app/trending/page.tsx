"use client";

import { useBooks } from "@/hooks/useBooks";
import { GoogleBooksLayout } from "@/components/features/GoogleBooksLayout";
import { GoogleBooksGrid } from "@/components/features/GoogleBooksGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Flame, 
  Calendar, 
  ThumbsUp, 
  MessageCircle, 
  Award,
  BarChart3
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SortOption = 'hot' | 'new' | 'top' | 'discussed';

export default function TrendingPage() {
  const { books, isLoading, mutate } = useBooks();
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

  const handleVote = async (bookId: number, type: 'up' | 'down') => {
    // Implement voting logic here
    console.log(`Voting ${type} for book ${bookId}`);
    mutate();
  };

  const sortOptions = [
    { value: 'hot', label: '🔥 Hot' },
    { value: 'new', label: '🆕 New' },
    { value: 'top', label: '⭐ Top' },
    { value: 'discussed', label: '💬 Most Discussed' }
  ];

  if (isLoading) {
    return (
      <GoogleBooksLayout>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </GoogleBooksLayout>
    );
  }

  return (
    <GoogleBooksLayout>
      {/* Header Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-8 w-8 text-google-blue" />
          <div>
            <h1 className="text-3xl font-normal text-gray-900">Trending Books</h1>
            <p className="text-gray-600">Discover the most popular and discussed books in our community</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {trendingBooks.filter(b => b.hotScore > 1).length}
              </div>
              <div className="text-sm text-gray-600">Hot Books</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <ThumbsUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {trendingBooks.reduce((sum, book) => sum + (book.upvotes || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {trendingBooks.reduce((sum, book) => sum + (book.comments?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Discussions</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {trendingBooks.filter(b => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(b.createdAt) > weekAgo;
                }).length}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Indicators */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            <Flame className="h-3 w-3 mr-1" />
            Trending Now
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Award className="h-3 w-3 mr-1" />
            Community Favorites
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <BarChart3 className="h-3 w-3 mr-1" />
            Most Active
          </Badge>
        </div>
      </div>

      {/* Books Grid */}
      <GoogleBooksGrid
        books={trendingBooks}
        onVote={handleVote}
        showViewToggle={true}
        sortOptions={sortOptions}
        onSortChange={(value) => setSortBy(value as SortOption)}
        currentSort={sortBy}
        emptyMessage="No trending books yet"
        emptyDescription="Be the first to share a book and start the trend!"
      />
    </GoogleBooksLayout>
  );
}
