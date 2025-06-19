import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { books, votes, comments } from "@/lib/schema";
import { eq, sql, and, desc } from "drizzle-orm";

// GET individual book with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockBook = {
        id: bookId,
        title: `Sample Book ${bookId}`,
        author: "Development Author",
        genre: "Fiction",
        description: "This is a sample book for development purposes.",
        isbn: `978-0-123456-${bookId.toString().padStart(2, '0')}-0`,
        publishedDate: "2024-01-01",
        coverImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: Math.floor(Math.random() * 50),
        downvotes: Math.floor(Math.random() * 10),
        comments: [
          {
            id: 1,
            content: "Great book! Really enjoyed reading it.",
            userId: "dev-user-1",
            userName: "Book Lover",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            content: "Interesting story and well-written characters.",
            userId: "dev-user-2", 
            userName: "Avid Reader",
            createdAt: new Date().toISOString(),
          }
        ]
      };
      return NextResponse.json(mockBook);
    }

    const db = getDB();

    // Get book details
    const bookResult = await db.select()
      .from(books)
      .where(eq(books.id, bookId));

    if (bookResult.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = bookResult[0];

    // Get vote counts
    const upvotes = await db.select({ count: sql<number>`count(*)` })
      .from(votes)
      .where(and(eq(votes.bookId, bookId), eq(votes.voteType, "upvote")));

    const downvotes = await db.select({ count: sql<number>`count(*)` })
      .from(votes)
      .where(and(eq(votes.bookId, bookId), eq(votes.voteType, "downvote")));

    // Get comments
    const bookComments = await db.select()
      .from(comments)
      .where(eq(comments.bookId, bookId))
      .orderBy(desc(comments.createdAt));

    const bookWithDetails = {
      ...book,
      upvotes: upvotes[0]?.count || 0,
      downvotes: downvotes[0]?.count || 0,
      comments: bookComments,
    };

    return NextResponse.json(bookWithDetails);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

// DELETE book (for admin purposes)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    // In development mode, return mock success
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: Would delete book ${bookId}`);
      return NextResponse.json({ message: "Book deleted successfully (dev mode)" });
    }

    const db = getDB();

    // Delete associated votes and comments first
    await db.delete(votes).where(eq(votes.bookId, bookId));
    await db.delete(comments).where(eq(comments.bookId, bookId));

    // Delete the book
    const deletedBook = await db.delete(books)
      .where(eq(books.id, bookId))
      .returning();

    if (deletedBook.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
