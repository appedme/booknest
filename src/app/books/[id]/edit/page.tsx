import { Metadata } from "next";
import { getDB } from "@/lib/db";
import { books, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import BookEditClient from "./BookEditClient";

export const metadata: Metadata = {
  title: "Edit Book - BookNest",
  description: "Edit your book information on BookNest.",
};

// Get book data for editing
async function getBookData(bookId: number) {
  const db = await getDB();
  if (!db) return null;

  const bookResult = await db
    .select()
    .from(books)
    .leftJoin(users, eq(books.userId, users.id))
    .where(eq(books.id, bookId))
    .limit(1);

  if (bookResult.length === 0) return null;

  const result = bookResult[0];
  return {
    ...result.books,
    authorName: result.user?.name || null,
    authorEmail: result.user?.email || null,
  };
}

export default async function BookEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Invalid Book ID</h1>
            <p>The book ID provided is not valid.</p>
          </div>
        </div>
      </div>
    );
  }

  const book = await getBookData(bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
            <p>The book you're trying to edit doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return <BookEditClient book={book} />;
}
