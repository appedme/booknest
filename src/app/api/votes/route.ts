import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { votes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "../../../../auth";
import { generateIPHash } from "@/utils/crypto";
import type { User } from "@/types";

// POST vote (upvote/downvote)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json() as {
      bookId: number;
      voteType: string;
    };
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

    const user = session?.user as User;
    const db = getDB();

    let existingVote;

    if (user?.id) {
      // For authenticated users, check by user ID
      existingVote = await db.select()
        .from(votes)
        .where(and(eq(votes.bookId, bookId), eq(votes.userId, user.id)));
    } else {
      // For anonymous users, use IP hash
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
      const ipHash = await generateIPHash(ip, bookId);

      existingVote = await db.select()
        .from(votes)
        .where(and(eq(votes.bookId, bookId), eq(votes.ipHash, ipHash)));
    }

    if (existingVote && existingVote.length > 0) {
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
    let voteData;
    
    if (user?.id) {
      voteData = {
        bookId,
        voteType,
        userId: user.id,
        ipHash: null,
      };
    } else {
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
      voteData = {
        bookId,
        voteType,
        userId: null,
        ipHash: await generateIPHash(ip, bookId),
      };
    }

    const newVote = await db.insert(votes).values(voteData).returning();

    return NextResponse.json(newVote[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return NextResponse.json({ error: "Failed to create vote" }, { status: 500 });
  }
}

// GET vote status for a book (to check if user already voted)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const user = session?.user as User;
    const db = getDB();

    let existingVote;

    if (user?.id) {
      // For authenticated users, check by user ID
      existingVote = await db.select()
        .from(votes)
        .where(and(eq(votes.bookId, parseInt(bookId)), eq(votes.userId, user.id)));
    } else {
      // For anonymous users, use IP hash
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
      const ipHash = await generateIPHash(ip, bookId);

      existingVote = await db.select()
        .from(votes)
        .where(and(eq(votes.bookId, parseInt(bookId)), eq(votes.ipHash, ipHash)));
    }

    return NextResponse.json({
      hasVoted: existingVote && existingVote.length > 0,
      voteType: existingVote && existingVote.length > 0 ? existingVote[0].voteType : null
    });
  } catch (error) {
    console.error("Error checking vote status:", error);
    return NextResponse.json({ error: "Failed to check vote status" }, { status: 500 });
  }
}
