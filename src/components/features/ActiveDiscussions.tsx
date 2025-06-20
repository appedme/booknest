"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ActiveDiscussionsProps {
  books: Book[];
}

export function ActiveDiscussions({ books }: ActiveDiscussionsProps) {
  // Get books with most recent comments
  const discussedBooks = books
    .filter(book => book.comments && book.comments.length > 0)
    .map(book => ({
      ...book,
      lastCommentTime: book.comments && book.comments.length > 0 
        ? Math.max(...book.comments.map(c => new Date(c.createdAt).getTime()))
        : 0
    }))
    .sort((a, b) => b.lastCommentTime - a.lastCommentTime)
    .slice(0, 5);

  if (discussedBooks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-500" />
          Active Discussions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {discussedBooks.map((book) => (
            <Link key={book.id} href={`/books/${book.id}#comments`}>
              <div className="group cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  {book.posterUrl ? (
                    <img
                      src={book.posterUrl}
                      alt={book.name}
                      className="w-10 h-12 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">📚</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {book.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {book.genre}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="h-3 w-3" />
                        {book.comments?.length || 0}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(book.lastCommentTime), { addSuffix: true })}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/discussions">
            <Button variant="outline" size="sm">
              View All Discussions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
