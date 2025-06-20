"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Trophy, Crown } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";

interface PopularBooksProps {
  books: Book[];
}

export function PopularBooks({ books }: PopularBooksProps) {
  // Get most popular books (highest upvotes)
  const popularBooks = books
    .filter(book => (book.upvotes || 0) > 0)
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    .slice(0, 3);

  if (popularBooks.length === 0) return null;

  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 1: return <Trophy className="h-4 w-4 text-gray-400" />;
      case 2: return <Star className="h-4 w-4 text-orange-500" />;
      default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (index: number) => {
    switch (index) {
      case 0: return "default" as const;
      case 1: return "secondary" as const;
      case 2: return "outline" as const;
      default: return "outline" as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Most Popular
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularBooks.map((book, index) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {getIcon(index)}
                    </div>
                    {book.posterUrl ? (
                      <img
                        src={book.posterUrl}
                        alt={book.name}
                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">📚</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors mb-1">
                        {book.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getBadgeVariant(index)}>
                          {book.genre}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {book.upvotes} vote{(book.upvotes || 0) !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      {book.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/?sort=popular">
            <Button variant="outline" size="sm">
              View All Popular
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
