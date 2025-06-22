import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { reviewHelpful, reviews } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { generateIPHash } from "@/utils/crypto";
import type { User } from "@/types";

// POST /api/reviews/helpful - Mark a review as helpful
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as User;
    const body = await request.json();
    const { reviewId } = body as { reviewId: string };

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const db = await getDB();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Get IP hash for anonymous voting fallback
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
    const ipHash = await generateIPHash(ip, reviewId);
    const userId = user?.id || null;

    // Check if user/IP has already marked this review as helpful
    const existingVote = await db
      .select()
      .from(reviewHelpful)
      .where(
        and(
          eq(reviewHelpful.reviewId, parseInt(reviewId)),
          userId 
            ? eq(reviewHelpful.userId, userId)
            : eq(reviewHelpful.ipHash, ipHash)
        )
      )
      .limit(1);

    if (existingVote.length > 0) {
      return NextResponse.json(
        { error: "You have already marked this review as helpful" },
        { status: 400 }
      );
    }

    // Add helpful vote
    await db.insert(reviewHelpful).values({
      reviewId: parseInt(reviewId),
      userId,
      ipHash: userId ? null : ipHash,
    });

    // Update helpful count on the review
    await db
      .update(reviews)
      .set({
        helpfulCount: sql`${reviews.helpfulCount} + 1`,
      })
      .where(eq(reviews.id, parseInt(reviewId)));

    // Get updated helpful count
    const updatedReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(reviewId)))
      .limit(1);

    return NextResponse.json({
      message: "Review marked as helpful",
      helpfulCount: updatedReview[0]?.helpfulCount || 0,
    });
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    return NextResponse.json(
      { error: "Failed to mark review as helpful" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/helpful - Remove helpful mark from a review
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as User;
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const db = await getDB();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Get IP hash for anonymous voting fallback
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
    const ipHash = await generateIPHash(ip, reviewId);
    const userId = user?.id || null;

    // Remove helpful vote
    const deletedRows = await db
      .delete(reviewHelpful)
      .where(
        and(
          eq(reviewHelpful.reviewId, parseInt(reviewId)),
          userId 
            ? eq(reviewHelpful.userId, userId)
            : eq(reviewHelpful.ipHash, ipHash)
        )
      )
      .returning();

    if (deletedRows.length === 0) {
      return NextResponse.json(
        { error: "Helpful vote not found" },
        { status: 404 }
      );
    }

    // Update helpful count on the review
    await db
      .update(reviews)
      .set({
        helpfulCount: sql`${reviews.helpfulCount} - 1`,
      })
      .where(eq(reviews.id, parseInt(reviewId)));

    // Get updated helpful count
    const updatedReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(reviewId)))
      .limit(1);

    return NextResponse.json({
      message: "Helpful mark removed",
      helpfulCount: updatedReview[0]?.helpfulCount || 0,
    });
  } catch (error) {
    console.error("Error removing helpful mark:", error);
    return NextResponse.json(
      { error: "Failed to remove helpful mark" },
      { status: 500 }
    );
  }
}
