import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { books, votes, comments, users } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

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

    const db = await getDB();
    
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Get book details with author information
    const bookResult = await db
      .select()
      .from(books)
      .leftJoin(users, eq(books.userId, users.id))
      .where(eq(books.id, bookId));

    if (bookResult.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = bookResult[0];

    // Add author information to the book object
    const bookWithAuthor = {
      ...book.books,
      authorName: book.user?.name || null,
      authorUsername: book.user?.username || null,
      authorEmail: book.user?.email || null,
      authorImage: book.user?.image || null,
    };

    // Get vote counts
    const upvoteResults = await db.select()
      .from(votes)
      .where(and(eq(votes.bookId, bookId), eq(votes.voteType, "upvote")));

    const downvoteResults = await db.select()
      .from(votes)
      .where(and(eq(votes.bookId, bookId), eq(votes.voteType, "downvote")));

    // Get comments
    const bookComments = await db.select()
      .from(comments)
      .where(eq(comments.bookId, bookId))
      .orderBy(desc(comments.createdAt));

    const bookWithDetails = {
      ...bookWithAuthor,
      upvotes: upvoteResults.length,
      downvotes: downvoteResults.length,
      comments: bookComments,
    };

    return NextResponse.json(bookWithDetails);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

// PUT update book (for book authors)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, url, posterUrl, summary, genre } = body as {
      name: string;
      url: string;
      posterUrl?: string;
      summary?: string;
      genre: string;
    };

    if (!name || !url || !genre) {
      return NextResponse.json(
        { error: "Name, URL, and genre are required" },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Check if book exists
    const existingBook = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (existingBook.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Update the book
    const updatedBook = await db
      .update(books)
      .set({
        name,
        url,
        posterUrl: posterUrl || null,
        summary: summary || null,
        genre,
        updatedAt: new Date(),
      })
      .where(eq(books.id, bookId))
      .returning();

    return NextResponse.json(updatedBook[0]);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
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

    const db = await getDB();
    
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

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
