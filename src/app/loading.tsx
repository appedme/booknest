import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Authors Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              {/* Rank Badge */}
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
              
              {/* Name */}
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              
              {/* Bio */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-10 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Top Genres */}
              <div className="mb-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
              
              {/* Action Button */}
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="mt-12 text-center">
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </div>
  );
}
