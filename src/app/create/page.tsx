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
        
        <h1 className="text-4xl font-normal text-gray-900 mb-4">
          Add a Book to BookNest
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Share a book you love with the community. Help others discover their next great read!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border border-gray-200 text-center p-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Easy Sharing</h3>
          <p className="text-sm text-gray-600">
            Simply fill out the form and share your book recommendation with the community
          </p>
        </Card>

        <Card className="border border-gray-200 text-center p-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Community Impact</h3>
          <p className="text-sm text-gray-600">
            Help fellow readers discover amazing books and build our shared library
          </p>
        </Card>

        <Card className="border border-gray-200 text-center p-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Gain Recognition</h3>
          <p className="text-sm text-gray-600">
            Get upvotes and comments from the community for your great recommendations
          </p>
        </Card>
      </div>

      {/* Enhanced Guidelines with Hosting Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Guidelines */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Sharing Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>Share books you've actually read and enjoyed</span>
              </p>
              <p className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>Write a thoughtful description of why you recommend it</span>
              </p>
              <p className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>Include accurate information about the book</span>
              </p>
              <p className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>Choose an appropriate genre classification</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2 mt-0.5">✗</span>
                <span>Don't spam or share inappropriate content</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2 mt-0.5">✗</span>
                <span>Violation of guidelines may result in account suspension</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hosting Options */}
        <Card className="border border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Where to Host Your Book
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Choose the best platform to share your book content:
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recommended Option */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Badge className="bg-blue-600 text-white text-xs mr-2">RECOMMENDED</Badge>
                  <h4 className="font-semibold text-gray-900">GitBook</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Professional documentation platform perfect for books and guides.
                </p>
                <a 
                  href="https://gitbook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Create on GitBook →
                </a>
              </div>

              {/* Other Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h5 className="font-medium text-gray-900">Google Drive</h5>
                    <p className="text-xs text-gray-500">Share PDF files easily</p>
                  </div>
                  <a 
                    href="https://drive.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    Open →
                  </a>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h5 className="font-medium text-gray-900">Notion</h5>
                    <p className="text-xs text-gray-500">Beautiful document sharing</p>
                  </div>
                  <a 
                    href="https://notion.so" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    Open →
                  </a>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h5 className="font-medium text-gray-900">GitHub Pages</h5>
                    <p className="text-xs text-gray-500">Free web hosting for repositories</p>
                  </div>
                  <a 
                    href="https://pages.github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    Learn →
                  </a>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h5 className="font-medium text-gray-900">Medium</h5>
                    <p className="text-xs text-gray-500">Publishing platform for articles</p>
                  </div>
                  <a 
                    href="https://medium.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    Open →
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cover Design Help */}
      <Card className="border border-purple-200 bg-purple-50/50 mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            Create Beautiful Book Covers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">Canva</h4>
              <p className="text-sm text-gray-600 mb-3">
                Professional design tool with book cover templates and easy drag-and-drop interface.
              </p>
              <a 
                href="https://canva.com/create/book-covers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Design on Canva →
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">ChatGPT + DALL-E</h4>
              <p className="text-sm text-gray-600 mb-3">
                AI-powered image generation for unique, custom book covers tailored to your content.
              </p>
              <a 
                href="https://chat.openai.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Create with AI →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-900">Book Details</CardTitle>
          <p className="text-gray-600">
            Fill in the details about the book you want to share with the community.
          </p>
        </CardHeader>
        <CardContent>
          <AddBookForm />
        </CardContent>
      </Card>

      {/* Community Support */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Building Our Library Together
          </h3>
          <p className="text-gray-600 mb-4">
            Every book you share helps create a richer, more diverse reading community.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Community Driven
            </span>
            <span className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Quality Focused
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Discovery Powered
            </span>
          </div>
        </div>
      </div>
    </GoogleBooksLayout>
  );
}
