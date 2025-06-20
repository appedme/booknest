import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { commentLikes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { generateIPHash } from "@/utils/crypto";
import type { User } from "@/types";

// POST like/unlike a comment
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        const body = await request.json() as {
            commentId: number;
        };
        const { commentId } = body;

        // Validate required fields
        if (!commentId) {
            return NextResponse.json(
                { error: "Comment ID is required" },
                { status: 400 }
            );
        }

        const user = session?.user as User;
        const db = getDB();

        let existingLike;

        if (user?.id) {
            // For authenticated users, check by user ID
            existingLike = await db.select()
                .from(commentLikes)
                .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, user.id)));
        } else {
            // For anonymous users, use IP hash
            const forwarded = request.headers.get("x-forwarded-for");
            const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
            const ipHash = await generateIPHash(ip, commentId);

            existingLike = await db.select()
                .from(commentLikes)
                .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.ipHash, ipHash)));
        }

        if (existingLike && existingLike.length > 0) {
            // Unlike - remove the existing like
            await db.delete(commentLikes).where(eq(commentLikes.id, existingLike[0].id));
            return NextResponse.json({ liked: false, message: "Comment unliked" });
        } else {
            // Like - create new like
            let likeData;

            if (user?.id) {
                likeData = {
                    commentId,
                    userId: user.id,
                    ipHash: null,
                };
            } else {
                const forwarded = request.headers.get("x-forwarded-for");
                const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
                likeData = {
                    commentId,
                    userId: null,
                    ipHash: await generateIPHash(ip, commentId),
                };
            }

            await db.insert(commentLikes).values(likeData);
            return NextResponse.json({ liked: true, message: "Comment liked" });
        }
    } catch (error) {
        console.error("Error liking comment:", error);
        return NextResponse.json({ error: "Failed to like comment" }, { status: 500 });
    }
}

// GET like status for a comment
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get("commentId");

        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
        }

        const user = session?.user as User;
        const db = getDB();

        let existingLike;

        if (user?.id) {
            // For authenticated users, check by user ID
            existingLike = await db.select()
                .from(commentLikes)
                .where(and(eq(commentLikes.commentId, parseInt(commentId)), eq(commentLikes.userId, user.id)));
        } else {
            // For anonymous users, use IP hash
            const forwarded = request.headers.get("x-forwarded-for");
            const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
            const ipHash = await generateIPHash(ip, commentId);

            existingLike = await db.select()
                .from(commentLikes)
                .where(and(eq(commentLikes.commentId, parseInt(commentId)), eq(commentLikes.ipHash, ipHash)));
        }

        // Get total like count
        const totalLikes = await db.select()
            .from(commentLikes)
            .where(eq(commentLikes.commentId, parseInt(commentId)));

        return NextResponse.json({
            isLiked: existingLike && existingLike.length > 0,
            likeCount: totalLikes.length
        });
    } catch (error) {
        console.error("Error checking comment like status:", error);
        return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
    }
}
