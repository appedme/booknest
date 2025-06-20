"use client";
import { useBooks } from "@/hooks/useBooks";
import { GoogleBooksLayout } from "@/components/features/GoogleBooksLayout";
import { GoogleBooksGrid } from "@/components/features/GoogleBooksGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, MessageCircle, Calendar, User, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react"; import Link from "next/link";

export default function DashboardPage() {
    const { books, isLoading, mutate } = useBooks();
    const [viewFilter, setViewFilter] = useState<'all' | 'recent'>('all');

    // Calculate basic statistics and filtered books
    const { stats, filteredBooks } = useMemo(() => {
        if (!books) {
            return {
                stats: {
                    totalBooks: 0,
                    totalVotes: 0,
                    totalComments: 0,
                    booksThisWeek: 0
                },
                filteredBooks: []
            };
        }

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentBooks = books.filter(book => new Date(book.createdAt) > weekAgo);

        let filtered = books;
        switch (viewFilter) {
            case 'recent':
                filtered = recentBooks;
                break;
            default:
                filtered = books;
        }

        const stats = {
            totalBooks: books.length,
            totalVotes: books.reduce((sum, book) => sum + (book.upvotes || 0), 0),
            totalComments: books.reduce((sum, book) => sum + (book.comments?.length || 0), 0),
            booksThisWeek: recentBooks.length
        };

        return { stats, filteredBooks: filtered };
    }, [books, viewFilter]);

    const handleVote = async (bookId: number, type: 'up' | 'down') => {
        console.log(`Voting ${type} for book ${bookId}`);
        mutate();
    };

    if (isLoading) {
        return (
            <GoogleBooksLayout>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
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
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-google-blue" />
                        <div>
                            <h1 className="text-3xl font-normal text-gray-900">Dashboard</h1>
                            <p className="text-gray-600">
                                Welcome back, Reader! Manage your books and discover new favorites.
                            </p>
                        </div>
                    </div>

                    <Link href="/create">
                        <Button className="bg-google-blue hover:bg-google-blue-dark text-white gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add Book
                        </Button>
                    </Link>
                </div>

                {/* Community Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border border-gray-200">
                        <CardContent className="p-4 text-center">
                            <BookOpen className="h-6 w-6 text-green-500 mx-auto mb-2" />
                            <div className="text-2xl font-medium text-gray-900">
                                {stats.totalBooks}
                            </div>
                            <div className="text-sm text-gray-600">Total Books</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardContent className="p-4 text-center">
                            <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                            <div className="text-2xl font-medium text-gray-900">
                                {stats.totalVotes}
                            </div>
                            <div className="text-sm text-gray-600">Community Votes</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardContent className="p-4 text-center">
                            <MessageCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                            <div className="text-2xl font-medium text-gray-900">
                                {stats.totalComments}
                            </div>
                            <div className="text-sm text-gray-600">Discussions</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardContent className="p-4 text-center">
                            <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                            <div className="text-2xl font-medium text-gray-900">
                                {stats.booksThisWeek}
                            </div>
                            <div className="text-sm text-gray-600">This Week</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Filters */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Community Library</h3>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setViewFilter('all')}
                                variant={viewFilter === 'all' ? "default" : "outline"}
                                size="sm"
                                className={viewFilter === 'all' ? "bg-google-blue text-white" : ""}
                            >
                                All Books
                                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                                    {books?.length || 0}
                                </Badge>
                            </Button>

                            <Button
                                onClick={() => setViewFilter('recent')}
                                variant={viewFilter === 'recent' ? "default" : "outline"}
                                size="sm"
                                className={viewFilter === 'recent' ? "bg-google-blue text-white" : ""}
                            >
                                Recent
                                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                                    {stats.booksThisWeek}
                                </Badge>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            <GoogleBooksGrid
                books={filteredBooks}
                onVote={handleVote}
                showViewToggle={true}
                sortOptions={[
                    { value: 'recent', label: 'Recently Added' },
                    { value: 'popular', label: 'Most Popular' },
                    { value: 'discussed', label: 'Most Discussed' },
                    { value: 'title', label: 'Title A-Z' }
                ]}
                emptyMessage={
                    viewFilter === 'recent' ? "No recent books found" : "No books available"
                }
                emptyDescription={
                    viewFilter === 'recent' ? "Check back later for new additions." : "Be the first to share a book with the community."
                }
            />

            {/* Call to Action */}
            {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-normal text-gray-900 mb-2">Start Building the Library</h3>
                        <p className="text-gray-600 mb-6">
                            Share books you love with the community and discover new favorites from other readers.
                        </p>
                        <Link href="/create">
                            <Button className="bg-google-blue hover:bg-google-blue-dark text-white gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add the First Book
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </GoogleBooksLayout>
    );
}