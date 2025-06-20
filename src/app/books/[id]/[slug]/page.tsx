"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookSlugPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  useEffect(() => {
    // Redirect to the main book page
    router.replace(`/books/${bookId}`);
  }, [bookId, router]);

  return null;
}
