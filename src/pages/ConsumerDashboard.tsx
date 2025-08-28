import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation } from "@/components/Navigation";
import { mockCreators } from "@/lib/mockData";
import {
  Heart,
  Play,
  Clock,
  Crown,
  Users,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTiers } from "@/hooks/use-tiers";

const ConsumerDashboard = () => {
  const creator = mockCreators[0];
  const { tiers } = useTiers(creator.id);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Subscriptions
            </h1>
            <p className="text-muted-foreground">
              Manage your creator subscriptions and exclusive content
            </p>
          </div>

          {/* Creator Card */}
          <Card className="mb-8 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>
                      {creator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">
                        {creator.name}
                      </h2>
                      {creator.verified && (
                        <Badge className="bg-gradient-primary text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-secondary font-medium">
                      {creator.username}
                    </p>
                    <p className="text-muted-foreground">
                      {creator.subscribers} followers
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to={`/creator/${creator.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{creator.description}</p>

              {/* Current Subscription */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">
                    Current Plan: {tiers[1]?.name ?? "Super Fan"}
                  </h3>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Renewed Feb 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>${tiers[1]?.price ?? 9.99}/month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Content */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Exclusive Content
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Latest videos for Super Fan members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Behind the Scenes: NYC Shoot",
                        duration: "12:34",
                        tier: "Super Fan",
                        views: "8.9K views",
                        posted: "2 days ago",
                      },
                      {
                        title: "Q&A: Your Questions Answered",
                        duration: "25:17",
                        tier: "Super Fan",
                        views: "12.1K views",
                        posted: "1 week ago",
                      },
                      {
                        title: "Exclusive Dance Tutorial",
                        duration: "18:45",
                        tier: "Super Fan",
                        views: "15.3K views",
                        posted: "2 weeks ago",
                      },
                    ].map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <div className="relative w-20 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {video.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {video.tier}
                            </Badge>
                            <span>{video.views}</span>
                            <span>•</span>
                            <span>{video.posted}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Benefits */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Your Benefits</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {tiers[1]?.name ?? "Super Fan"} membership perks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(
                    tiers[1]?.benefits ?? [
                      "Early access to videos",
                      "Exclusive behind-the-scenes",
                      "Fan badge",
                      "Monthly Q&A sessions",
                      "Custom shoutouts",
                      "Discord access",
                    ]
                  ).map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      <span className="text-foreground text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button variant="outline" className="w-full">
                    Upgrade to VIP
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-destructive"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card className="mt-8 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Upcoming Events</CardTitle>
              <CardDescription className="text-muted-foreground">
                Exclusive events for Super Fan members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Monthly Q&A Session",
                    date: "March 15, 2024",
                    time: "7:00 PM EST",
                    type: "Live Stream",
                  },
                  {
                    title: "Dance Workshop",
                    date: "March 22, 2024",
                    time: "3:00 PM EST",
                    type: "Interactive",
                  },
                ].map((event, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">
                      {event.title}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ConsumerDashboard;
