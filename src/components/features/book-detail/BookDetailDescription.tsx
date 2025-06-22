"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANIMATIONS, STYLES } from "@/constants/book-detail";

interface BookDetailDescriptionProps {
  book: any;
}

export function BookDetailDescription({ book }: BookDetailDescriptionProps) {
  const summary = book?.summary || "";
  if (!summary) return null;

  return (
    <motion.div
      initial={ANIMATIONS.CONTENT_INITIAL}
      animate={ANIMATIONS.CONTENT_ANIMATE}
      transition={{ ...ANIMATIONS.CONTENT_TRANSITION, delay: 0.2 }}
    >
      <Card className={STYLES.CARD_BG}>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            About This Book
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed text-lg">{summary}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
