"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Comment } from "@/components/features/Comment";
import { Comment as CommentType } from "@/types";
import { ANIMATIONS, STYLES } from "@/constants/book-detail";
import { mutate } from "swr";

interface BookDetailCommentsProps {
  bookId: string;
  comments: CommentType[];
  isAuthenticated: boolean;
  user: any;
}

export function BookDetailComments({
  bookId,
  comments,
  isAuthenticated,
  user,
}: BookDetailCommentsProps) {
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: parseInt(bookId),
          content: newComment,
          username: username || "Anonymous",
        }),
      });

      if (response.ok) {
        // Revalidate comments
        await mutate(`/api/comments?bookId=${bookId}`);
        setNewComment("");
        setUsername("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <motion.div
      initial={ANIMATIONS.CONTENT_INITIAL}
      animate={ANIMATIONS.CONTENT_ANIMATE}
      transition={{ ...ANIMATIONS.CONTENT_TRANSITION, delay: 0.6 }}
    >
      <Card className={STYLES.CARD_BG}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            Discussion ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-slate-300 focus:border-blue-500 bg-white/80"
              />
            </div>
            <Textarea
              placeholder="Share your thoughts about this book..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] border-slate-300 focus:border-blue-500 bg-white/80"
            />
            <Button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              className={STYLES.BUTTON_PRIMARY + " px-6 py-2 rounded-lg font-medium"}
            >
              {isSubmittingComment ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Post Comment
            </Button>
          </form>

          <Separator className="bg-slate-200" />

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  bookId={bookId}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No comments yet</p>
                <p className="text-slate-400">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
