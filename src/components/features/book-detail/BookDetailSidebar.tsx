"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  TrendingUp, 
  Users, 
  Award,
  Star,
  Calendar,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ANIMATIONS } from "@/constants/book-detail";

interface BookDetailSidebarProps {
  book: any;
  totalVotes: number;
  ratingPercentage: number;
  totalCommentCount: number;
}

export function BookDetailSidebar({
  book,
  totalVotes,
  ratingPercentage,
  totalCommentCount,
}: BookDetailSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <motion.div
        initial={ANIMATIONS.SIDEBAR_INITIAL}
        animate={ANIMATIONS.SIDEBAR_ANIMATE}
        transition={ANIMATIONS.SIDEBAR_TRANSITION}
      >
        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              className="w-full justify-start bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
            >
              <Link href={book.url} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Online
              </Link>
            </Button>
            <Button
              disabled
              className="w-full justify-start bg-slate-100 text-slate-500 border border-slate-200"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Add Bookmark
            </Button>
            <Button
              disabled
              className="w-full justify-start bg-slate-100 text-slate-500 border border-slate-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Book
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Book Details */}
      <motion.div
        initial={ANIMATIONS.SIDEBAR_INITIAL}
        animate={ANIMATIONS.SIDEBAR_ANIMATE}
        transition={{ ...ANIMATIONS.SIDEBAR_TRANSITION, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Book Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {book.publicationYear && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Published
                </span>
                <Badge variant="secondary">{book.publicationYear}</Badge>
              </div>
            )}
            {book.genre && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Genre
                </span>
                <Badge variant="outline">{book.genre}</Badge>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Engagement
              </span>
              <Badge variant="secondary">{Math.round(ratingPercentage)}% positive</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={ANIMATIONS.SIDEBAR_INITIAL}
        animate={ANIMATIONS.SIDEBAR_ANIMATE}
        transition={{ ...ANIMATIONS.SIDEBAR_TRANSITION, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No recent activity</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
