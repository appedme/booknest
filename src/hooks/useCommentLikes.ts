"use client";

import { useState } from 'react';
import { useAuth } from './useAuth';

interface UseCommentLikesProps {
  commentId: number;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
}

export function useCommentLikes({ commentId, initialLikeCount = 0, initialIsLiked = false }: UseCommentLikesProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleLike = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/comment-likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        const data = await response.json() as { liked: boolean; message: string };
        setIsLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      } else {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert the optimistic update
      if (!isAuthenticated) {
        alert('Please sign in to like comments');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    likeCount,
    isLiked,
    isLoading,
    toggleLike,
  };
}
