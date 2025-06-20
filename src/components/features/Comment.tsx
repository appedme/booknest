"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommentLikes } from "@/hooks/useCommentLikes";
import { useAuth } from "@/hooks/useAuth";
import { Comment as CommentType } from "@/types";
import {
  Heart,
  MessageCircle,
  User,
  Send,
  Loader2
} from "lucide-react";
import { mutate } from "swr";

interface CommentProps {
  comment: CommentType;
  bookId: string;
  isReply?: boolean;
}

export function Comment({ comment, bookId, isReply = false }: CommentProps) {
  const { isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  const { likeCount, isLiked, isLoading, toggleLike } = useCommentLikes({
    commentId: comment.id,
    initialLikeCount: comment.likeCount || 0,
    initialIsLiked: comment.isLiked || false,
  });

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: parseInt(bookId),
          content: replyContent,
          parentCommentId: comment.id,
        }),
      });

      if (response.ok) {
        // Revalidate comments
        await mutate(`/api/comments?bookId=${bookId}`);
        setReplyContent("");
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      alert("Please sign in to like comments");
      return;
    }
    toggleLike();
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : ''}`}>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">
                {comment.authorName || "Anonymous"}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-3">{comment.content}</p>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${isLiked 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                }`}
                onClick={handleLike}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                )}
                <span className="text-xs font-medium">{likeCount}</span>
              </Button>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert("Please sign in to reply to comments");
                      return;
                    }
                    setShowReplyForm(!showReplyForm);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Reply</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-3 ml-8">
          <form onSubmit={handleReplySubmit} className="space-y-3">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                size="sm" 
                disabled={isSubmittingReply || !replyContent.trim()}
              >
                {isSubmittingReply ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-1" />
                )}
                Reply
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              bookId={bookId} 
              isReply={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
