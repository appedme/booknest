// Authentication types
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  user: User;
  expires: string;
}

// Book related types
export interface Book {
  id: number;
  name: string;
  url: string;
  posterUrl: string | null;
  summary: string | null;
  genre: string;
  userId: string | null;
  authorName?: string | null;
  authorImage?: string | null;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  userVote?: 'upvote' | 'downvote' | null;
}

export interface Comment {
  id: number;
  content: string;
  authorName: string | null;
  authorImage?: string | null;
  createdAt: string;
  bookId: number;
  parentCommentId?: number | null;
  replies?: Comment[];
  likeCount?: number;
  isLiked?: boolean;
}

export interface CommentLike {
  id: number;
  commentId: number;
  userId: string | null;
  ipHash: string | null;
  createdAt: string;
}

export interface Vote {
  id: number;
  bookId: number;
  ipHash: string;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
}

// Review related types
export interface Review {
  id: number;
  bookId: number;
  userId: string | null;
  authorName: string | null;
  rating: number; // 1-5 stars
  title: string | null;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  isHelpful?: boolean; // Whether current user marked as helpful
}

export interface BookRating {
  id: number;
  bookId: number;
  averageRating: number; // Decimal value (e.g., 4.2)
  totalReviews: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
  updatedAt: string;
}

// Form types
export interface BookFormData {
  name: string;
  url: string;
  posterUrl?: string;
  summary?: string;
  genre: string;
}

export interface CommentFormData {
  content: string;
  authorName?: string;
}

export interface ReviewFormData {
  rating: number;
  title?: string;
  content: string;
  authorName?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  books: T[];
  pagination: {
    limit: number;
    offset: number;
    total?: number;
  };
}

// Filter and sort types
export interface BookFilters {
  genre?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'most_voted' | 'least_voted' | 'alphabetical';
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface ModalState {
  isOpen: boolean;
  type?: 'book-details' | 'add-book' | 'edit-book' | null;
  data?: unknown;
}
