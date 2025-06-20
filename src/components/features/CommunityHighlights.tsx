"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, BookOpen, MessageSquare, Plus } from "lucide-react";
import { AddBookDialog } from "./AddBookDialog";
import type { Book } from "@/types";

interface CommunityHighlightsProps {
  books: Book[];
  onBookAdded: () => void;
}

export function CommunityHighlights({ books, onBookAdded }: CommunityHighlightsProps) {
  // Calculate community stats
  const totalBooks = books.length;
  const totalVotes = books.reduce((sum, book) => sum + (book.upvotes || 0) + (book.downvotes || 0), 0);
  const totalComments = books.reduce((sum, book) => sum + (book.comments?.length || 0), 0);
  const activeGenres = new Set(books.map(book => book.genre).filter(Boolean)).size;

  // Get recent activity (last 7 days)
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const recentBooks = books.filter(book => new Date(book.createdAt).getTime() > oneWeekAgo).length;

  const stats = [
    {
      icon: <BookOpen className="h-4 w-4 text-blue-500" />,
      label: "Total Books",
      value: totalBooks.toLocaleString(),
      subtitle: `${recentBooks} this week`
    },
    {
      icon: <Users className="h-4 w-4 text-green-500" />,
      label: "Community Votes",
      value: totalVotes.toLocaleString(),
      subtitle: "Total engagement"
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
      label: "Discussions",
      value: totalComments.toLocaleString(),
      subtitle: "Comments shared"
    },
    {
      icon: <Sparkles className="h-4 w-4 text-orange-500" />,
      label: "Active Genres",
      value: activeGenres.toString(),
      subtitle: "Different categories"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Community Highlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.subtitle}</div>
            </div>
          ))}
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Join our growing community of book enthusiasts
          </p>
          <AddBookDialog onBookAdded={onBookAdded}>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Contribute a Book
            </Button>
          </AddBookDialog>
        </div>
      </CardContent>
    </Card>
  );
}
