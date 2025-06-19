"use client";

import { useState, useEffect } from 'react';
import { Book } from '@/types';

interface UseBooksReturn {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBooks(): UseBooksReturn {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/books', {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data: Book[] = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    isLoading,
    error,
    refetch: fetchBooks,
  };
}
