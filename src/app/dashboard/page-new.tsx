"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddBookDialog } from "@/components/features/AddBookDialog";
import { BookCard } from "@/components/features/BookCard";
import {
    BookOpen,
    Plus,
    TrendingUp,
    MessageCircle,
    Eye,
    Filter,
    Grid3X3,
    List
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import type { Book } from "@/types";

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'mine' | 'recent';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { books, isLoading: booksLoading, mutate } = useBooks();
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [filter, setFilter] = useState<FilterMode>('all');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth/signin");
        }
    }, [isAuthenticated, isLoading, router]);

    // Filter books based on selected filter
    const filteredBooks = useMemo(() => {
        if (!books) return [];

        switch (filter) {
            case 'mine':
                return books.filter(book => book.userId === user?.id);
            case 'recent':
                const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
                return books.filter(book => new Date(book.createdAt).getTime() > threeDaysAgo);
            default:
                return books;
        }
    }, [books, filter, user?.id]);

    // Calculate user stats
    const userBooks = books?.filter(book => book.userId === user?.id) || [];
    const userStats = useMemo(() => ({
        booksShared: userBooks.length,
        totalUpvotes: userBooks.reduce((sum: number, book: Book) => sum + (book.upvotes || 0), 0),
        totalComments: userBooks.reduce((sum: number, book: Book) => sum + (book.comments?.length || 0), 0)
    }), [userBooks]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Manage your books and discover new ones
                        </p>
                    </div>
                    <AddBookDialog onBookAdded={() => mutate()}>
                        <Button className="gap-2 shadow-sm">
                            <Plus className="h-4 w-4" />
                            Add Book
                        </Button>
                    </AddBookDialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">My Books</p>
                                    <p className="text-xl font-bold text-gray-900">{userStats.booksShared}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Upvotes</p>
                                    <p className="text-xl font-bold text-gray-900">{userStats.totalUpvotes}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <MessageCircle className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Comments</p>
                                    <p className="text-xl font-bold text-gray-900">{userStats.totalComments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/genres">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 text-center">
                                <Filter className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                <p className="text-sm font-medium text-gray-900">Browse Genres</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/trending">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 text-center">
                                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                <p className="text-sm font-medium text-gray-900">Trending</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/create">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 text-center">
                                <Plus className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                <p className="text-sm font-medium text-gray-900">Add Book</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 text-center">
                                <BookOpen className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                <p className="text-sm font-medium text-gray-900">Discover</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Books Section */}
                <div className="space-y-4">
                    {/* Filter and View Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('all')}
                            >
                                All Books
                            </Button>
                            <Button
                                variant={filter === 'mine' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('mine')}
                            >
                                My Books
                            </Button>
                            <Button
                                variant={filter === 'recent' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('recent')}
                            >
                                Recent
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Books Grid/List */}
                    {booksLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                        }>
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onComment={(bookId) => router.push(`/books/${bookId}#comments`)}
                                    onVoteSuccess={() => mutate()}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                                <BookOpen className="h-8 w-8 text-gray-400 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {filter === 'mine' ? 'No books yet' : 'No books found'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {filter === 'mine'
                                    ? 'Share your first book with the community!'
                                    : 'Try adjusting your filters or check back later.'
                                }
                            </p>
                            {filter === 'mine' && (
                                <AddBookDialog onBookAdded={() => mutate()}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Book
                                    </Button>
                                </AddBookDialog>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
