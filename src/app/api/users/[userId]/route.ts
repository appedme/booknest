import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { books, users, votes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

// GET user profile with their books
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const db = await getDB();
    
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Get user information
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult[0];

    // Get user's books
    const userBooks = await db
      .select()
      .from(books)
      .where(eq(books.userId, userId));

    // Get vote counts for each book
    const booksWithVotes = await Promise.all(
      userBooks.map(async (book) => {
        const upvoteResults = await db
          .select()
          .from(votes)
          .where(and(eq(votes.bookId, book.id), eq(votes.voteType, "upvote")));

        const downvoteResults = await db
          .select()
          .from(votes)
          .where(and(eq(votes.bookId, book.id), eq(votes.voteType, "downvote")));

        return {
          ...book,
          upvotes: upvoteResults.length,
          downvotes: downvoteResults.length,
        };
      })
    );

    const userData = {
      ...user,
      books: booksWithVotes,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
