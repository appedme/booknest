"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { GENRES } from "@/lib/schema";

interface BookEditClientProps {
  book: {
    id: number;
    name: string;
    url: string;
    posterUrl: string | null;
    summary: string | null;
    genre: string;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
    authorName: string | null;
    authorEmail: string | null;
  };
}

export default function BookEditClient({ book }: BookEditClientProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: book.name,
    url: book.url,
    posterUrl: book.posterUrl || "",
    summary: book.summary || "",
    genre: book.genre,
  });

  // Check if user is authorized to edit this book
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=/books/${book.id}/edit`);
      return;
    }

    if (user && book.userId !== user.id) {
      router.push(`/books/${book.id}`);
      return;
    }
  }, [isAuthenticated, user, book.userId, book.id, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/books/${book.id}`);
      } else {
        const errorData = await response.json() as { error?: string };
        alert(errorData.error || "Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
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

  if (user && book.userId !== user.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
            <p className="mb-6">You don't have permission to edit this book.</p>
            <Link href={`/books/${book.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Book
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
          <Link href={`/books/${book.id}`}>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Book
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Book</h1>
          <div className="w-24"></div> {/* Spacer for center alignment */}
        </div>

        {/* Edit Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Book Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Book Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Book Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter book name"
                    required
                  />
                </div>

                {/* Book URL */}
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-white">Book URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://example.com/book"
                    required
                  />
                </div>

                {/* Poster URL */}
                <div className="space-y-2">
                  <Label htmlFor="posterUrl" className="text-white">Cover Image URL</Label>
                  <Input
                    id="posterUrl"
                    type="url"
                    value={formData.posterUrl}
                    onChange={(e) => handleInputChange("posterUrl", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-white">Genre</Label>
                  <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre} className="text-white hover:bg-white/10">
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <Label htmlFor="summary" className="text-white">Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                    placeholder="Enter book summary..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Book
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
