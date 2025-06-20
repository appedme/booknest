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
      color: "text-foreground",
      bgColor: "bg-muted/30",
      description: "Books shared",
    },
    {
      icon: Clock,
      label: "This Week",
      value: stats.thisWeek,
      color: "text-foreground",
      bgColor: "bg-muted/30",
      description: "New additions",
    },
    {
      icon: Filter,
      label: "Genres",
      value: stats.totalGenres,
      color: "text-foreground",
      bgColor: "bg-muted/30",
      description: "Different genres",
    },
    {
      icon: Heart,
      label: "Total Votes",
      value: stats.totalVotes,
      color: "text-foreground",
      bgColor: "bg-muted/30",
      description: "Community votes",
    },
    {
      icon: MessageCircle,
      label: "Comments",
      value: stats.totalComments,
      color: "text-foreground",
      bgColor: "bg-muted/30",
      description: "Discussions",
    },
    {
      icon: Users,
      label: "Active Readers",
      value: stats.activeReaders,
      color: "text-foreground",
      bgColor: "bg-muted/30",
      description: "Community members",
    },
  ];

  return (
    <section className="py-12 bg-background border-b">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Community Highlights
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See how our reading community is growing and engaging with amazing books
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="text-center border bg-muted/40 shadow-none hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 md:p-5 flex flex-col items-center">
                    <div className="rounded-full p-2 mb-2 bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-foreground mb-0.5">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-xs font-medium text-foreground mb-0.5 tracking-tight">{stat.label}</div>
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
          <Card className="inline-block bg-muted/60 border border-yellow-100 dark:border-yellow-900">
            <CardContent className="p-3">
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
