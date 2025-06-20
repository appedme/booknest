"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  MessageCircle, 
  TrendingUp,
  Settings,
  Save,
  Upload,
  Award,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "Community Member",
    email: user?.email || "member@booknest.com",
    bio: "Passionate reader and book enthusiast. Love sharing great discoveries with the community.",
    location: "Global Community",
    website: "",
    favoriteGenres: ["Fiction", "Science Fiction", "Mystery"]
  });

  // Mock user stats - in a real app, this would come from an API
  const userStats = {
    booksShared: 2,
    totalVotes: 6,
    commentsGiven: 5,
    joinedDate: "2024-12-01",
    rank: 1,
    favoriteBooks: [
      { id: 1, title: "The Parrot of a Thousand Stars", genre: "Fiction" },
      { id: 2, title: "njnn", genre: "Fiction" }
    ]
  };

  const handleSave = () => {
    // Here you would save to your backend
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold">{formData.name}</h2>
                  <p className="text-muted-foreground">{formData.email}</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <Badge variant="default">Rank #{userStats.rank}</Badge>
                </div>

                <p className="text-sm text-muted-foreground">{formData.bio}</p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <BookOpen className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                    <div className="text-lg font-bold">{userStats.booksShared}</div>
                    <div className="text-xs text-muted-foreground">Books Shared</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
                    <div className="text-lg font-bold">{userStats.totalVotes}</div>
                    <div className="text-xs text-muted-foreground">Total Votes</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <MessageCircle className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                    <div className="text-lg font-bold">{userStats.commentsGiven}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                    <div className="text-lg font-bold">
                      {new Date(userStats.joinedDate).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-xs text-muted-foreground">Joined</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          disabled={!isEditing}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                    {isEditing && (
                      <Button onClick={handleSave} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Genres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {formData.favoriteGenres.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userStats.favoriteBooks.map((book) => (
                        <div key={book.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="w-10 h-12 bg-muted rounded flex items-center justify-center">
                            📚
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{book.title}</h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {book.genre}
                            </Badge>
                          </div>
                          <Link href={`/books/${book.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive updates about new books and comments</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Privacy Settings</h4>
                          <p className="text-sm text-muted-foreground">Control who can see your profile and activity</p>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Data Export</h4>
                          <p className="text-sm text-muted-foreground">Download your books and activity data</p>
                        </div>
                        <Button variant="outline" size="sm">Export</Button>
                      </div>

                      <Separator />
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                        <div>
                          <h4 className="font-medium text-destructive">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">Permanently remove your account and all data</p>
                        </div>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
