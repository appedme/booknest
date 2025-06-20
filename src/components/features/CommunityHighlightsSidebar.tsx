"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { 
  BookOpen, 
  Clock, 
  Filter, 
  Heart, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Star,
  ChevronLeft,
  ChevronRight,
  Activity
} from "lucide-react";
import { Book } from "@/types";

interface CommunityHighlightsSidebarProps {
  books: Book[];
}

export function CommunityHighlightsSidebar({ books }: CommunityHighlightsSidebarProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stats = {
    totalBooks: books.length,
    thisWeek: books.filter(book => {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return new Date(book.createdAt).getTime() > oneWeekAgo;
    }).length,
    totalGenres: new Set(books.map(book => book.genre).filter(Boolean)).size,
    totalVotes: books.reduce((sum, book) => sum + (book.upvotes || 0) + (book.downvotes || 0), 0),
    totalComments: books.reduce((sum, book) => sum + (book.comments?.length || 0), 0),
    activeReaders: Math.floor(books.length * 1.5),
    avgRating: books.length > 0 ? (books.reduce((sum, book) => sum + (book.upvotes || 0), 0) / books.length).toFixed(1) : "0",
    topGenre: (() => {
      const genreCounts = books.reduce((acc, book) => {
        if (book.genre) acc[book.genre] = (acc[book.genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(genreCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || "fiction";
    })(),
  };

  const slides = [
    {
      title: "",
      stats: [
        { icon: BookOpen, label: "Books shared", value: 5, color: "text-blue-600", suffix: "Total Books" },
        { icon: Clock, label: "New additions", value: 2, color: "text-indigo-600", suffix: "This Week" },
        { icon: Filter, label: "Different genres", value: 4, color: "text-purple-600", suffix: "Genres" },
      ]
    },
    {
      title: "",
      stats: [
        { icon: Heart, label: "Community votes", value: 3, color: "text-red-600", suffix: "Total Votes" },
        { icon: MessageCircle, label: "Discussions", value: 1, color: "text-orange-600", suffix: "Comments" },
        { icon: Users, label: "Community members", value: 7, color: "text-green-600", suffix: "Active Readers" },
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-80 bg-background border-l border-border p-4 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Community Highlights</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          See how our reading community is growing and engaging with amazing books
        </p>

        {/* Slider Container */}
        <div className="relative">
          <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border shadow-md">
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {slides[currentSlide].stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={`${currentSlide}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/80 border"
                        >
                          <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-2xl font-bold text-foreground">
                              <AnimatedCounter value={stat.value} />
                            </div>
                            <div className="text-sm font-medium text-foreground">{stat.suffix}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Slide Indicators */}
                <div className="flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Message */}
        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-800 font-medium">
              Our community has shared knowledge equivalent to a small library! 📚
            </p>
          </div>
        </div>
      </div>

      {/* Additional Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 text-center bg-muted/30 rounded-lg border">
            <div className="text-sm font-semibold">2</div>
            <div className="text-xs text-muted-foreground">New this week</div>
          </div>
          <div className="p-2 text-center bg-muted/30 rounded-lg border">
            <div className="text-sm font-semibold">4</div>
            <div className="text-xs text-muted-foreground">Genres covered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
