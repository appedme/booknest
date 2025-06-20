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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Title */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Book Title
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter the book title"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="w-full text-base py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
          <p className="text-xs text-gray-500">
            Use the exact title as it appears on the book cover
          </p>
        </div>

        {/* Book URL */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="url" className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <LinkIcon className="h-4 w-4 text-green-600" />
            Book URL
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="url"
            type="url"
            placeholder="https://gitbook.com/your-book or https://drive.google.com/..."
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            required
            className="w-full text-base py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 font-medium mb-1">💡 Recommended Hosting Platforms:</p>
            <p className="text-xs text-blue-600">
              • <strong>GitBook:</strong> Professional documentation platform
              <br />
              • <strong>Google Drive:</strong> Share PDF files with public access
              <br />
              • <strong>GitHub Pages:</strong> Free hosting for markdown books
              <br />
              • <strong>Notion:</strong> Beautiful document sharing
            </p>
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="posterUrl" className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Image className="h-4 w-4 text-purple-600" />
            Cover Image URL
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="posterUrl"
            type="url"
            placeholder="https://example.com/book-cover.jpg"
            value={formData.posterUrl}
            onChange={(e) => handleChange('posterUrl', e.target.value)}
            required
            className="w-full text-base py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-purple-700 font-medium mb-1">🎨 Create Beautiful Covers:</p>
            <p className="text-xs text-purple-600">
              • <strong>Canva:</strong> Use professional book cover templates
              <br />
              • <strong>ChatGPT/DALL-E:</strong> Generate AI-powered custom covers
              <br />
              • <strong>Recommended size:</strong> 400x600px or similar book proportions
            </p>
          </div>
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre" className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Tag className="h-4 w-4 text-orange-600" />
            Genre
            <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.genre}
            onValueChange={(value) => handleChange('genre', value)}
            required
          >
            <SelectTrigger className="w-full text-base py-3 border-gray-300 focus:border-blue-500 rounded-lg">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {BOOK_GENRES.map((genre) => (
                <SelectItem key={genre} value={genre.toLowerCase().replace(/[^a-z0-9]/g, '_')} className="text-base">
                  <span className="capitalize">{genre}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="summary" className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <FileText className="h-4 w-4 text-indigo-600" />
            Book Summary
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="summary"
            placeholder="Write a compelling summary that will make readers want to explore your book. Include what makes it unique, who would benefit from reading it, and what they can expect to learn or experience..."
            value={formData.summary || ''}
            onChange={(e) => handleChange('summary', e.target.value)}
            required
            rows={6}
            className="w-full text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Write 100-500 words describing your book's content and value
            </p>
            <span className="text-xs text-gray-400">
              {(formData.summary || '').length} characters
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-base font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Publishing Your Book...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Publish Book to Community
            </>
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By publishing, you agree to our community guidelines and terms of service
          </p>
        </div>
      </div>
    </form>
  );
}
