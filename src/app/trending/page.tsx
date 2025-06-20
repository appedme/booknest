"use client";

import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/features/BookCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/wrappers/PageWrapper";
import { 
  TrendingUp, 
  Flame, 
  Calendar, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  BookOpen, 
  Star,
  Filter,
  BarChart3,
  Zap,
  Award
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

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
            <PageWrapper showSidebar={true}>
                <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                    <div className="container py-8">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-muted rounded w-48"></div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-24 bg-muted rounded"></div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="h-96 bg-muted rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper showSidebar={true}>
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="container py-8 space-y-8">
                    {/* Hero Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                                <TrendingUp className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Trending Books
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover what's hot in the BookNest community. Find the most loved and discussed books.
                        </p>
                    </motion.div>

                    {/* Enhanced Stats Cards */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                    >
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Books</p>
                                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{trendingStats.totalBooks}</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">In our library</p>
                                    </div>
                                    <div className="bg-blue-500 p-3 rounded-xl">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-700 dark:text-green-300">This Week</p>
                                        <p className="text-3xl font-bold text-green-900 dark:text-green-100">{trendingStats.weekBooks}</p>
                                        <p className="text-xs text-green-600 dark:text-green-400">New additions</p>
                                    </div>
                                    <div className="bg-green-500 p-3 rounded-xl">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Today</p>
                                        <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{trendingStats.todayBooks}</p>
                                        <p className="text-xs text-orange-600 dark:text-orange-400">Hot picks</p>
                                    </div>
                                    <div className="bg-orange-500 p-3 rounded-xl">
                                        <Flame className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Votes</p>
                                        <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{trendingStats.totalVotes}</p>
                                        <p className="text-xs text-purple-600 dark:text-purple-400">Community engagement</p>
                                    </div>
                                    <div className="bg-purple-500 p-3 rounded-xl">
                                        <ThumbsUp className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Enhanced Sort Options */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={sortBy === 'hot' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSortBy('hot')}
                                className="gap-2"
                            >
                                <Flame className="h-4 w-4" />
                                Hot
                            </Button>
                            <Button
                                variant={sortBy === 'new' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSortBy('new')}
                                className="gap-2"
                            >
                                <Zap className="h-4 w-4" />
                                New
                            </Button>
                            <Button
                                variant={sortBy === 'top' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSortBy('top')}
                                className="gap-2"
                            >
                                <Award className="h-4 w-4" />
                                Top Rated
                            </Button>
                            <Button
                                variant={sortBy === 'discussed' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSortBy('discussed')}
                                className="gap-2"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Most Discussed
                            </Button>
                        </div>
                    </motion.div>

                    {/* Top 3 Trending Books - Enhanced */}
                    {trendingBooks.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <TrendingUp className="h-6 w-6 text-primary" />
                                Top Trending
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {trendingBooks.slice(0, 3).map((book, index) => (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                    >
                                        <Card className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-950' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-slate-950' : 
                                            'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950'
                                        }`}>
                                            <div className="absolute top-4 right-4">
                                                <Badge className={`${
                                                    index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                                                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-slate-500' : 
                                                    'bg-gradient-to-r from-orange-500 to-red-500'
                                                } text-white font-bold shadow-lg`}>
                                                    #{index + 1}
                                                </Badge>
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg line-clamp-2 mb-2">{book.name}</h3>
                                                        <Badge variant="secondary" className="capitalize">
                                                            {book.genre?.replace('_', ' ')}
                                                        </Badge>
                                                    </div>

                                                    {book.summary && (
                                                        <p className="text-sm text-muted-foreground line-clamp-3">{book.summary}</p>
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
                                                        <span className="text-muted-foreground">
                                                            {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                                        onClick={() => router.push(`/books/${book.id}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* All Trending Books */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                All Trending Books
                                <Badge variant="outline" className="ml-2">
                                    {trendingBooks.length}
                                </Badge>
                            </h2>
                        </div>

                        {trendingBooks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {trendingBooks.map((book, index) => (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + (index % 12) * 0.05 }}
                                    >
                                        <BookCard
                                            book={book}
                                            onComment={(bookId) => router.push(`/books/${bookId}#comments`)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto mb-6">
                                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No trending books yet</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Books will appear here as the community starts sharing and voting. Be the first to add a book!
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
}
