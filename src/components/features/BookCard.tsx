"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, ExternalLink, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useVoting } from "@/hooks/useVoting";
import Link from "next/link";

interface BookCardProps {
  book: Book;
  onComment?: (bookId: number) => void;
  onVoteSuccess?: () => void;
}

export function BookCard({ book, onComment, onVoteSuccess }: BookCardProps) {
  const { upvote, downvote, hasVoted, voteType, isLoading } = useVoting(book.id);

  const handleVote = async (e: React.MouseEvent, voteAction: 'upvote' | 'downvote') => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (voteAction === 'upvote') {
        await upvote();
      } else {
        await downvote();
      }
      onVoteSuccess?.();
    } catch (error) {
      console.error('Voting error:', error);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onComment?.(book.id);
  };

  const handleReadBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(book.url, '_blank', 'noopener,noreferrer');
  }; return (
    <div className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white shadow-lg">
        {/* Book Poster */}
        {book.posterUrl && (
          <Link href={`/books/${book.id}`} className="block relative">
            <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={book.posterUrl}
                alt={book.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <Button size="sm" className="w-full bg-white/90 text-gray-900 hover:bg-white backdrop-blur">
                  View Details
                </Button>
              </div>
            </div>
          </Link>
        )}

        <CardContent className="p-5 space-y-4">
          {/* Genre Badge & Date */}
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-2 py-1">
              {book.genre}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Book Title */}
          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-lg leading-tight line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer group-hover:text-blue-700">
              {book.name}
            </h3>
          </Link>

          {/* Summary */}
          {book.summary && (
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {book.summary}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {/* Vote Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 rounded-full transition-all ${voteType === 'upvote'
                    ? 'text-green-700 bg-green-100 hover:bg-green-200'
                    : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  }`}
                onClick={(e) => handleVote(e, 'upvote')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <ThumbsUp className={`h-4 w-4 mr-1 ${voteType === 'upvote' ? 'fill-current' : ''}`} />
                )}
                <span className="text-xs font-medium">{book.upvotes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 rounded-full transition-all ${voteType === 'downvote'
                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                onClick={(e) => handleVote(e, 'downvote')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <ThumbsDown className={`h-4 w-4 mr-1 ${voteType === 'downvote' ? 'fill-current' : ''}`} />
                )}
                <span className="text-xs font-medium">{book.downvotes || 0}</span>
              </Button>
            </div>

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              onClick={handleComment}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{book.comments?.length || 0}</span>
            </Button>
          </div>

          {/* Read Book Button */}
          <div className="pt-2">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
              size="sm"
              onClick={handleReadBook}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Book
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
