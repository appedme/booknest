import { Metadata } from "next";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import UserProfileClient from "./UserProfileClient";

// Helper function to get user by username
async function getUserByUsername(username: string) {
  const db = await getDB();
  if (!db) return null;

  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return userResult.length > 0 ? userResult[0] : null;
}

// Generate metadata for each user profile page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  try {
    const { username } = await params;
    const user = await getUserByUsername(username);

    if (!user) {
      return {
        title: "User Not Found - BookNest",
        description: "The requested user profile could not be found."
      };
    }

    const title = `${user.name || user.username} - BookNest Profile`;
    const description = `View ${user.name || user.username}'s profile, books, and reading activity on BookNest.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
        images: user.image ? [
          {
            url: user.image,
            width: 400,
            height: 400,
            alt: `${user.name || user.username}'s profile picture`,
          }
        ] : undefined,
        siteName: "BookNest",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: user.image ? [user.image] : undefined,
      },
      alternates: {
        canonical: `/u/${username}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "BookNest - User Profile",
      description: "Discover user profiles and their book collections on BookNest."
    };
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  // Convert the user ID to be passed to the client component
  const userIdParams = Promise.resolve({ userId: user.id });

  return <UserProfileClient params={userIdParams} />;
}
