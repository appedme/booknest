"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBook } from "@/hooks/useBooks";
import { useVoting } from "@/hooks/useVoting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    ExternalLink,
    MessageCircle,
    Calendar,
    ThumbsUp,
    ThumbsDown,
    Send,
    Loader2,
    Share2,
    BookOpen,
    Star,
    TrendingUp,
    Users,
    Award,
    Bookmark,
    Copy,
    Twitter,
    Facebook,
    Zap
} from "lucide-react";
import Link from "next/link";
import { Comment as CommentType } from "@/types";
import { Comment } from "@/components/features/Comment";
import { RatingAndFeedback } from "@/components/features/RatingAndFeedback";
import useSWR, { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Fetcher function for SWR
const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
};

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
    const totalCommentCount = comments.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0);
    }, 0);

    const totalVotes = (book?.upvotes || 0) + (book?.downvotes || 0);
    const ratingPercentage = totalVotes > 0 ? ((book?.upvotes || 0) / totalVotes) * 100 : 0;

    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("");
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleVote = async (action: 'upvote' | 'downvote') => {
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
    };

    const handleShare = (platform?: string) => {
        const url = window.location.href;
        const title = `Check out "${book?.name}" on BookNest`;
        
        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                });
                break;
            default:
                if (navigator.share) {
                    navigator.share({ title, url });
                } else {
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                }
        }
        setShowShareMenu(false);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // Here you would typically save to backend
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookId: parseInt(bookId),
                    content: newComment,
                    username: username || "Anonymous",
                }),
            });

            if (response.ok) {
                // Revalidate comments
                await mutate(`/api/comments?bookId=${bookId}`);
                setNewComment("");
                setUsername("");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (bookLoading || commentsLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Header Skeleton */}
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-8 bg-muted/50 rounded animate-pulse"></div>
                            <div className="h-4 w-32 bg-muted/50 rounded animate-pulse"></div>
                        </div>

                        {/* Main Content Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Hero Section */}
                                <Card className="p-8">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="w-48 h-72 bg-muted/50 rounded-lg animate-pulse"></div>
                                        <div className="flex-1 space-y-4">
                                            <div className="h-8 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-6 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                                            <div className="h-32 bg-muted/50 rounded animate-pulse"></div>
                                            <div className="flex gap-4">
                                                <div className="h-10 w-32 bg-muted/50 rounded animate-pulse"></div>
                                                <div className="h-10 w-24 bg-muted/50 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Comments Skeleton */}
                                <Card className="p-6">
                                    <div className="space-y-6">
                                        <div className="h-6 bg-muted/50 rounded w-32 animate-pulse"></div>
                                        {Array(3).fill(0).map((_, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="h-10 w-10 bg-muted/50 rounded-full animate-pulse"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-muted/50 rounded w-24 animate-pulse"></div>
                                                        <div className="h-16 bg-muted/50 rounded animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {Array(3).fill(0).map((_, i) => (
                                    <Card key={i} className="p-6">
                                        <div className="space-y-4">
                                            <div className="h-6 bg-muted/50 rounded w-32 animate-pulse"></div>
                                            <div className="h-20 bg-muted/50 rounded animate-pulse"></div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (bookError || !book) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md mx-auto"
                    >
                        <div className="bg-destructive/10 rounded-full p-8 w-24 h-24 mx-auto mb-6">
                            <BookOpen className="h-8 w-8 text-destructive mx-auto" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Book not found</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            The book you're looking for doesn't exist or has been removed from our collection.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Books
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/create">
                                    Add a Book
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link 
                            href="/" 
                            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                            Back to books
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBookmark}
                                className={cn("hover:scale-105 transition-all duration-200", 
                                    isBookmarked && "text-yellow-500"
                                )}
                            >
                                <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                            </Button>
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="hover:scale-105 transition-all duration-200"
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <AnimatePresence>
                                    {showShareMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 top-12 bg-card border rounded-lg shadow-lg p-2 z-50 min-w-[150px]"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => handleShare('copy')}
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy Link
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => handleShare('twitter')}
                                            >
                                                <Twitter className="h-4 w-4 mr-2" />
                                                Twitter
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => handleShare('facebook')}
                                            >
                                                <Facebook className="h-4 w-4 mr-2" />
                                                Facebook
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Hero Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            {/* Book Cover */}
                                            <motion.div
                                                whileHover={{ scale: 1.05, rotateY: 5 }}
                                                className="flex-shrink-0"
                                            >
                                                {book.posterUrl ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={book.posterUrl}
                                                            alt={book.name}
                                                            className="w-48 h-72 object-cover rounded-xl shadow-2xl border-2 border-border/20"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                ) : (
                                                    <div className="w-48 h-72 bg-gradient-to-br from-muted to-muted/50 rounded-xl shadow-2xl flex items-center justify-center">
                                                        <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Book Info */}
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <motion.h1 
                                                        className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.6, delay: 0.2 }}
                                                    >
                                                        {book.name}
                                                    </motion.h1>
                                                    
                                                    <motion.div 
                                                        className="flex flex-wrap items-center gap-4 mb-6"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.6, delay: 0.3 }}
                                                    >
                                                        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                                                            {book.genre}
                                                        </Badge>
                                                        <div className="flex items-center text-muted-foreground text-sm">
                                                            <Calendar className="h-4 w-4 mr-2" />
                                                            {new Date(book.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        {/* Star Rating Preview */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={`h-4 w-4 ${
                                                                            star <= 4.2 // Mock average rating
                                                                                ? "text-yellow-400 fill-yellow-400"
                                                                                : "text-gray-300"
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">4.2 (12 reviews)</span>
                                                        </div>
                                                    </motion.div>

                                                    {/* Rating Display */}
                                                    <motion.div 
                                                        className="bg-muted/30 rounded-lg p-4 mb-6"
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.6, delay: 0.4 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-muted-foreground">Community Rating</span>
                                                            <span className="text-lg font-bold">
                                                                {ratingPercentage.toFixed(0)}% positive
                                                            </span>
                                                        </div>
                                                        <Progress value={ratingPercentage} className="h-2 mb-2" />
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span>{totalVotes} total votes</span>
                                                            <span>{book.upvotes} 👍 · {book.downvotes} 👎</span>
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                {/* Summary */}
                                                {book.summary && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.6, delay: 0.5 }}
                                                    >
                                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                            <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                                            Summary
                                                        </h3>
                                                        <p className="text-muted-foreground leading-relaxed text-lg">
                                                            {book.summary}
                                                        </p>
                                                    </motion.div>
                                                )}

                                                {/* Action Buttons */}
                                                <motion.div 
                                                    className="flex flex-wrap gap-4"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.6, delay: 0.6 }}
                                                >
                                                    <Button 
                                                        asChild 
                                                        size="lg"
                                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        <a href={book.url} target="_blank" rel="noopener noreferrer">
                                                            <BookOpen className="h-5 w-5 mr-2" />
                                                            Read Now
                                                        </a>
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="lg"
                                                        className="border-2 hover:bg-muted/50 font-semibold"
                                                        onClick={() => window.open(book.url, '_blank')}
                                                    >
                                                        <ExternalLink className="h-5 w-5 mr-2" />
                                                        Preview
                                                    </Button>
                                                    <Button 
                                                        variant="ghost"
                                                        size="lg" 
                                                        onClick={handleBookmark}
                                                        className={cn("font-semibold hover:scale-105 transition-all duration-200",
                                                            isBookmarked && "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                                                        )}
                                                    >
                                                        <Bookmark className={cn("h-5 w-5 mr-2", isBookmarked && "fill-current")} />
                                                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Comments Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="border-b bg-muted/20">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            Discussion ({totalCommentCount || 0})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-8">
                                        {/* Add Comment Form */}
                                        <motion.form 
                                            onSubmit={handleSubmitComment} 
                                            className="space-y-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.8 }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <Avatar className="h-10 w-10 border-2 border-border">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                                        {isAuthenticated ? user?.name?.charAt(0) || 'U' : 'G'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-4">
                                                    {!isAuthenticated && (
                                                        <Input
                                                            placeholder="Your name (optional)"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                            className="border-muted-foreground/20 focus:border-blue-500"
                                                        />
                                                    )}
                                                    <Textarea
                                                        placeholder="Share your thoughts about this book..."
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        className="min-h-[120px] border-muted-foreground/20 focus:border-blue-500 resize-none"
                                                    />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-muted-foreground">
                                                            {newComment.length}/500 characters
                                                        </span>
                                                        <Button 
                                                            type="submit" 
                                                            disabled={isSubmittingComment || !newComment.trim() || newComment.length > 500}
                                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                        >
                                                            {isSubmittingComment ? (
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            ) : (
                                                                <Send className="h-4 w-4 mr-2" />
                                                            )}
                                                            Post Comment
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.form>

                                        <Separator className="my-8" />

                                        {/* Comments List */}
                                        <div className="space-y-6">
                                            {comments && comments.length > 0 ? (
                                                <AnimatePresence>
                                                    {comments.map((comment, index) => (
                                                        <motion.div
                                                            key={comment.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                                                        >
                                                            <Comment
                                                                comment={comment}
                                                                bookId={bookId}
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            ) : (
                                                <motion.div 
                                                    className="text-center py-16"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5, delay: 0.9 }}
                                                >
                                                    <div className="bg-muted/30 rounded-full p-8 w-24 h-24 mx-auto mb-6">
                                                        <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground/50" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                                                    <p className="text-muted-foreground">Be the first to share your thoughts about this book!</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Rating and Feedback Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                <RatingAndFeedback 
                                    book={book} 
                                    onRatingSubmit={() => {
                                        // Could trigger a refresh or update
                                        console.log('Rating submitted');
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Voting Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card className="border-0 shadow-lg overflow-hidden">
                                    <CardHeader className="border-b bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/20 dark:to-red-900/20">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Rate This Book
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                variant={voteType === 'upvote' ? 'default' : 'outline'}
                                                className={cn(
                                                    "h-20 flex-col gap-2 transition-all duration-300 hover:scale-105",
                                                    voteType === 'upvote' && "bg-green-600 hover:bg-green-700 shadow-lg"
                                                )}
                                                onClick={() => handleVote('upvote')}
                                                disabled={votingLoading}
                                            >
                                                {votingLoading ? (
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                ) : (
                                                    <>
                                                        <ThumbsUp className={cn("h-6 w-6", 
                                                            voteType === 'upvote' && "text-white"
                                                        )} />
                                                        <span className="text-xl font-bold">{book.upvotes}</span>
                                                        <span className="text-xs opacity-70">Recommend</span>
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant={voteType === 'downvote' ? 'default' : 'outline'}
                                                className={cn(
                                                    "h-20 flex-col gap-2 transition-all duration-300 hover:scale-105",
                                                    voteType === 'downvote' && "bg-red-600 hover:bg-red-700 shadow-lg"
                                                )}
                                                onClick={() => handleVote('downvote')}
                                                disabled={votingLoading}
                                            >
                                                {votingLoading ? (
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                ) : (
                                                    <>
                                                        <ThumbsDown className={cn("h-6 w-6", 
                                                            voteType === 'downvote' && "text-white"
                                                        )} />
                                                        <span className="text-xl font-bold">{book.downvotes}</span>
                                                        <span className="text-xs opacity-70">Not For Me</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        {hasVoted && (
                                            <motion.p 
                                                className="text-sm text-center text-muted-foreground bg-muted/30 rounded-lg p-3"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                ✨ Thank you for your feedback!
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Engagement Stats */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="border-b bg-muted/20">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Award className="h-5 w-5 text-yellow-500" />
                                            Book Analytics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                        <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <span className="text-muted-foreground">Total Engagement</span>
                                                </div>
                                                <span className="font-bold text-lg">{totalVotes + totalCommentCount}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="text-muted-foreground">Total Votes</span>
                                                </div>
                                                <span className="font-bold text-lg">{totalVotes}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                        <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <span className="text-muted-foreground">Comments</span>
                                                </div>
                                                <span className="font-bold text-lg">{totalCommentCount}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                        <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <span className="text-muted-foreground">Added</span>
                                                </div>
                                                <span className="font-semibold">
                                                    {new Date(book.createdAt).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="border-b bg-muted/20">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-yellow-500" />
                                            Quick Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-3">
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start hover:bg-muted/50"
                                            asChild
                                        >
                                            <Link href="/create">
                                                <BookOpen className="h-4 w-4 mr-3" />
                                                Add Another Book
                                            </Link>
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start hover:bg-muted/50"
                                            asChild
                                        >
                                            <Link href={`/genres/${encodeURIComponent(book.genre || 'uncategorized')}`}>
                                                <Star className="h-4 w-4 mr-3" />
                                                More {book.genre} Books
                                            </Link>
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start hover:bg-muted/50"
                                            asChild
                                        >
                                            <Link href="/trending">
                                                <TrendingUp className="h-4 w-4 mr-3" />
                                                Trending Books
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
