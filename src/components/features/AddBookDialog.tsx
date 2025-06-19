"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createBook, validateBookData } from "@/utils/books";
import { requireAuth } from "@/utils/auth";

interface AddBookDialogProps {
  onBookAdded?: () => void;
  children?: React.ReactNode;
}

export function AddBookDialog({ onBookAdded, children }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
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

    if (!requireAuth(isAuthenticated, login)) {
      return;
    }

    // Validate form data
    const errors = validateBookData(formData);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsSubmitting(true);

    try {
      await createBook(formData);
      
      // Reset form
      setFormData({
        name: '',
        url: '',
        posterUrl: '',
        summary: '',
        genre: '',
      });
      setOpen(false);
      onBookAdded?.();
    } catch (error) {
      console.error('Error adding book:', error);
      alert(error instanceof Error ? error.message : 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={() => login()} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        <Plus className="h-4 w-4 mr-2" />
        Add Book
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Share a Book
          </DialogTitle>
          <DialogDescription>
            Share an amazing book with the community. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Title */}
          <div className="space-y-2">
            <Label htmlFor="name">Book Title *</Label>
            <Input
              id="name"
              placeholder="Enter the book title"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Book URL */}
          <div className="space-y-2">
            <Label htmlFor="url">Book URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/book.pdf"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-muted-foreground">
              Link to where people can read or download the book
            </p>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => handleInputChange('genre', value)}
              required
            >
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
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

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="posterUrl">Cover Image URL (optional)</Label>
            <Input
              id="posterUrl"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={formData.posterUrl}
              onChange={(e) => handleInputChange('posterUrl', e.target.value)}
              className="focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-muted-foreground">
              Link to the book's cover image
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary (optional)</Label>
            <Textarea
              id="summary"
              placeholder="Tell us what this book is about..."
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className="focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {(formData.summary || '').length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.url || !formData.genre}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Book...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add Book
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
