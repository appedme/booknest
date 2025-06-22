import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { reviews, bookRatings, books } from "@/lib/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { generateIPHash } from "@/utils/crypto";
import type { User } from "@/types";

// GET /api/reviews - Get reviews for a book
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const db = await getDB();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Get reviews for the book
    const reviewsData = await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookId, parseInt(bookId)))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookId, parseInt(bookId)));

    const totalCount = totalCountResult.length;

    // Get rating aggregation for the book
    const ratingData = await db
      .select()
      .from(bookRatings)
      .where(eq(bookRatings.bookId, parseInt(bookId)))
      .limit(1);

    const rating = ratingData[0] || {
      averageRating: 0,
      totalReviews: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
    };

    return NextResponse.json({
      reviews: reviewsData,
      rating: {
        ...rating,
        averageRating: rating.averageRating ? rating.averageRating / 10 : 0, // Convert back to decimal
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as User;
    const body = await request.json();
    const { bookId, rating, title, content, authorName } = body as {
      bookId: string;
      rating: number;
      title?: string;
      content: string;
      authorName?: string;
    };

    // Validate required fields
    if (!bookId || !rating || !content) {
      return NextResponse.json(
        { error: "Book ID, rating, and content are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const db = await getDB();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Check if book exists
    const book = await db.select().from(books).where(eq(books.id, parseInt(bookId))).limit(1);
    if (book.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Get user info from session or use anonymous
    const userId = user?.id || null;
    const reviewAuthorName = user?.name || authorName || "Anonymous";

    // Check if user has already reviewed this book
    if (userId) {
      const existingReview = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.bookId, parseInt(bookId)), eq(reviews.userId, userId)))
        .limit(1);

      if (existingReview.length > 0) {
        return NextResponse.json(
          { error: "You have already reviewed this book" },
          { status: 400 }
        );
      }
    }

    // Create the review
    const newReview = await db
      .insert(reviews)
      .values({
        bookId: parseInt(bookId),
        userId,
        authorName: reviewAuthorName,
        rating,
        title: title || null,
        content,
        isVerifiedPurchase: false, // You can implement verification logic later
      })
      .returning();

    // Update book ratings aggregation
    await updateBookRatings(parseInt(bookId), db);

    return NextResponse.json({
      message: "Review created successfully",
      review: newReview[0],
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// Helper function to update book ratings aggregation
async function updateBookRatings(bookId: number, db: any) {
  try {
    // Calculate aggregated ratings
    const ratingsData = await db
      .select({
        averageRating: sql<number>`ROUND(AVG(rating * 10))`,
        totalReviews: sql<number>`COUNT(*)`,
        fiveStars: sql<number>`COUNT(CASE WHEN rating = 5 THEN 1 END)`,
        fourStars: sql<number>`COUNT(CASE WHEN rating = 4 THEN 1 END)`,
        threeStars: sql<number>`COUNT(CASE WHEN rating = 3 THEN 1 END)`,
        twoStars: sql<number>`COUNT(CASE WHEN rating = 2 THEN 1 END)`,
        oneStar: sql<number>`COUNT(CASE WHEN rating = 1 THEN 1 END)`,
      })
      .from(reviews)
      .where(eq(reviews.bookId, bookId));

    const data = ratingsData[0];

    // Upsert the book ratings
    const existingRating = await db
      .select()
      .from(bookRatings)
      .where(eq(bookRatings.bookId, bookId))
      .limit(1);

    if (existingRating.length > 0) {
      await db
        .update(bookRatings)
        .set({
          averageRating: data.averageRating || 0,
          totalReviews: data.totalReviews || 0,
          fiveStars: data.fiveStars || 0,
          fourStars: data.fourStars || 0,
          threeStars: data.threeStars || 0,
          twoStars: data.twoStars || 0,
          oneStar: data.oneStar || 0,
          updatedAt: new Date(),
        })
        .where(eq(bookRatings.bookId, bookId));
    } else {
      await db.insert(bookRatings).values({
        bookId,
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        fiveStars: data.fiveStars || 0,
        fourStars: data.fourStars || 0,
        threeStars: data.threeStars || 0,
        twoStars: data.twoStars || 0,
        oneStar: data.oneStar || 0,
      });
    }
  } catch (error) {
    console.error("Error updating book ratings:", error);
  }
}
