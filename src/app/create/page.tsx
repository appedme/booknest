"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBookDialog } from "@/components/features/AddBookDialog";
import { Header } from "@/components/features/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50">
        <Header />
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
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Share a great book with the community. Add the book details below to get started.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Book Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to add your book?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click the button below to open the book creation form.
                  </p>
                  <AddBookDialog redirectToDashboard={true}>
                    <Button size="lg" className="px-8">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Book Details
                    </Button>
                  </AddBookDialog>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    Guidelines for Adding Books
                  </h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Make sure the book URL points to a legitimate book resource
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Use a high-quality book cover image for the poster URL
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Write a compelling summary to help others discover the book
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Choose the most appropriate genre for better discoverability
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
