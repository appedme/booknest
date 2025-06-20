"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ThumbsUp, MessageCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface TrendingBooksProps {
  books: Book[];
}

export function TrendingBooks({ books }: TrendingBooksProps) {
  // Calculate trending books based on score (upvotes, comments, recency)
  const trendingBooks = books
    .map(book => {
      const score = (book.upvotes || 0) - (book.downvotes || 0) + (book.comments?.length || 0) * 0.5;
      const daysSinceCreated = (Date.now() - new Date(book.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const trendingScore = score / (daysSinceCreated + 1); // Decay over time
      return { ...book, trendingScore };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 6);

  if (trendingBooks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          Trending Books
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingBooks.map((book, index) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {book.posterUrl ? (
                      <img
                        src={book.posterUrl}
                        alt={book.name}
                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-muted-foreground">📚</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {book.name}
                        </h3>
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          #{index + 1}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {book.genre}
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-green-600" />
                          {book.upvotes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-blue-600" />
                          {book.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/trending">
            <Button variant="outline" size="sm">
              View All Trending
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
