"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, User, BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";

interface TopAuthorsProps {
  books: Book[];
}

export function TopAuthors({ books }: TopAuthorsProps) {
  // Calculate author statistics (using shared by username or "Community")
  const authorStats = books.reduce((acc, book : { sharedBy?: string; upvotes?: number; downvotes?: number; comments?: any[] }) => {
    // For now, we'll use "Community" as the author since we don't have author data
    // In a real app, you'd have book.author or book.sharedBy
    const author = book.sharedBy || "Community Member";
    if (!acc[author]) {
      acc[author] = {
        name: author,
        booksCount: 0,
        totalVotes: 0,
        totalComments: 0
      };
    }
    acc[author].booksCount += 1;
    acc[author].totalVotes += (book.upvotes || 0) + (book.downvotes || 0);
    acc[author].totalComments += book.comments?.length || 0;
    return acc;
  }, {} as Record<string, { name: string; booksCount: number; totalVotes: number; totalComments: number }>);

  // Sort authors by engagement score
  const topAuthors = Object.values(authorStats)
    .map(author => ({
      ...author,
      score: author.booksCount * 10 + author.totalVotes * 2 + author.totalComments * 1
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (topAuthors.length === 0) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topAuthors.map((author, index) => (
            <Link key={author.name} href={`/authors/${encodeURIComponent(author.name)}`}>
              <div className="group cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(author.name)}
                      </AvatarFallback>
                    </Avatar>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-background border-2 rounded-full flex items-center justify-center">
                        {index === 0 && <Crown className="h-3 w-3 text-yellow-500" />}
                        {index === 1 && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                        {index === 2 && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {author.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        {author.booksCount}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        {author.totalVotes}
                      </div>
                    </div>
                  </div>
                  <Badge variant={index < 3 ? "default" : "secondary"} className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/authors">
            <Button variant="outline" size="sm">
              <User className="h-3 w-3 mr-1" />
              View All Authors
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
