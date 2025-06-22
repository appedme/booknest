import useSWR from 'swr';
import type { Review, BookRating } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

interface ReviewsResponse {
  reviews: Review[];
  rating: BookRating;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const useReviews = (bookId: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    bookId ? `/api/reviews?bookId=${bookId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const reviewsData = data as ReviewsResponse | undefined;

  return {
    reviews: reviewsData?.reviews || [],
    rating: reviewsData?.rating || {
      averageRating: 0,
      totalReviews: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
    },
    pagination: reviewsData?.pagination,
    isLoading,
    error,
    mutate,
  };
};
