import { Metadata } from "next";
import { getDB } from "@/lib/db";
import { books, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import UserProfileClient from "./UserProfileClient";

// Generate metadata for user profile pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  try {
    const { userId } = await params;

    const db = await getDB();
    if (!db) {
      return {
        title: "User Profile - BookNest",
        description: "User profile on BookNest."
      };
    }

    // Get user information
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return {
        title: "User Not Found - BookNest",
        description: "The requested user profile could not be found."
      };
    }

    const user = userResult[0];
    const title = `${user.name || 'Unknown User'} - BookNest`;
    const description = `View ${user.name || 'Unknown User'}'s profile and books on BookNest.`;

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
            width: 200,
            height: 200,
            alt: `${user.name || 'User'}'s profile picture`,
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
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "User Profile - BookNest",
      description: "User profile on BookNest."
    };
  }
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return <UserProfileClient params={params} />;
}
