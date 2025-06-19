import { NextResponse } from "next/server";
import { GENRES } from "@/lib/schema";

export async function GET() {
  try {
    return NextResponse.json({ genres: GENRES });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
