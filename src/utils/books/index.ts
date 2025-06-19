import type { BookFormData } from '@/types';

/**
 * Handles book creation via API
 */
export async function createBook(data: BookFormData) {
  const response = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json() as any;
    throw new Error(error.error || 'Failed to create book');
  }

  return response.json();
}

/**
 * Validates book form data
 */
export function validateBookData(data: BookFormData): string[] {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Book name is required');
  }

  if (!data.url?.trim()) {
    errors.push('Book URL is required');
  } else if (!isValidURL(data.url)) {
    errors.push('Please enter a valid URL');
  }

  if (!data.genre?.trim()) {
    errors.push('Genre is required');
  }

  if (data.posterUrl && !isValidURL(data.posterUrl)) {
    errors.push('Please enter a valid poster URL');
  }

  return errors;
}

/**
 * Validates URL format
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats book data for display
 */
export function formatBookForDisplay(book: any) {
  return {
    ...book,
    createdAt: new Date(book.createdAt).toLocaleDateString(),
    updatedAt: new Date(book.updatedAt).toLocaleDateString(),
    summary: book.summary || 'No summary available',
  };
}
