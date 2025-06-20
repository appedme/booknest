"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { GoogleBooksLayout } from "@/components/features/GoogleBooksLayout";
import { GoogleBookCard } from "@/components/features/GoogleBookCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, BookOpen, ThumbsUp, MessageCircle, Calendar, Settings } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { books, isLoading: booksLoading } = useBooks();
  const router = useRouter();

  // Filter user's books
  const userBooks = useMemo(() => {
    if (!books || !user) return [];
    return books.filter(book => book.userId === user.id);
  }, [books, user]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!userBooks.length) return { totalUpvotes: 0, totalComments: 0 };
    
    return {
      totalUpvotes: userBooks.reduce((sum, book) => sum + (book.upvotes || 0), 0),
      totalComments: userBooks.reduce((sum, book) => sum + (book.comments?.length || 0), 0)
    };
  }, [userBooks]);

  if (authLoading || booksLoading) {
    return (
      <GoogleBooksLayout>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-blue"></div>
        </div>
      </GoogleBooksLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <GoogleBooksLayout>
        <div className="flex items-center justify-center py-16">
          <Card className="w-full max-w-md border border-gray-200">
            <CardContent className="p-6 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-normal mb-2 text-gray-900">Sign In Required</h2>
              <p className="text-gray-600 mb-4">
                Please sign in to view your profile
              </p>
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="bg-google-blue hover:bg-google-blue-dark text-white"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </GoogleBooksLayout>
    );
  }

  return (
    <GoogleBooksLayout>
      {/* Profile Header */}
      <Card className="mb-8 border border-gray-200">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl font-normal bg-google-blue text-white">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-normal text-gray-900">{user?.name || 'Anonymous User'}</h1>
                <Button variant="outline" size="sm" className="border-gray-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date().toLocaleDateString()}</span>
              </div>

                <p className="text-muted-foreground mb-6">
                  Book enthusiast sharing knowledge and discoveries with the BookNest community.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userBooks.length}</div>
                    <div className="text-sm text-muted-foreground">Books Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalUpvotes}</div>
                    <div className="text-sm text-muted-foreground">Total Upvotes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalComments}</div>
                    <div className="text-sm text-muted-foreground">Comments Received</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Books */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-normal text-gray-900">My Books</h2>
            <Button 
              onClick={() => router.push('/create')}
              className="bg-google-blue hover:bg-google-blue-dark text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Share New Book
            </Button>
          </div>

          {userBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {userBooks.map((book) => (
                <GoogleBookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card className="border border-gray-200">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No Books Shared Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your library by sharing your first book with the community.
                </p>
                <Button onClick={() => router.push('/create')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Share Your First Book
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity (placeholder) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBooks.slice(0, 3).map((book) => (
                <div key={book.id} className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className="p-2 rounded-full bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Shared "{book.name}"</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {book.upvotes || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {book.comments?.length || 0}
                    </div>
                  </div>
                </div>
              ))}
              
              {userBooks.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </GoogleBooksLayout>
    );
  }
