"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ThumbsUp, ThumbsDown, MessageCircle, MoreHorizontal, Bookmark, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book } from "@/types";
import { safeDateToLocaleString } from "@/utils/date";

interface GoogleBookCardProps {
  book: Book;
  onVote?: (bookId: number, type: 'up' | 'down') => void;
  compact?: boolean;
}

export function GoogleBookCard({ book, onVote, compact = false }: GoogleBookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleVote = (type: 'up' | 'down') => {
    if (onVote) {
      onVote(book.id, type);
    }
  };

  const formatAuthor = (authorName: string | null | undefined) => {
    return authorName || "Unknown Author";
  };

  const formatGenre = (genre: string) => {
    return genre?.replace(/_/g, ' ') || "Uncategorized";
  };  return (
    <div className="google-book-card group relative w-full max-w-[180px] mx-auto">
      {/* Book Cover */}
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <Link href={`/books/${book.id}`} className="block">
          {!imageError && book.posterUrl ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden w-full h-[240px]">
              <Image
                src={book.posterUrl}
                alt={book.name}
                fill
                className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImageError(true);
                  setIsLoading(false);
                }}
                sizes="180px"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
              )}
            </div>
          ) : (
            <div
              className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 w-full h-[240px]"
            >
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-white">
                    {book.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-medium text-blue-700 line-clamp-2">
                  {book.name}
                </p>
              </div>
            </div>
          )}
        </Link>

    {/* Hover Actions */}
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-alpha-50 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-2">
          <DropdownMenuItem>
            <Bookmark className="h-4 w-4 mr-2" />
            Save for later
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share className="h-4 w-4 mr-2" />
            Share book
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={book.url} target="_blank" rel="noopener noreferrer">
              Visit source
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>

    {/* Book Info */}
    <div className="space-y-2 flex-1 min-h-[120px] flex flex-col">
      {/* Title */}
      <Link href={`/books/${book.id}`} className="block">
        <h3
          className="font-normal text-sm leading-tight line-clamp-2 hover:underline transition-colors min-h-[2.5rem]"
          style={{ color: 'var(--google-text-primary)' }}
          title={book.name}
        >
          {book.name}
        </h3>
      </Link>

      {/* Author */}
      {book.authorUsername ? (
        <Link href={`/u/${book.authorUsername}`}>
          <p
            className="text-xs leading-tight line-clamp-1 hover:text-blue-600 hover:underline cursor-pointer"
            style={{ color: 'var(--google-text-secondary)' }}
            title={formatAuthor(book.authorName)}
          >
            {formatAuthor(book.authorName)}
          </p>
        </Link>
      ) : (
        <p
          className="text-xs leading-tight line-clamp-1"
          style={{ color: 'var(--google-text-secondary)' }}
          title={formatAuthor(book.authorName)}
        >
          {formatAuthor(book.authorName)}
        </p>
      )}

      {/* Genre Badge and Rating */}
      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {formatGenre(book.genre)}
        </Badge>

        {/* Quick Rating */}
        {(book.upvotes > 0 || book.downvotes > 0) && (
          <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--google-text-secondary)' }}>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>
              {book.upvotes > 0 ? ((book.upvotes / (book.upvotes + book.downvotes)) * 5).toFixed(1) : '—'}
            </span>
          </div>
        )}
      </div>

      {/* Engagement Actions */}
      {!compact && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleVote('up')}
              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{book.upvotes || 0}</span>
            </button>

            <button
              onClick={() => handleVote('down')}
              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-red-600 transition-colors"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span>{book.downvotes || 0}</span>
            </button>

            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{book.comments?.length || 0}</span>
            </div>
          </div>

          <div className="text-xs" style={{ color: 'var(--google-text-secondary)' }}>
            {safeDateToLocaleString(book.createdAt, 'en-US', {
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
