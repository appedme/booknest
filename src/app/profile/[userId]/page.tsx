import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";

export default async function OldProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  
  const db = await getDB();
  if (!db) {
    notFound();
  }

  // Get user by ID to find their username
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userResult.length === 0) {
    notFound();
  }

  const user = userResult[0];
  
  // Redirect to new username-based URL
  if (user.username) {
    redirect(`/u/${user.username}`);
  } else {
    // If no username, redirect to generate one first
    notFound();
  }
}
