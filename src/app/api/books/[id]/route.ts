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
