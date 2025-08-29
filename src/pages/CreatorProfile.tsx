import { useState } from "react";
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
import { mockCreators, mockTiers } from "@/lib/mockData";
import {
  Crown,
  Users,
  Play,
  Heart,
  Share,
  MessageCircle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTiers } from "@/hooks/use-tiers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const CreatorProfile = () => {
  const creator = mockCreators[0];
  const { tiers: liveTiers } = useTiers(creator.id);
  const tierList = liveTiers && liveTiers.length ? liveTiers : mockTiers;
  const [selectedTier, setSelectedTier] = useState(
    tierList[1]?.id ?? tierList[0]?.id
  );
  const queryClient = useQueryClient();
  const subscribeMutation = useMutation({
    mutationFn: async (tierId: string) => {
      return api.postJson(
        `/subscribe_json`,
        {
          user_id: "demo-user",
          tier_id: tierId,
        },
        "membership"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiers", creator.id] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/consumer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button className="bg-gradient-primary text-white shadow-glow">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Creator Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-1">
            <div className="flex items-start gap-6 mb-6">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>
                  {creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {creator.name}
                  </h1>
                  {creator.verified && (
                    <Badge className="bg-gradient-primary text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-secondary font-semibold mb-2">
                  {creator.username}
                </p>
                <p className="text-muted-foreground mb-4">
                  {creator.description}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">{creator.subscribers}</span>
                    <span className="text-muted-foreground">followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="font-semibold">2.8M</span>
                    <span className="text-muted-foreground">likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span className="font-semibold">180</span>
                    <span className="text-muted-foreground">videos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Subscription Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tierList.map((tier: any, index: number) => {
              const isSelected = selectedTier === tier.id;
              return (
                <Card
                  key={tier.id}
                  className={`relative overflow-hidden ${
                    isSelected ? "ring-2 ring-primary shadow-glow" : ""
                  } bg-gradient-card border-border shadow-card hover:shadow-lg transition-all`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-white text-center py-2 text-sm font-medium z-10">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={isSelected ? "pt-12" : ""}>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-foreground">
                        {tier.name}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-full ${
                          index === 0
                            ? "bg-primary/20 text-primary"
                            : index === 1
                            ? "bg-secondary/20 text-secondary"
                            : "bg-gradient-primary text-white"
                        }`}
                      >
                        {index === 2 ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-foreground">
                        ${tier.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>
                      {tier.subscriberCount ?? 0} current subscribers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {(tier.benefits ?? []).map(
                        (benefit: string, bIndex: number) => (
                          <div key={bIndex} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-foreground text-sm">
                              {benefit}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <Button
                      className={`w-full ${
                        isSelected
                          ? "bg-gradient-primary text-white shadow-glow"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                      onClick={() => {
                        setSelectedTier(tier.id);
                        subscribeMutation.mutate(tier.id);
                      }}
                    >
                      Subscribe to {tier.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Recent Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Dancing in Times Square! 🔥",
                thumbnail:
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
                tier: "Public",
                views: "2.4M",
                duration: "0:45",
              },
              {
                title: "Behind the Scenes: NYC Shoot",
                thumbnail:
                  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
                tier: "Basic Fan+",
                views: "89K",
                duration: "12:34",
              },
              {
                title: "Exclusive Dance Tutorial",
                thumbnail:
                  "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
                tier: "Super Fan+",
                views: "45K",
                duration: "18:45",
              },
              {
                title: "Q&A: Your Questions Answered",
                thumbnail:
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                tier: "Super Fan+",
                views: "67K",
                duration: "25:17",
              },
              {
                title: "VIP Member Video Call",
                thumbnail:
                  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop",
                tier: "VIP Circle",
                views: "12K",
                duration: "45:22",
              },
              {
                title: "Dance Challenge Creation",
                thumbnail:
                  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop",
                tier: "Public",
                views: "1.8M",
                duration: "1:23",
              },
            ].map((video, index) => (
              <Card
                key={index}
                className="bg-gradient-card border-border shadow-card hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <Badge
                    className={`absolute top-2 left-2 ${
                      video.tier === "Public"
                        ? "bg-muted"
                        : video.tier === "Basic Fan+"
                        ? "bg-primary"
                        : video.tier === "Super Fan+"
                        ? "bg-secondary"
                        : "bg-gradient-primary text-white"
                    }`}
                  >
                    {video.tier}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{video.views} views</span>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 hover:text-primary">
                        <Heart className="w-4 h-4" />
                        <span>2.1K</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-secondary">
                        <MessageCircle className="w-4 h-4" />
                        <span>89</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* About Section */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">
              About {creator.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">
              Professional dancer and choreographer with over 5 years of
              experience in the industry. Passionate about sharing exclusive
              content, teaching new moves, and connecting with fans through
              interactive experiences.
            </p>
            <p className="text-muted-foreground">
              Join my tier subscription to get access to behind-the-scenes
              content, dance tutorials, live Q&A sessions, and exclusive 1-on-1
              opportunities. Let's dance together! 💃
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreatorProfile;
