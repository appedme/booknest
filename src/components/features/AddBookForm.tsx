"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BOOK_GENRES } from "@/constants/books";
import { BookFormData } from "@/types";
import { BookOpen, Loader2, Upload, Link as LinkIcon, Image, FileText, Tag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createBook, validateBookData } from "@/utils/books";
import { requireAuth } from "@/utils/auth";

interface AddBookFormProps {
  onBookAdded?: () => void;
  redirectToDashboard?: boolean;
}

export function AddBookForm({ onBookAdded, redirectToDashboard = false }: AddBookFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    url: '',
    posterUrl: '',
    summary: '',
    genre: '',
  });
  const { isAuthenticated, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      await login();
      return;
    }

    if (!requireAuth(isAuthenticated, () => login())) return;

    setIsSubmitting(true);

    try {
      const validationErrors = validateBookData(formData);
      if (validationErrors.length > 0) {
        alert(validationErrors.join('\n'));
        return;
      }

      const result = await createBook(formData);
      
      // Reset form
      setFormData({
        name: '',
        url: '',
        posterUrl: '',
        summary: '',
        genre: '',
      });

      // Show success message
      alert('Book added successfully!');

      // Call callback if provided
      if (onBookAdded) {
        onBookAdded();
      }

      // Redirect if requested
      if (redirectToDashboard) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof BookFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-0 shadow-xl bg-white max-w-2xl mx-auto">
      <CardHeader className="text-center pb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 w-fit mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Add Book Details
        </CardTitle>
        <p className="text-gray-600">
          Share your book recommendation with the community
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Title */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Book Title
            </Label>
            <Input
              id="name"
              placeholder="Enter the book title"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Book URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2 text-sm font-medium">
              <LinkIcon className="h-4 w-4" />
              Book URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/book-page"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Link to where people can find or buy this book
            </p>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="posterUrl" className="flex items-center gap-2 text-sm font-medium">
              <Image className="h-4 w-4" />
              Cover Image URL
            </Label>
            <Input
              id="posterUrl"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={formData.posterUrl}
              onChange={(e) => handleChange('posterUrl', e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Direct link to the book's cover image
            </p>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4" />
              Genre
            </Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => handleChange('genre', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {BOOK_GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Summary
            </Label>
            <Textarea
              id="summary"
              placeholder="Write a compelling description of the book..."
              value={formData.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              required
              rows={4}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-500">
              Help others understand what makes this book special
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all text-lg py-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Adding Book...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Add Book to Library
              </>
            )}
          </Button>
        </form>

        {/* Pro Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-2">💡 Pro Tips</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use high-quality cover images for better visibility</li>
            <li>• Write engaging summaries to attract more readers</li>
            <li>• Choose the most accurate genre for discoverability</li>
            <li>• Include legitimate purchase/reading links</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
