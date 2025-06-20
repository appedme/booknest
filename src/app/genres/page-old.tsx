"use client";

import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/features/BookCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageWrapper } from "@/components/wrappers/PageWrapper";
import { 
  Book, 
  BookOpen, 
  Filter, 
  Search, 
  TrendingUp, 
  Star, 
  BarChart3,
  Grid3X3,
  List,
  Sparkles
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function GenresPage() {
    const { books, isLoading } = useBooks();
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'stats'>('grid');
    const router = useRouter();

    // Get unique genres from books
    const availableGenres = useMemo(() => {
        if (!books) return [];
        const genres = Array.from(new Set(books.map(book => book.genre).filter(Boolean)));
        return genres.sort();
    }, [books]);

    // Get genre statistics
    const genreStats = useMemo(() => {
        if (!books) return {};
        return books.reduce((acc, book) => {
            if (book.genre) {
                acc[book.genre] = (acc[book.genre] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
    }, [books]);

    // Enhanced genre statistics
    const enhancedGenreStats = useMemo(() => {
        if (!books) return [];
        
        const stats = Object.entries(genreStats).map(([genre, count]) => {
            const genreBooks = books.filter(book => book.genre === genre);
            const totalVotes = genreBooks.reduce((sum, book) => sum + (book.upvotes || 0) - (book.downvotes || 0), 0);
            const avgVotes = genreBooks.length > 0 ? totalVotes / genreBooks.length : 0;
            const totalComments = genreBooks.reduce((sum, book) => sum + (book.comments?.length || 0), 0);
            
            return {
                genre,
                count,
                totalVotes,
                avgVotes: Math.round(avgVotes * 10) / 10,
                totalComments,
                popularity: (count * 0.4 + totalVotes * 0.4 + totalComments * 0.2)
            };
        });
        
        return stats.sort((a, b) => b.popularity - a.popularity);
    }, [books, genreStats]);

    // Filter books based on selected genre and search
    const filteredBooks = useMemo(() => {
        if (!books) return [];

        let filtered = books;

        if (selectedGenre) {
            filtered = filtered.filter(book => book.genre === selectedGenre);
        }

        if (searchQuery) {
            filtered = filtered.filter(book =>
                book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.genre?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [books, selectedGenre, searchQuery]);

    if (isLoading) {
        return (
            <PageWrapper showSidebar={true}>
                <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                    <div className="container py-8">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-muted rounded w-48"></div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {Array(12).fill(0).map((_, i) => (
                                    <div key={i} className="h-16 bg-muted rounded"></div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="h-96 bg-muted rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper showSidebar={true}>
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="container py-8 space-y-8">
                    {/* Enhanced Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Browse by Genre
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover books organized by categories. Find your next great read in your favorite genre.
                        </p>
                    </motion.div>

                    {/* Enhanced Controls */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col md:flex-row gap-4 items-center justify-between"
                    >
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background/50 backdrop-blur-sm"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="gap-2"
                            >
                                <Grid3X3 className="h-4 w-4" />
                                Books
                            </Button>
                            <Button
                                variant={viewMode === 'stats' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('stats')}
                                className="gap-2"
                            >
                                <BarChart3 className="h-4 w-4" />
                                Stats
                            </Button>
                        </div>
                    </motion.div>

                    {/* Genre Statistics View */}
                    {viewMode === 'stats' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <BarChart3 className="h-6 w-6 text-primary" />
                                Genre Statistics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enhancedGenreStats.slice(0, 6).map((stat, index) => (
                                    <motion.div
                                        key={stat.genre}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    <span className="capitalize">{stat.genre.replace('_', ' ')}</span>
                                                    {index < 3 && <Sparkles className="h-4 w-4 text-yellow-500" />}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-primary">{stat.count}</div>
                                                        <div className="text-xs text-muted-foreground">Books</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">{stat.totalVotes}</div>
                                                        <div className="text-xs text-muted-foreground">Total Votes</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center">
                                                        <div className="text-lg font-semibold text-orange-600">{stat.avgVotes}</div>
                                                        <div className="text-xs text-muted-foreground">Avg Rating</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-lg font-semibold text-blue-600">{stat.totalComments}</div>
                                                        <div className="text-xs text-muted-foreground">Comments</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => {
                                                        setSelectedGenre(stat.genre);
                                                        setViewMode('grid');
                                                    }}
                                                >
                                                    View Books
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Genre Grid */}
                    {viewMode === 'grid' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-muted-foreground" />
                                    <h2 className="text-xl font-semibold">Genres</h2>
                                    <Badge variant="outline">{availableGenres.length}</Badge>
                                </div>
                                {selectedGenre && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedGenre(null)}
                                    >
                                        Clear Filter
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {availableGenres.map((genre, index) => (
                                    <motion.div
                                        key={genre}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (index % 12) * 0.05 }}
                                    >
                                        <Card
                                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 border-0 shadow-md ${
                                                selectedGenre === genre 
                                                    ? 'ring-2 ring-primary bg-gradient-to-br from-primary/10 to-primary/5' 
                                                    : 'hover:bg-muted/30'
                                            }`}
                                            onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                                        >
                                            <CardContent className="p-4 text-center space-y-2">
                                                <div className={`p-2 rounded-xl w-fit mx-auto ${
                                                    selectedGenre === genre 
                                                        ? 'bg-primary text-white' 
                                                        : 'bg-primary/10 text-primary'
                                                }`}>
                                                    <Book className="h-5 w-5" />
                                                </div>
                                                <h3 className="font-medium text-sm capitalize">{genre.replace('_', ' ')}</h3>
                                                <Badge 
                                                    variant={selectedGenre === genre ? "default" : "secondary"} 
                                                    className="text-xs"
                                                >
                                                    {genreStats[genre] || 0} books
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Books Grid */}
                    {viewMode === 'grid' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    {selectedGenre ? `${selectedGenre.replace('_', ' ')} Books` : 'All Books'}
                                    <Badge variant="outline" className="ml-2">
                                        {filteredBooks.length}
                                    </Badge>
                                </h2>
                            </div>

                            {filteredBooks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredBooks.map((book, index) => (
                                        <motion.div
                                            key={book.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + (index % 12) * 0.05 }}
                                        >
                                            <BookCard
                                                book={book}
                                                onComment={(bookId) => router.push(`/books/${bookId}#comments`)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto mb-6">
                                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {selectedGenre ? `No ${selectedGenre.replace('_', ' ')} books found` : 'No books found'}
                                    </h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        {searchQuery 
                                            ? 'Try adjusting your search terms or browse different genres.'
                                            : 'Be the first to add a book in this genre!'
                                        }
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
