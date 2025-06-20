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
        if (!isAuthenticated) {
            alert('Please sign in to like comments');
            return;
        }

        setIsLoading(true);

        // Optimistic update
        const newIsLiked = !isLiked;
        const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);

        try {
            const response = await fetch('/api/comment-likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentId }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            const data = await response.json() as { liked: boolean; message: string };
            // Update with actual server response in case of any discrepancy
            setIsLiked(data.liked);
            setLikeCount(prev => data.liked ? (prev < newLikeCount ? newLikeCount : prev) : (prev > newLikeCount ? newLikeCount : prev));
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert the optimistic update on error
            setIsLiked(!newIsLiked);
            setLikeCount(likeCount);
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
