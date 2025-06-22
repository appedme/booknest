"use client";import { motion } from "framer-motion";import { TrendingUp, MessageCircle, Star, BookOpen } from "lucide-react";import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";import { ANIMATIONS } from "@/constants/book-detail";interface BookDetailStatsProps {  book: any;  totalCommentCount: number;  ratingPercentage: number;}export function BookDetailStats({  book,  totalCommentCount,  ratingPercentage,}: BookDetailStatsProps) {  const totalVotes = (book?.upvotes || 0) + (book?.downvotes || 0);    const stats = [    {       label: "Total Votes",       value: totalVotes,      icon: TrendingUp,      color: "text-blue-600"    },    {       label: "Comments",       value: totalCommentCount,      icon: MessageCircle,      color: "text-green-600"    },    {       label: "Rating",       value: `${ratingPercentage.toFixed(1)}%`,      icon: Star,      color: "text-yellow-600"    },    {       label: "Genre",       value: book?.genre || "Unknown",      icon: BookOpen,      color: "text-purple-600"    }  ];  return (    <motion.div      initial={ANIMATIONS.CONTENT_INITIAL}      animate={ANIMATIONS.CONTENT_ANIMATE}      transition={{ ...ANIMATIONS.CONTENT_TRANSITION, delay: 0.1 }}    >
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Book Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`flex justify-center mb-2 ${stat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
