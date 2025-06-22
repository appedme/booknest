"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ExternalLink, ThumbsUp, ThumbsDown, Loader2, Star } from "lucide-react";
import { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { safeDate } from "@/utils/date";
import { useVoting } from "@/hooks/useVoting";
import Link from "next/link";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
  onComment?: (bookId: number) => void;
  onVoteSuccess?: () => void;
}

export function BookCard({ book, onComment, onVoteSuccess }: BookCardProps) {
  const { upvote, downvote, voteType, isLoading } = useVoting(book.id);

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
  };  return (
    <motion.div 
      className="group h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl border bg-card hover:bg-card/80 backdrop-blur-sm">
        {/* Book Poster */}
        {book.posterUrl && (
          <Link href={`/books/${book.id}`} className="block relative">
            <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-muted to-muted/50">
              <img
                src={book.posterUrl}
                alt={book.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div 
                className="absolute bottom-4 left-4 right-4"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button size="sm" className="w-full bg-background/90 text-foreground hover:bg-background backdrop-blur-sm border shadow-lg">
                  View Details
                </Button>
              </motion.div>
            </div>
          </Link>
        )}

        <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
          {/* Genre Badge & Date */}
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {book.genre}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {(() => {
                try {
                  return formatDistanceToNow(safeDate(book.createdAt), { addSuffix: true });
                } catch {
                  return 'Recently';
                }
              })()}
            </span>
          </div>

          {/* Book Title */}
          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer">
              {book.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4.1 // Mock average rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">4.1 (8 reviews)</span>
          </div>

          {/* Summary */}
          {book.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
              {book.summary}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            {/* Vote Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 rounded-full transition-all duration-200 ${voteType === 'upvote'
                    ? 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                    : 'text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/50'
                  }`}
                onClick={(e) => handleVote(e, 'upvote')}
                disabled={isLoading}
              >
                {isLoading && voteType === 'upvote' ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <ThumbsUp className={`h-4 w-4 mr-1 ${voteType === 'upvote' ? 'fill-current' : ''}`} />
                )}
                <span className="text-xs font-medium">{book.upvotes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 rounded-full transition-all duration-200 ${voteType === 'downvote'
                    ? 'text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                    : 'text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50'
                  }`}
                onClick={(e) => handleVote(e, 'downvote')}
                disabled={isLoading}
              >
                {isLoading && voteType === 'downvote' ? (
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
              className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200"
              onClick={handleComment}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{book.comments?.length || 0}</span>
            </Button>
          </div>

          {/* Read Book Button */}
          <div className="pt-2">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
              onClick={handleReadBook}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Book
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
