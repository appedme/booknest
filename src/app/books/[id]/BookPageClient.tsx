"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBook } from "@/hooks/useBooks";
import { useVoting } from "@/hooks/useVoting";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Edit, User } from "lucide-react";
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

interface BookPageClientProps {
  params: Promise<{ id: string }>;
}

export default function BookPageClient({ params }: BookPageClientProps) {
    const [bookId, setBookId] = useState<string>("");
    const { user, isAuthenticated } = useAuth();

    // Resolve params
    useEffect(() => {
        params.then(({ id }) => setBookId(id));
    }, [params]);

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

    // Check if current user is the author
    const isAuthor = isAuthenticated && user && book && book.userId === user.id;

    // Loading state
    if (bookLoading || commentsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (bookError || !book) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <BookOpen className="h-16 w-16 text-purple-400 mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Book Not Found</h1>
                        <p className="text-gray-400 mb-6">
                            The book you're looking for doesn't exist or has been removed.
                        </p>
                        <Link href="/books">
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Books
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Back Button and Edit Button */}
            <div className="container mx-auto px-6 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <Link href="/">
                        <Button 
                            variant="ghost" 
                            className="text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    
                    {/* Edit Button - only show if user is the author */}
                    {isAuthor && (
                        <Link href={`/books/${bookId}/edit`}>
                            <Button 
                                variant="outline" 
                                className="text-white border-white/20 hover:bg-white/10"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Book
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Hero Section */}
            <BookDetailHero
                book={book}
                isBookmarked={isBookmarked}
                onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
                onVote={async (action) => {
                    if (action === 'upvote') {
                        await upvote();
                    } else {
                        await downvote();
                    }
                }}
                hasVoted={hasVoted}
                voteType={voteType}
                isVotingLoading={votingLoading}
            />

            {/* Author Information */}
            {book.authorName && (
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2"
                        >
                            <User className="h-4 w-4 text-purple-400" />
                            <span className="text-gray-300">by</span>
                            <Link 
                                href={`/profile/${book.userId}`}
                                className="text-white font-medium hover:text-purple-300 transition-colors"
                            >
                                {book.authorName}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            )}

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
