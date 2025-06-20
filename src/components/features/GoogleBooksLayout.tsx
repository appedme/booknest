"use client";

import { ReactNode } from 'react';
import { GoogleBooksHeader } from './GoogleBooksHeader';

interface GoogleBooksLayoutProps {
  children: ReactNode;
  showHero?: boolean;
  heroTitle?: string;
  heroDescription?: string;
  heroContent?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  className?: string;
}

export function GoogleBooksLayout({
  children,
  showHero = false,
  heroTitle,
  heroDescription,
  heroContent,
  maxWidth = '7xl',
  className = ""
}: GoogleBooksLayoutProps) {
  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  }[maxWidth];

  return (
    <div className={className}>
      {/* Hero Section */}
      {showHero && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            {heroTitle && (
              <h1 className="text-4xl font-normal text-gray-900 mb-2">
                {heroTitle}
              </h1>
            )}
            {heroDescription && (
              <p className="text-lg text-gray-600 mb-8">
                {heroDescription}
              </p>
            )}
            {heroContent && (
              <div className="max-w-2xl mx-auto">
                {heroContent}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${maxWidthClass} mx-auto px-4 py-8`}>
        {children}
      </main>
    </div>
  );
}
