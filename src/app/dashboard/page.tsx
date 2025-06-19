"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddBookDialog } from "@/components/features/AddBookDialog";
import { BookCard } from "@/components/features/BookCard";
import { Header } from "@/components/features/Header";
import {
    BookOpen,
    Plus,
    TrendingUp,
    Star,
    Users,
    MessageCircle,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { books, isLoading: booksLoading, mutate } = useBooks();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth/signin");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // Filter books by current user
    const userBooks = books.filter(book => book.userId === user?.id);

    // Calculate user stats
    const userStats = {
        booksShared: userBooks.length,
        totalUpvotes: userBooks.reduce((sum, book) => sum + (book.upvotes || 0), 0),
        totalComments: userBooks.reduce((sum, book) => sum + (book.comments?.length || 0), 0),
        following: 0,
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome back, {user?.name?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Manage your book collection and discover new reads
                            </p>
                        </div>
                        <AddBookDialog onBookAdded={() => mutate()}>
                            <Button size="lg" className="gap-2">
                                <Plus className="h-5 w-5" />
                                Add Book
                            </Button>
                        </AddBookDialog>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Books Shared</p>
                                        <p className="text-3xl font-bold">{userStats.booksShared}</p>
                                    </div>
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Upvotes</p>
                                        <p className="text-3xl font-bold">{userStats.totalUpvotes}</p>
                                    </div>
                                    <div className="bg-secondary/10 p-3 rounded-full">
                                        <TrendingUp className="h-6 w-6 text-secondary-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Comments</p>
                                        <p className="text-3xl font-bold">{userStats.totalComments}</p>
                                    </div>
                                    <div className="bg-accent/10 p-3 rounded-full">
                                        <MessageCircle className="h-6 w-6 text-accent-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Following</p>
                                        <p className="text-3xl font-bold">{userStats.following}</p>
                                    </div>
                                    <div className="bg-muted p-3 rounded-full">
                                        <Users className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-primary" />
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>
                                    Common tasks to help you get started
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <AddBookDialog onBookAdded={() => mutate()}>
                                        <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4">
                                            <Plus className="h-5 w-5" />
                                            <div className="text-left">
                                                <div className="font-medium">Add a Book</div>
                                                <div className="text-sm text-muted-foreground">Share your favorite read</div>
                                            </div>
                                        </Button>
                                    </AddBookDialog>

                                    <Link href="/">
                                        <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4">
                                            <BookOpen className="h-5 w-5" />
                                            <div className="text-left">
                                                <div className="font-medium">Explore Books</div>
                                                <div className="text-sm text-muted-foreground">Discover new books</div>
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Your Books */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Your Books</CardTitle>
                                        <CardDescription>
                                            Books you&apos;ve shared with the community
                                        </CardDescription>
                                    </div>
                                    <Link href="/">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            View All
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {booksLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="bg-muted rounded-lg h-48 animate-pulse" />
                                        ))}
                                    </div>
                                ) : userBooks.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {userBooks.slice(0, 4).map((book) => (
                                            <BookCard key={book.id} book={book} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="bg-muted rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">No books yet</h3>
                                        <p className="text-muted-foreground mb-6">Start by adding your first book to the collection</p>
                                        <AddBookDialog onBookAdded={() => mutate()}>
                                            <Button className="gap-2">
                                                <Plus className="h-4 w-4" />
                                                Add Your First Book
                                            </Button>
                                        </AddBookDialog>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                                    <Badge variant="secondary" className="mt-2">
                                        Book Enthusiast
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground text-center py-8">
                                        No recent activity
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trending Topics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Trending Genres</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {['Fiction', 'Programming', 'Self-Help', 'Science', 'Biography'].map((genre) => (
                                        <div key={genre} className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">{genre}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {Math.floor(Math.random() * 100) + 1}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
