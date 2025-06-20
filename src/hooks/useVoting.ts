"use client";

import useSWR, { mutate } from 'swr';
import { useAuth } from './useAuth';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export function useVoting(bookId: number) {
  const { isAuthenticated } = useAuth();

  // SWR hook for vote status
  const { data: voteData, error, isLoading } = useSWR(
    bookId ? `/api/votes?bookId=${bookId}` : null,
    fetcher
  );

  const vote = async (voteType: 'upvote' | 'downvote') => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          voteType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to vote');
      }

      // Revalidate vote status and book data
      await mutate(`/api/votes?bookId=${bookId}`);
      await mutate(`/api/books/${bookId}`);
      await mutate('/api/books'); // Revalidate books list too

      return await response.json();
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  const upvote = () => vote('upvote');
  const downvote = () => vote('downvote');

  return {
    hasVoted: (voteData as any)?.hasVoted || false,
    voteType: (voteData as any)?.voteType || null,
    isLoading,
    error,
    upvote,
    downvote,
    vote,
  };
}
