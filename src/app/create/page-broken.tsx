"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBookForm } from "@/components/features/AddBookForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Sparkles, Check, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { GoogleBooksLayout } from "@/components/features/GoogleBooksLayout";

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
      <GoogleBooksLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </GoogleBooksLayout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <GoogleBooksLayout>
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-google-blue text-white px-4 py-1.5 mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          Share Your Discovery
        </Badge>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Book Form */}
            <div className="lg:col-span-2">
              <AddBookForm redirectToDashboard={true} />
            </div>

            {/* Guidelines */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl bg-white h-fit">
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
    </div>
  );
}
