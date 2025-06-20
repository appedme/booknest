"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { BookOpen, Clock, Filter, Heart, Users, TrendingUp, MessageCircle, Star } from "lucide-react";
import { Book } from "@/types";

interface CommunityHighlightsProps {
  books: Book[];
}

export function CommunityHighlights({ books }: CommunityHighlightsProps) {
  const stats = {
    totalBooks: books.length,
    thisWeek: books.filter(book => {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return new Date(book.createdAt).getTime() > oneWeekAgo;
    }).length,
    totalGenres: new Set(books.map(book => book.genre).filter(Boolean)).size,
    totalVotes: books.reduce((sum, book) => sum + (book.upvotes || 0) + (book.downvotes || 0), 0),
    totalComments: books.reduce((sum, book) => sum + (book.comments?.length || 0), 0),
    activeReaders: Math.floor(books.length * 1.5), // Estimated active readers
  };

  const communityStats = [
    {
      icon: BookOpen,
      label: "Total Books",
      value: stats.totalBooks,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "Books shared",
    },
    {
      icon: Clock,
      label: "This Week",
      value: stats.thisWeek,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      description: "New additions",
    },
    {
      icon: Filter,
      label: "Genres",
      value: stats.totalGenres,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: "Different genres",
    },
    {
      icon: Heart,
      label: "Total Votes",
      value: stats.totalVotes,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      description: "Community votes",
    },
    {
      icon: MessageCircle,
      label: "Comments",
      value: stats.totalComments,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      description: "Discussions",
    },
    {
      icon: Users,
      label: "Active Readers",
      value: stats.activeReaders,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      description: "Community members",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Community Highlights
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how our reading community is growing and engaging with amazing books
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm card-hover">
                  <CardContent className="p-4 md:p-6">
                    <div className={`${stat.bgColor} rounded-full p-3 w-fit mx-auto mb-3`}>
                      <Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <Card className="inline-block bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Our community has shared knowledge equivalent to a small library! 📚
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
