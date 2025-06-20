"use client";

import { useState } from 'react';
import { GoogleBookCard } from './GoogleBookCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Grid3X3,
  List,
  ArrowRight,
  Filter,
  SortAsc
} from 'lucide-react';
import { Book } from '@/types';
import { motion } from 'framer-motion';

interface GoogleBooksGridProps {
  books: Book[];
  title?: string;
  subtitle?: string;
  onVote?: (bookId: number, type: 'up' | 'down') => void;
  showFilters?: boolean;
  showViewToggle?: boolean;
  maxItems?: number;
  sortOptions?: Array<{value: string, label: string}>;
  onSortChange?: (sortBy: string) => void;
  currentSort?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
}

type ViewMode = 'grid' | 'list';

export function GoogleBooksGrid({
  books,
  title,
  subtitle,
  onVote,
  showFilters = false,
  showViewToggle = false,
  maxItems,
  sortOptions,
  onSortChange,
  currentSort,
  emptyMessage = "No books found",
  emptyDescription = "Try adjusting your search or browse all books.",
  className = ""
}: GoogleBooksGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const displayBooks = maxItems ? books.slice(0, maxItems) : books;
  const hasMoreBooks = maxItems && books.length > maxItems;

  const handleVote = (bookId: number, type: 'up' | 'down') => {
    if (onVote) {
      onVote(bookId, type);
    }
  };

  return (
    <div className={`google-books-grid ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-normal text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      {(showFilters || showViewToggle || sortOptions) && books.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {books.length} {books.length === 1 ? 'book' : 'books'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Controls */}
            {sortOptions && onSortChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={currentSort || ''}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* View Mode Toggle */}
            {showViewToggle && (
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-google-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-google-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Filter Button */}
            {showFilters && (
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Books Grid */}
      {displayBooks.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-normal text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 mb-6">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <>
          <motion.div 
            layout
            className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6' 
                : 'space-y-4'
              }
            `}
          >
            {displayBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={viewMode === 'list' ? 'border-b border-gray-200 pb-4' : ''}
              >
                <GoogleBookCard 
                  book={book} 
                  onVote={handleVote}
                  compact={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          {hasMoreBooks && (
            <div className="text-center mt-8">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Show more books
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
