import { Metadata } from "next";
import { getDB } from "@/lib/db";
import { books, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import BookPageClient from "./BookPageClient";

// Generate metadata for each book page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return {
        title: "Book Not Found - BookNest",
        description: "The requested book could not be found."
      };
    }

    const db = await getDB();
    if (!db) {
      return {
        title: "BookNest - Discover Great Books",
        description: "Discover and share great books with the BookNest community."
      };
    }

    // Get book with author information
    const bookResult = await db
      .select()
      .from(books)
      .leftJoin(users, eq(books.userId, users.id))
      .where(eq(books.id, bookId))
      .limit(1);

    if (bookResult.length === 0) {
      return {
        title: "Book Not Found - BookNest",
        description: "The requested book could not be found."
      };
    }

    const result = bookResult[0];
    const book = result.books;
    const author = result.user;
    
    const title = `${book.name} - BookNest`;
    const description = book.summary 
      ? `${book.summary.substring(0, 150)}${book.summary.length > 150 ? '...' : ''}`
      : `Discover "${book.name}" by ${author?.name || 'Unknown Author'} in the ${book.genre} genre on BookNest.`;

    return {
      title,
      description,
      keywords: [
        book.name,
        book.genre,
        author?.name || "Unknown Author",
        "book",
        "review",
        "BookNest",
        "reading",
        "literature"
      ].join(", "),
      authors: author?.name ? [{ name: author.name }] : undefined,
      openGraph: {
        title,
        description,
        type: "article",
        images: book.posterUrl ? [
          {
            url: book.posterUrl,
            width: 400,
            height: 600,
            alt: `Cover of ${book.name}`,
          }
        ] : undefined,
        siteName: "BookNest",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: book.posterUrl ? [book.posterUrl] : undefined,
      },
      alternates: {
        canonical: `/books/${bookId}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "BookNest - Discover Great Books",
      description: "Discover and share great books with the BookNest community."
    };
  }
}

export default function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <BookPageClient params={params} />;
}