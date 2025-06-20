"use client";

import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Book, User, BookOpen } from "lucide-react";
import { Book as BookType } from "@/types";
import { useMemo } from "react";

export default function AuthorsPage() {
  const { books, isLoading } = useBooks();

  // Process authors from books data
  const authors = useMemo(() => {
    if (!books) return [];
    
    const authorMap = new Map();
    
    books.forEach(book => {
      if (book.userId) {
        if (authorMap.has(book.userId)) {
          const author = authorMap.get(book.userId);
          author.bookCount++;
          author.totalUpvotes += book.upvotes || 0;
          author.books.push(book);
        } else {
          authorMap.set(book.userId, {
            id: book.userId,
            name: (book as BookType & { userName?: string }).userName || `User ${book.userId}`,
            bookCount: 1,
            totalUpvotes: book.upvotes || 0,
            books: [book],
            joinedDate: book.createdAt
          });
        }
      }
    });

    return Array.from(authorMap.values())
      .sort((a, b) => b.totalUpvotes - a.totalUpvotes);
  }, [books]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Featured Authors
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover the brilliant minds sharing knowledge on BookNest
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold">{authors.length}</h3>
              <p className="text-muted-foreground">Active Authors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold">{books?.length || 0}</h3>
              <p className="text-muted-foreground">Books Shared</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Book className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold">
                {authors.reduce((sum, author) => sum + author.totalUpvotes, 0)}
              </h3>
              <p className="text-muted-foreground">Total Upvotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Card key={author.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg font-semibold">
                      {author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{author.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(author.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Books Shared</span>
                    <Badge variant="secondary">{author.bookCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Upvotes</span>
                    <Badge variant="outline">{author.totalUpvotes}</Badge>
                  </div>
                </div>

                {/* Recent Books */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Recent Books:</p>
                  <div className="space-y-1">
                    {author.books.slice(0, 2).map((book: BookType) => (
                      <p key={book.id} className="text-xs text-muted-foreground truncate">
                        • {book.name}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {authors.length === 0 && (
          <div className="text-center py-12">
            <User className="h-24 w-24 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No Authors Found</h3>
            <p className="text-muted-foreground">
              Be the first to share a book and become a featured author!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
