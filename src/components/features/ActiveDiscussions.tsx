"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowRight, Clock, ThumbsUp } from "lucide-react";
import { Book } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface ActiveDiscussionsProps {
  books: Book[];
}

export function ActiveDiscussions({ books }: ActiveDiscussionsProps) {
  // Get books with the most comments (active discussions)
  const activeDiscussions = books
    .filter(book => (book.comments?.length || 0) > 0)
    .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
    .slice(0, 6);

  if (activeDiscussions.length === 0) return null;

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
            <MessageCircle className="h-6 w-6 text-blue-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Active Discussions
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the conversation about these popular books that have everyone talking
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activeDiscussions.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl bg-card hover:bg-card/80 backdrop-blur-sm border card-hover">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {book.genre}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <Link href={`/books/${book.id}`} className="block mb-4">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-2">
                      {book.name}
                    </h3>
                    {book.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {book.summary}
                      </p>
                    )}
                  </Link>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{book.upvotes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">{book.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/books/${book.id}#comments`}>
                      <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all">
                        Join Discussion
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/books">
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 shadow-lg hover:shadow-xl transition-all duration-300">
              View All Discussions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
