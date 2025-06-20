import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { comments, commentLikes } from "@/lib/schema";
import { eq, desc, isNull, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { generateIPHash } from "@/utils/crypto";
import type { User } from "@/types";

// GET comments for a book
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const session = await auth();
    const user = session?.user as User;
    const db = getDB();
    
    // Get all comments for the book (both parent comments and replies)
    const allComments = await db.select()
      .from(comments)
      .where(eq(comments.bookId, parseInt(bookId)))
      .orderBy(desc(comments.createdAt));

    // Get like counts and user's like status for each comment
    const commentsWithLikes = await Promise.all(
      allComments.map(async (comment) => {
        // Get total like count
        const likesCount = await db.select()
          .from(commentLikes)
          .where(eq(commentLikes.commentId, comment.id));

        // Check if current user liked this comment
        let isLiked = false;
        if (user?.id) {
          const userLike = await db.select()
            .from(commentLikes)
            .where(and(eq(commentLikes.commentId, comment.id), eq(commentLikes.userId, user.id)));
          isLiked = userLike.length > 0;
        } else {
          // For anonymous users, check by IP hash
          const forwarded = request.headers.get("x-forwarded-for");
          const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
          const ipHash = await generateIPHash(ip, comment.id);
          const anonLike = await db.select()
            .from(commentLikes)
            .where(and(eq(commentLikes.commentId, comment.id), eq(commentLikes.ipHash, ipHash)));
          isLiked = anonLike.length > 0;
        }

        return {
          ...comment,
          likeCount: likesCount.length,
          isLiked,
        };
      })
    );

    // Organize comments into parent comments and replies
    const parentComments = commentsWithLikes
      .filter(comment => !comment.parentCommentId)
      .map(parentComment => ({
        ...parentComment,
        replies: commentsWithLikes
          .filter(comment => comment.parentCommentId === parentComment.id)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }));

    return NextResponse.json({ comments: parentComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST new comment or reply
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json() as {
      bookId: number;
      content: string;
      username?: string;
      parentCommentId?: number;
    };
    const { bookId, content, username, parentCommentId } = body;

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

    const user = session?.user as User;
    const db = getDB();
    const newComment = await db.insert(comments).values({
      bookId,
      userId: user?.id || null,
      authorName: user?.name || username || "Anonymous",
      content,
      parentCommentId: parentCommentId || null,
    }).returning();

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
