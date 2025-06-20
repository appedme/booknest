"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleBooksLayout } from "@/components/features/GoogleBooksLayout";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Chrome } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleGoogleSignIn = async () => {
    try {
      await login("google");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  if (isLoading) {
    return (
      <GoogleBooksLayout>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-google-blue"></div>
        </div>
      </GoogleBooksLayout>
    );
  }

  return (
    <GoogleBooksLayout>
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-md border border-gray-200">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-google-blue p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-normal text-gray-900">
              Welcome to BookNest
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Discover and share amazing books with the community
            </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-google-blue hover:bg-google-blue-dark text-white border-0"
            size="lg"
          >
            <Chrome className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-google-blue hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-google-blue hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </GoogleBooksLayout>
  );
}
