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
import {
    ArrowLeft,
    ExternalLink,
    MessageCircle,
    User,
    Calendar,
    ThumbsUp,
    ThumbsDown,
    Send,
    Loader2,
    Share2
} from "lucide-react";
import Link from "next/link";
import { Comment as CommentType } from "@/types";
import { Comment } from "@/components/features/Comment";
import useSWR, { mutate } from "swr";

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
        bookId ? `/api/comments?bookId=${bookId}&limit=50` : null,
        fetcher
    );
    const comments = (commentsData as { comments: CommentType[] })?.comments || [];
    const { upvote, downvote, hasVoted, voteType, isLoading: votingLoading } = useVoting(parseInt(bookId));

    // Calculate total comment count including replies (limited to first 50)
    const totalCommentCount = comments.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0);
    }, 0);

    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("");

    // Share functionality
    const handleShare = async () => {
        if (!book) return;
        
        // Create slug from book name
        const slug = book.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
            
        const shareUrl = `${window.location.origin}/books/${book.id}/${slug}`;
        const shareData = {
            title: `${book.name} - BookNest`,
            text: `Check out "${book.name}" on BookNest - ${book.summary?.substring(0, 100)}${book.summary && book.summary.length > 100 ? '...' : ''}`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            // Fallback for clipboard API failure
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    };

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
                const comment = await response.json() as Comment;
                // Revalidate comments with limit
                await mutate(`/api/comments?bookId=${bookId}&limit=50`);
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
            <div className="min-h-screen bg-gray-50/50">
                <main className="container py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg p-6 space-y-4">
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-64 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-white rounded-lg p-6 space-y-4">
                                    <div className="h-48 bg-gray-200 rounded"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (bookError || !book) {
        return (
            <div className="min-h-screen bg-gray-50/50">
                <main className="container py-8">
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                                <span className="text-2xl">📚</span>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Book not found</h2>
                            <p className="text-gray-600 mb-8">The book you're looking for doesn't exist or has been removed.</p>
                            <Link href="/">
                                <Button variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Books
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <main className="container py-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to books
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Book Header */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Book Cover */}
                                    {book.posterUrl && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={book.posterUrl}
                                                alt={book.name}
                                                className="w-32 h-48 object-cover rounded-lg shadow-sm"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Book Info */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h1 className="text-3xl font-bold mb-2">{book.name}</h1>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Badge variant="secondary">{book.genre}</Badge>
                                                <div className="flex items-center text-muted-foreground text-sm">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {new Date(book.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        {book.summary && (
                                            <div>
                                                <h3 className="font-semibold mb-2">Summary</h3>
                                                <p className="text-muted-foreground leading-relaxed">{book.summary}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-3">
                                            <Button asChild>
                                                <a href={book.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Read Book
                                                </a>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={handleShare}>
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comments Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Comments ({totalCommentCount || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Add Comment Form */}
                                <form onSubmit={handleSubmitComment} className="space-y-4">
                                    {!isAuthenticated && (
                                        <Input
                                            placeholder="Your name (optional)"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    )}
                                    <Textarea
                                        placeholder="Share your thoughts about this book..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
                                        {isSubmittingComment ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4 mr-2" />
                                        )}
                                        Post Comment
                                    </Button>
                                </form>

                                <Separator />

                                {/* Comments List */}
                                <div className="space-y-4">
                                    {comments && comments.length > 0 ? (
                                        <>
                                            {comments.slice(0, 50).map((comment) => (
                                                <Comment
                                                    key={comment.id}
                                                    comment={comment}
                                                    bookId={bookId}
                                                />
                                            ))}
                                            {comments.length >= 50 && (
                                                <div className="text-center py-4 text-muted-foreground">
                                                    <p className="text-sm">Showing first 50 comments. More comments may be available.</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>No comments yet. Be the first to share your thoughts!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Vote Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Community Rating</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant={voteType === 'upvote' ? 'default' : 'outline'}
                                        className="h-16 flex-col gap-1"
                                        onClick={() => handleVote('upvote')}
                                        disabled={votingLoading}
                                    >
                                        {votingLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <ThumbsUp className="h-5 w-5" />
                                                <span className="text-lg font-bold">{book.upvotes}</span>
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant={voteType === 'downvote' ? 'default' : 'outline'}
                                        className="h-16 flex-col gap-1"
                                        onClick={() => handleVote('downvote')}
                                        disabled={votingLoading}
                                    >
                                        {votingLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <ThumbsDown className="h-5 w-5" />
                                                <span className="text-lg font-bold">{book.downvotes}</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {hasVoted && (
                                    <p className="text-xs text-muted-foreground text-center">
                                        You've voted for this book
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Book Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Total Votes</span>
                                    <span className="font-semibold">{book.upvotes + book.downvotes}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Comments</span>
                                    <span className="font-semibold">{comments.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Added</span>
                                    <span className="font-semibold">{new Date(book.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
