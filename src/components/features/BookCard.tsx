"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Heart, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  ExternalLink,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface BookCardProps {
  book: Book;
  onComment?: (bookId: number) => void;
  onVoteSuccess?: () => void;
}

export function BookCard({ book, onComment, onVoteSuccess }: BookCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/books/${book.id}`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComment) {
      onComment(book.id);
    } else {
      router.push(`/books/${book.id}#comments`);
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Opens in new tab
  };

  const scoreCalculation = (book.upvotes || 0) - (book.downvotes || 0);
  const totalVotes = (book.upvotes || 0) + (book.downvotes || 0);

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-[400px] overflow-hidden relative">
      <div 
        onClick={handleCardClick} 
        className="relative h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: book.posterUrl 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%), url(${book.posterUrl})`
            : `linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(147, 51, 234) 100%)`
        }}
      >
        {/* Fallback for no image */}
        {!book.posterUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium">No Cover Available</p>
            </div>
          </div>
        )}
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-sm backdrop-blur-sm">
            {book.genre}
          </Badge>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
            <ThumbsUp className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium dark:text-gray-200">{scoreCalculation}</span>
          </div>
        </div>

        {/* Title overlay - Always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="font-bold text-lg leading-tight text-white line-clamp-2 mb-2">
            {book.name}
          </h3>
          
          {/* Stats - Always visible */}
          <div className="flex items-center justify-between text-sm text-white/80">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-green-400" />
                {book.upvotes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-blue-400" />
                {book.comments?.length || 0}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Summary overlay - Only visible on hover */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
          <div className="text-center text-white space-y-4">
            <h3 className="font-bold text-xl leading-tight">
              {book.name}
            </h3>
            
            {book.summary && (
              <p className="text-sm leading-relaxed text-white/90 line-clamp-4">
                {book.summary}
              </p>
            )}

            {/* Action Buttons on hover */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 h-8 text-xs bg-white/90 text-gray-900 hover:bg-white"
                onClick={handleCommentClick}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Comment
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-3 text-xs bg-white/90 text-gray-900 hover:bg-white"
                onClick={handleExternalClick}
                asChild
              >
                <a href={book.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>

            {/* Author info on hover */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/70 pt-2">
              <User className="w-3 h-3" />
              <span>Shared by Community</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
