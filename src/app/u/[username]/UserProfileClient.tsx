"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, BookOpen, ThumbsUp, MessageCircle, Calendar, ArrowLeft } from "lucide-react";
import { GoogleBookCard } from "@/components/features/GoogleBookCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { safeDateToISOString } from "@/utils/date";

interface UserProfileClientProps {
  params: Promise<{ userId: string }>;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  books: Array<{
    id: number;
    name: string;
    url: string;
    posterUrl: string | null;
    summary: string | null;
    genre: string;
    upvotes: number;
    downvotes: number;
    createdAt: string | number | Date; // Handle various date formats
  }>;
}

export default function UserProfileClient({ params }: UserProfileClientProps) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    params.then(({ userId }) => setUserId(userId));
  }, [params]);

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json() as UserData;
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Calculate stats
  const stats = {
    totalBooks: userData?.books.length || 0,
    totalUpvotes: userData?.books.reduce((sum, book) => sum + book.upvotes, 0) || 0,
    totalDownvotes: userData?.books.reduce((sum, book) => sum + book.downvotes, 0) || 0,
  };

  const totalVotes = stats.totalUpvotes + stats.totalDownvotes;
  const upvotePercentage = totalVotes > 0 ? (stats.totalUpvotes / totalVotes) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <User className="h-16 w-16 text-purple-400 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">User Not Found</h1>
            <p className="text-gray-400 mb-6">
              The user profile you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={userData.image || undefined} />
                  <AvatarFallback className="bg-purple-600 text-white text-xl">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-white text-xl">
                  {userData.name || 'Unknown User'}
                </CardTitle>
                {currentUser?.id === userData.id && (
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    Your Profile
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-purple-400" />
                      <span>Books</span>
                    </div>
                    <span className="font-semibold">{stats.totalBooks}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4 text-green-400" />
                      <span>Total Upvotes</span>
                    </div>
                    <span className="font-semibold">{stats.totalUpvotes}</span>
                  </div>

                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-400">📊</span>
                      <span>Approval Rate</span>
                    </div>
                    <span className="font-semibold">{upvotePercentage.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Member Since */}
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member since joining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Books */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <span>Books by {userData.name || 'this user'}</span>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    {stats.totalBooks}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.books.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No books yet</h3>
                    <p className="text-gray-400 mb-6">
                      {currentUser?.id === userData.id 
                        ? "You haven't added any books yet." 
                        : "This user hasn't added any books yet."
                      }
                    </p>
                    {currentUser?.id === userData.id && (
                      <Link href="/create">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Add Your First Book
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData.books.map((book) => {
                      const createdAtString = safeDateToISOString(book.createdAt);

                      return (
                        <GoogleBookCard
                          key={book.id}
                          book={{
                            id: book.id,
                            name: book.name,
                            url: book.url,
                            posterUrl: book.posterUrl,
                            summary: book.summary,
                            genre: book.genre,
                            userId: userData.id,
                            createdAt: createdAtString,
                            updatedAt: createdAtString,
                            upvotes: book.upvotes,
                            downvotes: book.downvotes,
                            comments: [],
                            authorName: userData.name,
                          }}
                          compact={true}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
