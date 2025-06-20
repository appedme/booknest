import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/wrappers/AuthProvider";
import { SWRProvider } from "@/wrappers/SWRProvider";
import { Header } from "@/components/features/Header";
import { Footer } from "@/components/features/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNest - Share & Discover Amazing Books",
  description: "A platform to share and discover amazing books with the community. Join BookNest to explore reader recommendations, create reading lists, and connect with book lovers.",
  keywords: ["books", "reading", "book community", "book recommendations", "reading lists", "book sharing", "literature"],
  openGraph: {
    title: "BookNest - Share & Discover Amazing Books",
    description: "Join the BookNest community to share and discover amazing books",
    type: "website",
    siteName: "BookNest",
    images: [{ url: "/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookNest - Share & Discover Amazing Books",
    description: "Join the BookNest community to share and discover amazing books",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider defaultTheme="system" storageKey="booknest-theme">
          <AuthProvider>
            <SWRProvider>
              <div className="min-h-screen flex flex-col items-center justify-center">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </SWRProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
