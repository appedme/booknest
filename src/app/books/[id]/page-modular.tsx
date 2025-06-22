"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBook } from "@/hooks/useBooks";
import { useVoting } from "@/hooks/useVoting";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Comment as CommentType } from "@/types";
import useSWR from "swr";
import { motion } from "framer-motion";

// Modular components
import {
    BookDetailHero,
    BookDetailStats,
    BookDetailDescription,
    BookDetailComments,
    BookDetailSidebar
} from "@/components/features/book-detail";

// Utils and constants
import { fetcher, getCommentCount } from "@/utils/book-detail";

export default function BookPage() {
    const params = useParams();
    const { user, isAuthenticated } = useAuth();
    const bookId = params.id as string;

    // Use SWR hooks for data fetching
    const { book, isLoading: bookLoading, isError: bookError } = useBook(bookId);
    const { data: commentsData, isLoading: commentsLoading } = useSWR(
        bookId ? `/api/comments?bookId=${bookId}` : null,
        fetcher
    );

    const comments = (commentsData as { comments: CommentType[] })?.comments || [];
    const { upvote, downvote, hasVoted, voteType, isLoading: votingLoading } = useVoting(parseInt(bookId));

    // Calculate engagement metrics
    const totalCommentCount = getCommentCount(comments);
    const totalVotes = (book?.upvotes || 0) + (book?.downvotes || 0);
    const ratingPercentage = totalVotes > 0 ? ((book?.upvotes || 0) / totalVotes) * 100 : 0;

    // State for interactions
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Loading state
    if (bookLoading || commentsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
                <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-6 py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                            <div className="lg:col-span-2 flex justify-center lg:justify-start">
                                <div className="w-80 h-[480px] bg-slate-700 rounded-2xl animate-pulse"></div>
                            </div>
                            <div className="lg:col-span-3 space-y-6">
                                <div className="h-16 bg-slate-600 rounded-lg animate-pulse"></div>
                                <div className="h-8 bg-slate-600 rounded-lg animate-pulse w-1/2"></div>
                                <div className="h-32 bg-slate-600 rounded-lg animate-pulse"></div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-32 bg-slate-600 rounded-xl animate-pulse"></div>
                                    <div className="h-12 w-24 bg-slate-600 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-64 bg-white rounded-2xl shadow-lg animate-pulse"></div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-48 bg-white rounded-2xl shadow-lg animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (bookError || !book) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto p-8"
                >
                    <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                        <BookOpen className="h-12 w-12 text-red-600 mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Book not found</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        The book you're looking for doesn't exist or has been removed from our collection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Books
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="border-slate-300">
                            <Link href="/create">
                                Add a Book
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Main render
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Hero Section */}
            <BookDetailHero
                book={book}
                isBookmarked={isBookmarked}
                onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
                onVote={async (action: 'upvote' | 'downvote') => {
                    if (!isAuthenticated) {
                        alert("Please sign in to vote");
                        return;
                    }
                    try {
                        if (action === 'upvote') {
                            await upvote();
                        } else {
                            await downvote();
                        }
                    } catch (error) {
                        console.error('Error voting:', error);
                        alert('Failed to vote. Please try again.');
                    }
                }}
                hasVoted={hasVoted}
                voteType={voteType}
                isVotingLoading={votingLoading}
            />

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats */}
                        <BookDetailStats
                            book={book}
                            totalCommentCount={totalCommentCount}
                            ratingPercentage={ratingPercentage}
                        />

                        {/* Description */}
                        <BookDetailDescription book={book} />

                        {/* Comments */}
                        <BookDetailComments
                            bookId={bookId}
                            comments={comments}
                            isAuthenticated={isAuthenticated}
                            user={user}
                        />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <BookDetailSidebar
                            book={book}
                            totalVotes={totalVotes}
                            ratingPercentage={ratingPercentage}
                            totalCommentCount={totalCommentCount}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
