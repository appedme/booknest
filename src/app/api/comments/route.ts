import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { comments } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// GET comments for a book
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const db = getDB();
    const bookComments = await db.select()
      .from(comments)
      .where(eq(comments.bookId, parseInt(bookId)))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json({ comments: bookComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST new comment
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const { bookId, content, username } = body;

    // Validate required fields
    if (!bookId || !content) {
      return NextResponse.json(
        { error: "Book ID and content are required" },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment content must be less than 1000 characters" },
        { status: 400 }
      );
    }

    const db = getDB();
    const newComment = await db.insert(comments).values({
      bookId,
      userId: null, // For anonymous comments
      username: username || "Anonymous",
      content,
    }).returning();

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
