"use client";

import useSWR from 'swr';
import type { Book } from '@/types';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// SWR hook for fetching all books
export function useBooks(filters?: {
  genre?: string;
  search?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.genre) params.append('genre', filters.genre);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const url = `/api/books${params.toString() ? `?${params.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    books: (data as { books: Book[] })?.books || [],
    pagination: (data as { pagination: { page: number; limit: number; total: number; totalPages: number } })?.pagination,
    isLoading,
    isError: error,
    mutate, // For manual revalidation
  };
}

// SWR hook for fetching a single book
export function useBook(id: string | number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/books/${id}` : null,
    fetcher
  );

  return {
    book: data as Book,
    isLoading,
    isError: error,
    mutate,
  };
}

// SWR hook for fetching genres
export function useGenres() {
  const { data, error, isLoading } = useSWR('/api/genres', fetcher);

  return {
    genres: (data as string[]) || [],
    isLoading,
    isError: error,
  };
}
