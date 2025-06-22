"use client";

import { motion } from "framer-motion";
import { GoogleBookCard } from "./GoogleBookCard";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { Book } from "@/types";
import Link from "next/link";

interface LatestBooksProps {
  books: Book[];
  onVoteSuccess?: () => void;
  onComment?: (bookId: number) => void;
}

export function LatestBooks({ books, onVoteSuccess, onComment }: LatestBooksProps) {
  // Sort books by creation date (most recent first)
  const latestBooks = books
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  if (latestBooks.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-green-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Latest Additions
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fresh picks from our community - newly shared books waiting to be discovered
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {latestBooks.map((book, index) => (
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
          <Link href="/?sortBy=recent">
            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 shadow-lg hover:shadow-xl transition-all duration-300">
              View All Recent
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
