import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  User, 
  BookOpen, 
  TrendingUp, 
  MessageCircle, 
  Award,
  Users,
  ChartBar,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function AuthorsPage() {
  // Mock author data - in a real app, this would come from an API
  const authors = [
    {
      id: 1,
      name: "Community Member",
      avatar: null,
      booksCount: 2,
      totalVotes: 6,
      totalComments: 5,
      joinedDate: "2024-12-01",
      bio: "Passionate reader and book enthusiast. Love sharing great discoveries with the community.",
      topGenres: ["Fiction", "Science Fiction"],
      rank: 1
    },
    {
      id: 2,
      name: "Book Lover",
      avatar: null,
      booksCount: 1,
      totalVotes: 3,
      totalComments: 2,
      joinedDate: "2024-12-15",
      bio: "Always looking for the next great read. Enjoy discussing plot twists and character development.",
      topGenres: ["Mystery", "Thriller"],
      rank: 2
    },
    {
      id: 3,
      name: "Reading Enthusiast",
      avatar: null,
      booksCount: 1,
      totalVotes: 2,
      totalComments: 1,
      joinedDate: "2024-12-20",
      bio: "New to the community but excited to share my favorite books and discover new ones.",
      topGenres: ["Romance", "Fantasy"],
      rank: 3
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Award className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-orange-500" />;
      default: return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const totalAuthors = authors.length;
  const totalBooks = authors.reduce((sum, author) => sum + author.booksCount, 0);
  const totalVotes = authors.reduce((sum, author) => sum + author.totalVotes, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Community Authors</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Meet the passionate readers who make our community thrive
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold">{totalAuthors}</div>
              <div className="text-sm text-muted-foreground">Active Contributors</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold">{totalBooks}</div>
              <div className="text-sm text-muted-foreground">Books Shared</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-3">
                <ChartBar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total Engagement</div>
            </CardContent>
          </Card>
        </div>

        {/* Authors List */}
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {authors.map((author, index) => (
                <div key={author.id}>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                          {getInitials(author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 bg-background border-2 rounded-full p-1">
                        {getRankIcon(author.rank)}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{author.name}</h3>
                          <p className="text-muted-foreground">{author.bio}</p>
                        </div>
                        <Badge variant={author.rank <= 3 ? "default" : "secondary"}>
                          Rank #{author.rank}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {author.topGenres.map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="text-lg font-bold">{author.booksCount}</div>
                          <div className="text-xs text-muted-foreground">Books Shared</div>
                        </div>
                        
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="text-lg font-bold">{author.totalVotes}</div>
                          <div className="text-xs text-muted-foreground">Total Votes</div>
                        </div>
                        
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <MessageCircle className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="text-lg font-bold">{author.totalComments}</div>
                          <div className="text-xs text-muted-foreground">Comments</div>
                        </div>
                        
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <User className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(author.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                          <div className="text-xs text-muted-foreground">Joined</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < authors.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
