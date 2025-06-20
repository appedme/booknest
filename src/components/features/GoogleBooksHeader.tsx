"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Search, Menu, User, BookOpen, Grid3X3, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function GoogleBooksHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="google-header sticky top-0 z-50">
      <div className="container-google">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-6 w-6" style={{ color: 'var(--google-blue)' }} />
              <span className="text-xl font-normal" style={{ color: 'var(--google-text-primary)' }}>
                Books
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/trending">
                <Button variant="ghost" className="text-sm font-normal hover:bg-gray-100">
                  Trending
                </Button>
              </Link>
              <Link href="/genres">
                <Button variant="ghost" className="text-sm font-normal hover:bg-gray-100">
                  Browse
                </Button>
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-sm font-normal hover:bg-gray-100">
                      My Books
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="ghost" className="text-sm font-normal hover:bg-gray-100">
                      Add Book
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="google-search-bar flex items-center">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search books, authors, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-sm"
                  style={{ color: 'var(--google-text-primary)' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/trending">Trending</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/genres">Browse</Link>
                  </DropdownMenuItem>
                  {isAuthenticated && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">My Books</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/create">Add Book</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Apps menu (Google style) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/trending">📈 Trending</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/genres">📚 Browse Genres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/authors">✍️ Authors</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Authentication */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium" style={{ color: 'var(--google-text-primary)' }}>
                      {user?.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--google-text-secondary)' }}>
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">My Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button className="google-button text-sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
