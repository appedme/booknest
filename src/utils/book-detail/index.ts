import { Comment as CommentType } from "@/types";

/**
 * Calculate total comment count including replies
 */
export function calculateTotalCommentCount(comments: CommentType[]): number {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);
}

/**
 * Calculate rating percentage from votes
 */
export function calculateRatingPercentage(upvotes: number = 0, downvotes: number = 0): number {
  const totalVotes = upvotes + downvotes;
  return totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
}

/**
 * Handle share functionality
 */
export function handleShare(platform: string | undefined, book: any, callback?: () => void) {
  const url = window.location.href;
  const title = `Check out "${book?.name}" on BookNest`;
  
  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
      break;
    default:
      if (navigator.share) {
        navigator.share({ title, url });
      } else {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
  }
  callback?.();
}

/**
 * Fetcher function for SWR
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// Aliases for backward compatibility
export const getCommentCount = calculateTotalCommentCount;
