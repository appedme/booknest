"use client";

import { motion } from "framer-motion";
import { GoogleBookCard } from "./GoogleBookCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Book } from "@/types";
import Link from "next/link";

interface TrendingBooksProps {
  books: Book[];
  onVoteSuccess?: () => void;
  onComment?: (bookId: number) => void;
}

export function TrendingBooks({ books, onVoteSuccess, onComment }: TrendingBooksProps) {
  // Sort books by engagement score (upvotes - downvotes + comments)
  const trendingBooks = books
    .sort((a, b) => {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0) + (a.comments?.length || 0) * 0.5;
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0) + (b.comments?.length || 0) * 0.5;
      return scoreB - scoreA;
    })
    .slice(0, 4);

  if (trendingBooks.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Trending Now
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the books that are creating buzz in our community right now
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trendingBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GoogleBookCard book={book} onVote={(bookId, type) => {
                // Handle vote callback
                onVoteSuccess?.();
              }} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/trending">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              View All Trending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
