"use client";

import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/features/BookCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, BookOpen, Filter, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function GenresPage() {
    const { books, isLoading } = useBooks();
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
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
            <div className="min-h-screen bg-gray-50/50">
                <div className="container py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {Array(12).fill(0).map((_, i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="h-96 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container py-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Browse by Genre</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover books organized by categories. Find your next great read in your favorite genre.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-md mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search books..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Genre Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <h2 className="text-xl font-semibold">Genres ({availableGenres.length})</h2>
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
                        {availableGenres.map((genre) => (
                            <Card
                                key={genre}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedGenre === genre ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                            >
                                <CardContent className="p-4 text-center space-y-2">
                                    <div className="bg-primary/10 p-2 rounded-full w-fit mx-auto">
                                        <Book className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-medium text-sm">{genre}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {genreStats[genre] || 0} books
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Books Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {selectedGenre ? `${selectedGenre} Books` : 'All Books'}
                            <span className="text-gray-500 ml-2">({filteredBooks.length})</span>
                        </h2>
                    </div>

                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onComment={(bookId) => router.push(`/books/${bookId}#comments`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                {selectedGenre
                                    ? `No books found in the ${selectedGenre} genre. Try a different genre or search term.`
                                    : 'No books match your search criteria. Try adjusting your filters.'
                                }
                            </p>
                            {selectedGenre && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => setSelectedGenre(null)}
                                >
                                    View All Books
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
