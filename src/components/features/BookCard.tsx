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
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white h-fit overflow-hidden">
      <div onClick={handleCardClick}>
        {/* Book Cover */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {book.posterUrl ? (
            <img
              src={book.posterUrl}
              alt={book.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = `
                  <div class="flex items-center justify-center h-full text-gray-400">
                    <div class="text-center">
                      <div class="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-sm font-medium">No Cover</p>
                    </div>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">No Cover Available</p>
              </div>
            </div>
          )}
          
          {/* Floating Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-gray-700 shadow-sm">
              {book.genre}
            </Badge>
          </div>

          {/* Score Badge */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
              <ThumbsUp className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium">{scoreCalculation}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-lg leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {book.name}
            </h3>
          </div>

          {/* Summary */}
          {book.summary && (
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {book.summary}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                {book.upvotes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                {book.comments?.length || 0}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={handleCommentClick}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Comment
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={handleExternalClick}
              asChild
            >
              <a href={book.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>

          {/* Author/Creator */}
          <div className="flex items-center gap-2 text-xs text-gray-500 border-t pt-2">
            <User className="w-3 h-3" />
            <span>Shared by Community</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
