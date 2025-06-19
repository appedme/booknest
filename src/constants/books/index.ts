// Book genres configuration
export const BOOK_GENRES = [
  'Programming',
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'Business',
  'Biography',
  'History',
  'Philosophy',
  'Self-Help',
  'Art & Design',
  'Education',
  'Health & Fitness',
  'Travel',
  'Mystery',
  'Romance',
  'Fantasy',
  'Sci-Fi',
  'Horror',
  'Comedy',
  'Drama',
  'Other',
] as const;

// Vote types
export const VOTE_TYPES = {
  UPVOTE: 'upvote',
  DOWNVOTE: 'downvote',
} as const;

// Book validation rules
export const BOOK_VALIDATION = {
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  SUMMARY: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  URL: {
    ALLOWED_PROTOCOLS: ['http', 'https'],
  },
} as const;

// Pagination settings
export const PAGINATION = {
  BOOKS_PER_PAGE: 12,
  COMMENTS_PER_PAGE: 20,
} as const;

// Sort options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  MOST_VOTED: 'most_voted',
  LEAST_VOTED: 'least_voted',
  ALPHABETICAL: 'alphabetical',
} as const;
