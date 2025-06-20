"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Send,
  Filter,
  Calendar,
  Flag
} from "lucide-react";
import { Book } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface Rating {
  id: number;
  bookId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  review: string;
  helpfulCount: number;
  isHelpful?: boolean;
  createdAt: string;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface RatingAndFeedbackProps {
  book: Book;
  onRatingSubmit?: () => void;
}

export function RatingAndFeedback({ book, onRatingSubmit }: RatingAndFeedbackProps) {
  const { user, isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'helpful' | 'highest' | 'lowest'>('all');
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  useEffect(() => {
    // Mock data - in real app, this would come from an API
    const mockRatings: Rating[] = [
      {
        id: 1,
        bookId: book.id,
        userId: "user1",
        userName: "BookLover42",
        rating: 5,
        review: "Absolutely amazing book! The storytelling is incredible and I couldn't put it down. Highly recommend to anyone who loves this genre.",
        helpfulCount: 24,
        isHelpful: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        bookId: book.id,
        userId: "user2",
        userName: "CriticalReader",
        rating: 4,
        review: "Really good book with excellent character development. The plot was engaging though it dragged a bit in the middle. Still worth reading!",
        helpfulCount: 18,
        isHelpful: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        bookId: book.id,
        userId: "user3",
        userName: "QuickReader",
        rating: 3,
        review: "It was okay. Some parts were interesting but overall felt a bit predictable. Good for a light read.",
        helpfulCount: 7,
        isHelpful: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setRatings(mockRatings);
  }, [book.id]);

  const ratingStats: RatingStats = {
    averageRating: ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0,
    totalRatings: ratings.length,
    distribution: {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length,
    }
  };

  const filteredRatings = ratings.sort((a, b) => {
    switch (filterBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'helpful':
        return b.helpfulCount - a.helpfulCount;
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const handleSubmitRating = async () => {
    if (!userRating || !userReview.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // In real app, this would be an API call
      const newRating: Rating = {
        id: Date.now(),
        bookId: book.id,
        userId: user?.id || "anonymous",
        userName: userName || user?.name || "Anonymous",
        rating: userRating,
        review: userReview,
        helpfulCount: 0,
        createdAt: new Date().toISOString()
      };
      
      setRatings(prev => [newRating, ...prev]);
      setUserRating(0);
      setUserReview("");
      setUserName("");
      setShowReviewForm(false);
      onRatingSubmit?.();
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = (ratingId: number) => {
    setRatings(prev => prev.map(rating => 
      rating.id === ratingId 
        ? { ...rating, helpfulCount: rating.helpfulCount + (rating.isHelpful ? -1 : 1), isHelpful: !rating.isHelpful }
        : rating
    ));
  };

  const StarRating = ({ rating, size = "md", interactive = false, onRate }: { 
    rating: number; 
    size?: "sm" | "md" | "lg"; 
    interactive?: boolean; 
    onRate?: (rating: number) => void;
  }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6"
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= (interactive ? hoveredStar || userRating : rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={interactive ? () => onRate?.(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Ratings & Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-4xl font-bold">{ratingStats.averageRating.toFixed(1)}</span>
                <div>
                  <StarRating rating={ratingStats.averageRating} size="lg" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {ratingStats.totalRatings} review{ratingStats.totalRatings !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-8">{star}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${ratingStats.totalRatings > 0 ? (ratingStats.distribution[star as keyof typeof ratingStats.distribution] / ratingStats.totalRatings) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingStats.distribution[star as keyof typeof ratingStats.distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Button */}
          <div className="mt-6 pt-6 border-t">
            <Button
              onClick={() => setShowReviewForm(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={showReviewForm}
            >
              <Star className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle>Write Your Review</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Rating</label>
                    <StarRating 
                      rating={userRating} 
                      size="lg" 
                      interactive 
                      onRate={setUserRating}
                    />
                  </div>

                  {!isAuthenticated && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name (Optional)</label>
                      <Input
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Review</label>
                    <Textarea
                      placeholder="Share your thoughts about this book..."
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {userReview.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitRating}
                    disabled={!userRating || !userReview.trim() || isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle>Reviews ({filteredRatings.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'all' | 'recent' | 'helpful' | 'highest' | 'lowest')}
                className="bg-background border border-border rounded px-2 py-1 text-sm"
              >
                <option value="all">All Reviews</option>
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {filteredRatings.map((rating, index) => (
              <motion.div
                key={rating.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rating.userAvatar} />
                    <AvatarFallback>
                      {rating.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{rating.userName}</span>
                        <StarRating rating={rating.rating} size="sm" />
                        <Badge variant="outline" className="text-xs">
                          {rating.rating} star{rating.rating !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {rating.review}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(rating.id)}
                        className={`gap-1 ${rating.isHelpful ? 'text-blue-600' : 'text-muted-foreground'}`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({rating.helpfulCount})
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <MessageCircle className="h-3 w-3" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <Flag className="h-3 w-3" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredRatings.length === 0 && (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">Be the first to share your thoughts about this book!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
