"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";

interface GenreStatsProps {
  books: Book[];
}

export function GenreStats({ books }: GenreStatsProps) {
  // Calculate genre statistics
  const genreStats = books.reduce((acc, book) => {
    const genre = book.genre || 'Other';
    if (!acc[genre]) {
      acc[genre] = { count: 0, totalVotes: 0 };
    }
    acc[genre].count += 1;
    acc[genre].totalVotes += (book.upvotes || 0) + (book.downvotes || 0);
    return acc;
  }, {} as Record<string, { count: number; totalVotes: number }>);

  // Sort genres by book count
  const sortedGenres = Object.entries(genreStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 6);

  if (sortedGenres.length === 0) return null;

  const maxCount = Math.max(...sortedGenres.map(([, stats]) => stats.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          Popular Genres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedGenres.map(([genre, stats]) => (
            <Link key={genre} href={`/genres?genre=${encodeURIComponent(genre)}`}>
              <div className="group cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {genre}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {stats.count} book{stats.count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300 group-hover:bg-primary/80"
                    style={{ width: `${(stats.count / maxCount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                  <span>{stats.totalVotes} total votes</span>
                  <span>{Math.round((stats.count / books.length) * 100)}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/genres">
            <Button variant="outline" size="sm">
              <Filter className="h-3 w-3 mr-1" />
              Browse All Genres
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
