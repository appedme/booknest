"use client";

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface UseVotingProps {
  onVoteSuccess?: () => void;
}

export function useVoting({ onVoteSuccess }: UseVotingProps = {}) {
  const [votingStates, setVotingStates] = useState<Record<number, boolean>>({});
  const { isAuthenticated, login } = useAuth();

  const vote = useCallback(async (bookId: number, voteType: 'upvote' | 'downvote') => {
    if (!isAuthenticated) {
      await login();
      return;
    }

    // Optimistic update
    setVotingStates(prev => ({ ...prev, [bookId]: true }));

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId, voteType }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      // Call the success callback instead of reloading
      onVoteSuccess?.();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setVotingStates(prev => ({ ...prev, [bookId]: false }));
    }
  }, [isAuthenticated, login, onVoteSuccess]);

  return {
    vote,
    isVoting: (bookId: number) => votingStates[bookId] || false,
  };
}
