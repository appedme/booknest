"use client";

import { ReactNode } from "react";
import { useBooks } from "@/hooks/useBooks";
import { CommunityHighlightsSidebar } from "@/components/features/CommunityHighlightsSidebar";

interface PageWrapperProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function PageWrapper({ children, showSidebar = false }: PageWrapperProps) {
  const { books } = useBooks();

  return (
    <div className="flex">
      <div className={`flex-1 ${showSidebar ? 'pr-80' : ''}`}>
        {children}
      </div>
      {showSidebar && books && (
        <CommunityHighlightsSidebar books={books} />
      )}
    </div>
  );
}
