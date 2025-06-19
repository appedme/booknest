"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, ExternalLink, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useVoting } from "@/hooks/useVoting";

interface BookCardProps {
  book: Book;
  onComment?: (bookId: number) => void;
  onVoteSuccess?: () => void;
}

export function BookCard({ book, onComment, onVoteSuccess }: BookCardProps) {
  const { vote, isVoting } = useVoting({ onVoteSuccess });

  const handleVote = (voteType: 'upvote' | 'downvote') => {
    vote(book.id, voteType);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg border-0 bg-white shadow-sm">
      {/* Book Poster */}
      {book.posterUrl && (
        <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={book.posterUrl}
            alt={book.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        {/* Genre Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
            {book.genre}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Book Title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.name}
        </h3>

        {/* Summary */}
        {book.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {book.summary}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {/* Vote Buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleVote('upvote')}
              disabled={isVoting(book.id)}
            >
              {isVoting(book.id) ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ThumbsUp className="h-4 w-4 mr-1" />
              )}
              <span className="text-xs font-medium">{book.upvotes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleVote('downvote')}
              disabled={isVoting(book.id)}
            >
              {isVoting(book.id) ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ThumbsDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-xs font-medium">{book.downvotes}</span>
            </Button>
          </div>

          {/* Comments */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => onComment?.(book.id)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{book.comments.length}</span>
          </Button>
        </div>

        {/* Read Book Button */}
        <div className="pt-2">
          <a
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Book
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
