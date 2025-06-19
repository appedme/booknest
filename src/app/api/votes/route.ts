import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { votes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

// POST vote (upvote/downvote)
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const { bookId, voteType } = body;

    // Validate required fields
    if (!bookId || !voteType) {
      return NextResponse.json(
        { error: "Book ID and vote type are required" },
        { status: 400 }
      );
    }

    // Validate vote type
    if (voteType !== "upvote" && voteType !== "downvote") {
      return NextResponse.json(
        { error: "Vote type must be 'upvote' or 'downvote'" },
        { status: 400 }
      );
    }

    // In development mode, return a mock success response
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: ${voteType} for book ${bookId}`);
      return NextResponse.json({ 
        success: true, 
        message: `${voteType} recorded successfully (dev mode)` 
      });
    }

    // Get client IP for anonymous voting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
    const ipHash = crypto.createHash('sha256').update(ip + bookId).digest('hex');

    const db = getDB();

    // Check if user already voted on this book (by IP hash)
    const existingVote = await db.select()
      .from(votes)
      .where(and(eq(votes.bookId, bookId), eq(votes.ipHash, ipHash)));

    if (existingVote.length > 0) {
      // Update existing vote if different
      if (existingVote[0].voteType !== voteType) {
        await db.update(votes)
          .set({ voteType })
          .where(eq(votes.id, existingVote[0].id));

        return NextResponse.json({ message: "Vote updated successfully" });
      } else {
        return NextResponse.json({ error: "You have already voted this way" }, { status: 400 });
      }
    }

    // Create new vote
    const newVote = await db.insert(votes).values({
      bookId,
      userId: null,
      ipHash,
      voteType,
    }).returning();

    return NextResponse.json(newVote[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return NextResponse.json({ error: "Failed to create vote" }, { status: 500 });
  }
}

// GET vote status for a book (to check if user already voted)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
    const ipHash = crypto.createHash('sha256').update(ip + bookId).digest('hex');

    const db = getDB();

    // Check if user already voted
    const existingVote = await db.select()
      .from(votes)
      .where(and(eq(votes.bookId, parseInt(bookId)), eq(votes.ipHash, ipHash)));

    return NextResponse.json({
      hasVoted: existingVote.length > 0,
      voteType: existingVote.length > 0 ? existingVote[0].voteType : null
    });
  } catch (error) {
    console.error("Error checking vote status:", error);
    return NextResponse.json({ error: "Failed to check vote status" }, { status: 500 });
  }
}
