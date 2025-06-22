"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, 
  ThumbsUp, 
  Send, 
  Loader2, 
  User,
  MessageSquare,
  TrendingUp,
  Award,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Review, BookRating, ReviewFormData } from "@/types";
import useSWR, { mutate } from "swr";

interface ReviewsProps {
  bookId: number;
  className?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export function Reviews({ bookId, className }: ReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    title: "",
    content: "",
    authorName: "",
  });

  // Fetch reviews and ratings
  const { data: reviewsData, isLoading: reviewsLoading } = useSWR(
    `/api/reviews?bookId=${bookId}`,
    fetcher
  );

  const reviews = (reviewsData as any)?.reviews || [];
  const rating = (reviewsData as any)?.rating || {
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0,
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: bookId.toString(),
          ...reviewForm,
        }),
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        alert(error.error || "Failed to submit review");
        return;
      }

      // Reset form and close
      setReviewForm({
        rating: 5,
        title: "",
        content: "",
        authorName: "",
      });
      setShowReviewForm(false);

      // Refresh reviews
      mutate(`/api/reviews?bookId=${bookId}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      const response = await fetch("/api/reviews/helpful", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId: reviewId.toString() }),
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        alert(error.error || "Failed to mark as helpful");
        return;
      }

      // Refresh reviews to update helpful count
      mutate(`/api/reviews?bookId=${bookId}`);
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      alert("Failed to mark as helpful. Please try again.");
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize = size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5";
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const total = rating.totalReviews;
    if (total === 0) return [];

    return [
      { stars: 5, count: rating.fiveStars, percentage: (rating.fiveStars / total) * 100 },
      { stars: 4, count: rating.fourStars, percentage: (rating.fourStars / total) * 100 },
      { stars: 3, count: rating.threeStars, percentage: (rating.threeStars / total) * 100 },
      { stars: 2, count: rating.twoStars, percentage: (rating.twoStars / total) * 100 },
      { stars: 1, count: rating.oneStar, percentage: (rating.oneStar / total) * 100 },
    ];
  };

  if (reviewsLoading) {
    return (
      <Card className={cn("border-0 shadow-lg", className)}>
        <CardHeader>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          Reviews & Ratings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Overall Rating Summary */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="text-4xl font-bold">{rating.averageRating.toFixed(1)}</span>
                {renderStars(Math.round(rating.averageRating), "lg")}
              </div>
              <p className="text-muted-foreground">
                Based on {rating.totalReviews} review{rating.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {getRatingDistribution().map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-sm w-8">{item.stars}★</span>
                  <Progress value={item.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        {!showReviewForm && (
          <div className="mb-6">
            <Button 
              onClick={() => setShowReviewForm(true)}
              className="w-full md:w-auto"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>
        )}

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="border-2 border-dashed border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Write Your Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={cn(
                                "h-6 w-6",
                                star <= reviewForm.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 hover:text-yellow-300"
                              )}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Review Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Review Title (Optional)
                      </label>
                      <Input
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        placeholder="Summarize your review in a few words"
                        maxLength={100}
                      />
                    </div>

                    {/* Review Content */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Review
                      </label>
                      <Textarea
                        value={reviewForm.content}
                        onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                        placeholder="Share your thoughts about this book..."
                        rows={4}
                        required
                      />
                    </div>

                    {/* Author Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Name (Optional)
                      </label>
                      <Input
                        value={reviewForm.authorName}
                        onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                        placeholder="Anonymous"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Submit Review
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowReviewForm(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to review this book!</p>
            </div>
          ) : (
            reviews.map((review: Review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">
                          {review.authorName || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating, "sm")}
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {review.title && (
                      <h5 className="font-medium mb-2">{review.title}</h5>
                    )}

                    <p className="text-gray-700 leading-relaxed mb-3">
                      {review.content}
                    </p>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkHelpful(review.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpfulCount})
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
