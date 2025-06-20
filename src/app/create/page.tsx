"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBookDialog } from "@/components/features/AddBookDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Plus, Sparkles, Check, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function CreateBookPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 hover:bg-white/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Share Your Discovery
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Add a New Book
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share an amazing book with our community and help others discover their next great read.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-sm bg-white/80 text-center">
            <CardContent className="p-6">
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Growing Community</h3>
              <p className="text-sm text-gray-600">Join thousands of book lovers</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80 text-center">
            <CardContent className="p-6">
              <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Get Discovered</h3>
              <p className="text-sm text-gray-600">Your recommendations matter</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80 text-center">
            <CardContent className="p-6">
              <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Build Library</h3>
              <p className="text-sm text-gray-600">Curate the best collection</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Book Form */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="text-center pb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 w-fit mx-auto mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Ready to Share?
                </CardTitle>
                <p className="text-gray-600">
                  Click below to open the book creation form and share your recommendation.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <AddBookDialog redirectToDashboard={true}>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all text-lg py-6"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Book Details
                    </Button>
                  </AddBookDialog>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <Check className="h-5 w-5 mr-2 text-green-600" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                      <Check className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Quality Links</h4>
                      <p className="text-sm text-gray-600">Use legitimate book URLs (Amazon, Goodreads, etc.)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">High-Quality Images</h4>
                      <p className="text-sm text-gray-600">Use clear, high-resolution book cover images</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 rounded-full p-1.5 mt-0.5">
                      <Check className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Compelling Summary</h4>
                      <p className="text-sm text-gray-600">Write engaging descriptions to attract readers</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 rounded-full p-1.5 mt-0.5">
                      <Check className="h-3 w-3 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Accurate Genre</h4>
                      <p className="text-sm text-gray-600">Choose the most appropriate category</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">💡 Pro Tip</p>
                  <p className="text-sm text-blue-700">
                    Books with detailed summaries and proper categorization get more engagement from the community!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
