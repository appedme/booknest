import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { books, votes, comments } from "@/lib/schema";
import { desc, eq, sql, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import type { User } from "@/types";

// GET all books (with filtering and sorting options)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const db = getDB();

    // Build conditions array
    const conditions = [];
    if (genre && genre !== "all") {
      conditions.push(eq(books.genre, genre));
    }
    if (search) {
      conditions.push(
        sql`(${books.name} LIKE ${'%' + search + '%'} OR ${books.summary} LIKE ${'%' + search + '%'})`
      );
    }

    // Base query
    let allBooks;
    if (conditions.length > 0) {
      allBooks = await db.select()
        .from(books)
        .where(and(...conditions))
        .orderBy(desc(books.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      allBooks = await db.select()
        .from(books)
        .orderBy(desc(books.createdAt))
        .limit(limit)
        .offset(offset);
    }

    // Get vote counts for each book
    const booksWithVotes = await Promise.all(
      allBooks.map(async (book) => {
        const upvoteCount = await db.select()
          .from(votes)
          .where(and(eq(votes.bookId, book.id), eq(votes.voteType, "upvote")));

        const downvoteCount = await db.select()
          .from(votes)
          .where(and(eq(votes.bookId, book.id), eq(votes.voteType, "downvote")));

        const bookComments = await db.select()
          .from(comments)
          .where(eq(comments.bookId, book.id));

        return {
          ...book,
          upvotes: upvoteCount.length,
          downvotes: downvoteCount.length,
          comments: bookComments,
        };
      })
    );

    return NextResponse.json({
      books: booksWithVotes,
      pagination: {
        limit,
        offset,
        hasMore: allBooks.length === limit
      }
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

// POST new book
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json() as {
      name: string;
      url: string;
      posterUrl?: string;
      summary?: string;
      genre: string;
    };
    const { name, url, posterUrl, summary, genre } = body;

    // Validate required fields
    if (!name || !url || !genre) {
      return NextResponse.json(
        { error: "Name, URL, and genre are required" },
        { status: 400 }
      );
    }

    // Validate genre
    const validGenres = [
      'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Programming',
      'Business', 'Self-Help', 'Biography', 'History', 'Philosophy',
      'Art', 'Design', 'Health', 'Education', 'Reference', 'Other'
    ];

    if (!validGenres.includes(genre)) {
      return NextResponse.json(
        { error: "Invalid genre" },
        { status: 400 }
      );
    }

    const db = getDB();
    const newBook = await db.insert(books).values({
      name,
      url,
      posterUrl: posterUrl || null,
      summary: summary || null,
      genre,
      userId: (session?.user as User)?.id || null, // Associate with authenticated user if available
    }).returning();

    return NextResponse.json(newBook[0], { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
