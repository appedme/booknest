"use client";import { useBooks } from "@/hooks/useBooks";import { GoogleBooksLayout } from "@/components/features/GoogleBooksLayout";import { GoogleBooksGrid } from "@/components/features/GoogleBooksGrid";import { Card, CardContent } from "@/components/ui/card";import { Badge } from "@/components/ui/badge";import { Button } from "@/components/ui/button";import {   BookOpen,   Tag,   Grid3X3,   Users,  TrendingUp} from "lucide-react";import { useMemo, useState } from "react";
export default function GenresPage() {
  const { books, isLoading, mutate } = useBooks();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('popular');

  // Calculate genre statistics
  const genreStats = useMemo(() => {
    if (!books) return {};

    const stats: Record<string, {
      count: number;
      totalVotes: number;
      totalComments: number;
      books: typeof books;
    }> = {};

    books.forEach(book => {
      const genre = book.genre || 'Uncategorized';
      if (!stats[genre]) {
        stats[genre] = {
          count: 0,
          totalVotes: 0,
          totalComments: 0,
          books: []
        };
      }
      
      stats[genre].count++;
      stats[genre].totalVotes += (book.upvotes || 0) - (book.downvotes || 0);
      stats[genre].totalComments += book.comments?.length || 0;
      stats[genre].books.push(book);
    });

    return stats;
  }, [books]);

  const sortedGenres = useMemo(() => {
    return Object.entries(genreStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 12); // Show top 12 genres
  }, [genreStats]);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    
    const filtered = selectedGenre ? books.filter(book => book.genre === selectedGenre) : books;
    
    // Apply sorting
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'recent':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'discussed':
        return filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      case 'title':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [books, selectedGenre, sortBy]);

  const handleVote = async (bookId: number, type: 'up' | 'down') => {
    console.log(`Voting ${type} for book ${bookId}`);
    mutate();
  };

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Recently Added' },
    { value: 'discussed', label: 'Most Discussed' },
    { value: 'title', label: 'Title A-Z' }
  ];

  const formatGenreName = (genre: string) => {
    return genre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <GoogleBooksLayout>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </GoogleBooksLayout>
    );
  }

  return (
    <GoogleBooksLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Tag className="h-8 w-8 text-google-blue" />
          <div>
            <h1 className="text-3xl font-normal text-gray-900">Genres</h1>
            <p className="text-gray-600">Explore books by category and discover new genres</p>
          </div>
        </div>

        {/* Genre Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {Object.keys(genreStats).length}
              </div>
              <div className="text-sm text-gray-600">Active Genres</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Grid3X3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {books?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Books</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {sortedGenres.length > 0 ? formatGenreName(sortedGenres[0][0]) : '—'}
              </div>
              <div className="text-sm text-gray-600">Most Popular</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-medium text-gray-900">
                {Object.values(genreStats).reduce((sum, stat) => sum + stat.totalVotes, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </CardContent>
          </Card>
        </div>

        {/* Genre Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Browse by Genre</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedGenre(null)}
              variant={selectedGenre === null ? "default" : "outline"}
              size="sm"
              className={selectedGenre === null ? "bg-google-blue text-white" : ""}
            >
              All Genres
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                {books?.length || 0}
              </Badge>
            </Button>
            
            {sortedGenres.map(([genre, stats]) => (
              <Button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                className={selectedGenre === genre ? "bg-google-blue text-white" : ""}
              >
                {formatGenreName(genre)}
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                  {stats.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <GoogleBooksGrid
        books={filteredBooks}
        title={selectedGenre ? `${formatGenreName(selectedGenre)} Books` : 'All Books'}
        subtitle={selectedGenre 
          ? `Explore ${genreStats[selectedGenre]?.count || 0} books in the ${formatGenreName(selectedGenre)} genre`
          : 'Discover books across all genres'
        }
        onVote={handleVote}
        showViewToggle={true}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        currentSort={sortBy}
        emptyMessage={selectedGenre ? `No books found in ${formatGenreName(selectedGenre)}` : "No books available"}
        emptyDescription={selectedGenre 
          ? "Try selecting a different genre or browse all books."
          : "Be the first to share a book with the community."
        }
      />
    </GoogleBooksLayout>
  );
}