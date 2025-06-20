"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface LatestBooksProps {
  books: Book[];
}

export function LatestBooks({ books }: LatestBooksProps) {
  // Get latest books (most recently added)
  const latestBooks = books
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  if (latestBooks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Latest Additions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latestBooks.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {book.posterUrl ? (
                      <img
                        src={book.posterUrl}
                        alt={book.name}
                        className="w-16 h-20 object-cover rounded flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📚</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                        {book.name}
                      </h3>
                      <Badge variant="secondary" className="mb-2">
                        {book.genre}
                      </Badge>
                      {book.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {book.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Community
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
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
          <Link href="/?sort=recent">
            <Button variant="outline" size="sm">
              View All Recent
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
