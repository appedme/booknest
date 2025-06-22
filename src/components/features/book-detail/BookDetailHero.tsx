"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bookmark, Share2, ThumbsUp, ThumbsDown, Copy, Twitter, Facebook } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ANIMATIONS, STYLES } from "@/constants/book-detail";
import { handleShare } from "@/utils/book-detail";

interface BookDetailHeroProps {
  book: any;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onVote: (action: 'upvote' | 'downvote') => Promise<void>;
  hasVoted: boolean;
  voteType: string | null;
  isVotingLoading: boolean;
}

export function BookDetailHero({
  book,
  isBookmarked,
  onBookmarkToggle,
  onVote,
  hasVoted,
  voteType,
  isVotingLoading,
}: BookDetailHeroProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShareAction = (platform?: string) => {
    handleShare(platform, book, () => setShowShareMenu(false));
  };
  return (
    <div className={STYLES.HERO_BG}>
      
      <div className="relative container mx-auto px-6 py-12">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Books</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookmarkToggle}
              className={cn(
                "h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300",
                isBookmarked && "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Share2 className="h-4 w-4 text-white" />
              </Button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-12 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl p-3 z-50 min-w-[160px]"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-slate-100 rounded-lg"
                      onClick={() => handleShareAction('copy')}
                    >
                      <Copy className="h-4 w-4 mr-3 text-slate-600" />
                      <span className="text-slate-700">Copy Link</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-slate-100 rounded-lg"
                      onClick={() => handleShareAction('twitter')}
                    >
                      <Twitter className="h-4 w-4 mr-3 text-blue-400" />
                      <span className="text-slate-700">Twitter</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-slate-100 rounded-lg"
                      onClick={() => handleShareAction('facebook')}
                    >
                      <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                      <span className="text-slate-700">Facebook</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Book Cover */}
          <motion.div
            initial={ANIMATIONS.HERO_INITIAL}
            animate={ANIMATIONS.HERO_ANIMATE}
            transition={{ ...ANIMATIONS.HERO_TRANSITION, delay: 0.4 }}
            className="lg:col-span-2 flex justify-center lg:justify-start"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={book.coverImage || "/book-placeholder.jpg"}
                alt={book.name}
                className="relative w-80 h-[480px] object-cover rounded-2xl shadow-2xl border-4 border-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Book Info */}
          <motion.div
            initial={ANIMATIONS.HERO_INITIAL}
            animate={ANIMATIONS.HERO_ANIMATE}
            transition={{ ...ANIMATIONS.HERO_TRANSITION, delay: 0.6 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Title and Author */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {book.name}
              </h1>
              <p className="text-xl text-slate-300 font-medium">
                by {book.author}
              </p>
              <div className="flex flex-wrap gap-2">
                {book.genre && (
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium border border-blue-400/30">
                    {book.genre}
                  </span>
                )}
                {book.publicationYear && (
                  <span className="px-4 py-2 bg-white/10 text-slate-200 rounded-full text-sm font-medium border border-white/20">
                    {book.publicationYear}
                  </span>
                )}
              </div>
            </div>

            {/* Voting Buttons */}
            <motion.div
              initial={ANIMATIONS.STATS_INITIAL}
              animate={ANIMATIONS.STATS_ANIMATE}
              transition={{ ...ANIMATIONS.STATS_TRANSITION, delay: 0.8 }}
              className="flex gap-4"
            >
              <Button
                onClick={() => onVote('upvote')}
                disabled={isVotingLoading}
                className={cn(
                  "h-12 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105",
                  voteType === 'upvote'
                    ? "bg-green-500/20 text-green-300 border border-green-400/30"
                    : "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                )}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {book.upvotes || 0}
              </Button>
              <Button
                onClick={() => onVote('downvote')}
                disabled={isVotingLoading}
                className={cn(
                  "h-12 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105",
                  voteType === 'downvote'
                    ? "bg-red-500/20 text-red-300 border border-red-400/30"
                    : "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                )}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                {book.downvotes || 0}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
