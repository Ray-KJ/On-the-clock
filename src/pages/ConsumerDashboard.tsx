import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation } from "@/components/Navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Users,
  Heart,
  Crown,
  Star,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
} from "lucide-react";

const CREATOR_ID = "creator1";

const ConsumerDashboard = () => {
  const [selectedCreator, setSelectedCreator] = useState(CREATOR_ID);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: creators = [] } = useQuery({
    queryKey: ["creators"],
    queryFn: () => [
      {
        id: "creator1",
        name: "Alex Chen",
        username: "@alexchen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        description: "Tech enthusiast and coding instructor",
        subscribers: "125K",
        verified: true,
        category: "Technology",
        lastActive: "2 hours ago",
        totalVideos: 342,
        totalLikes: "2.8M",
        engagementRate: "8.2%",
      },
    ],
  });

  const { data: tiers = [] } = useQuery({
    queryKey: ["tiers", selectedCreator],
    queryFn: () => api.getTiers(selectedCreator),
  });

  const { data: oneTimePurchases = [] } = useQuery({
    queryKey: ["one-time-purchases", selectedCreator],
    queryFn: () => api.getOneTimePurchases(selectedCreator),
  });

  const { data: content = [] } = useQuery({
    queryKey: ["content", selectedCreator],
    queryFn: () => api.getCreatorContent(selectedCreator),
  });

  const subscribeMutation = useMutation({
    mutationFn: (tierId: string) =>
      api.postJson(
        `/subscribe_json`,
        {
          user_id: "demo-user",
          tier_id: tierId,
        },
        "membership"
      ),
    onSuccess: () => {
      toast({
        title: "Subscription Successful!",
        description: "You now have access to exclusive content.",
      });
      // Invalidate all related queries to ensure data consistency across all pages
      queryClient.invalidateQueries({ queryKey: ["tiers", selectedCreator] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", selectedCreator],
      });
      queryClient.invalidateQueries({
        queryKey: ["one-time-purchases", selectedCreator],
      });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: (purchaseId: string) =>
      api.purchaseItem(purchaseId, "demo-user"),
    onSuccess: () => {
      toast({
        title: "Purchase Successful!",
        description: "You now have access to this exclusive item.",
      });
      queryClient.invalidateQueries({
        queryKey: ["one-time-purchases", selectedCreator],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", selectedCreator],
      });
    },
  });

  const creator = creators.find((c) => c.id === selectedCreator);

  if (!creator) return <div>Creator not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Creator Header */}
          <div className="mb-8">
            <div className="flex items-start gap-6">
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
                    <span className="font-semibold">{creator.totalLikes}</span>
                    <span className="text-muted-foreground">likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span className="font-semibold">{creator.totalVideos}</span>
                    <span className="text-muted-foreground">videos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">
                      {creator.engagementRate}
                    </span>
                    <span className="text-muted-foreground">engagement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="mb-8" data-section="subscription-tiers">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Subscription Tiers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier, index) => (
                <Card
                  key={tier.id}
                  className="bg-gradient-card border-border shadow-card"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-3 rounded-full ${
                          index === 0
                            ? "bg-primary text-primary-foreground"
                            : index === 1
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-gradient-primary text-white"
                        }`}
                      >
                        {index === 0 ? (
                          <Users className="w-5 h-5" />
                        ) : index === 1 ? (
                          <Star className="w-5 h-5" />
                        ) : (
                          <Crown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-foreground">
                          {tier.name}
                        </CardTitle>
                        <CardDescription>${tier.price}/month</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Benefits:
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {(tier.benefits || []).map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span className="text-muted-foreground">
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {tier.subscriberCount || 0} subscribers
                        </span>
                        <Button
                          size="sm"
                          className="bg-gradient-primary text-white"
                          onClick={() => subscribeMutation.mutate(tier.id)}
                        >
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Free Videos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Free Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "free1",
                  title: "Introduction to React Basics",
                  duration: "15:23",
                  views: "45.2K",
                  posted: "1 week ago",
                  thumbnail:
                    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
                },
                {
                  id: "free2",
                  title: "CSS Grid Layout Tutorial",
                  duration: "22:18",
                  views: "38.7K",
                  posted: "2 weeks ago",
                  thumbnail:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
                },
                {
                  id: "free3",
                  title: "JavaScript Fundamentals",
                  duration: "18:45",
                  views: "52.1K",
                  posted: "3 weeks ago",
                  thumbnail:
                    "https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  id: "free4",
                  title: "Web Development Tips",
                  duration: "12:33",
                  views: "29.8K",
                  posted: "1 month ago",
                  thumbnail:
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
              ].map((video) => (
                <Card
                  key={video.id}
                  className="bg-gradient-card border-border shadow-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {video.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views}</span>
                      </div>
                      <span>{video.posted}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Exclusive Videos (for subscribed users) */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Exclusive Content
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "exclusive1",
                  title: "Advanced React Patterns",
                  duration: "28:15",
                  tier: "Super Fan",
                  thumbnail:
                    "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  isCrowdfunding: true,
                },
                {
                  id: "exclusive2",
                  title: "Code Review Secrets",
                  duration: "35:42",
                  views: "8.9K",
                  posted: "1 week ago",
                  tier: "Super Fan",
                  thumbnail:
                    "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  id: "exclusive3",
                  title: "Q&A Session: Your Questions",
                  duration: "42:18",
                  views: "15.7K",
                  posted: "2 weeks ago",
                  tier: "Super Fan",
                  thumbnail:
                    "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  id: "exclusive4",
                  title: "State Management",
                  duration: "31:25",
                  views: "9.4K",
                  posted: "3 weeks ago",
                  tier: "Super Fan",
                  thumbnail:
                    "https://plus.unsplash.com/premium_photo-1678566111481-8e275550b700?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
              ].map((video, index) => (
                <Card
                  key={video.id}
                  className={`bg-gradient-card border-border shadow-card ${
                    index === 0
                      ? "relative overflow-hidden"
                      : "hover:shadow-lg transition-shadow cursor-pointer"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className={`w-full h-full object-cover ${
                          index === 0 ? "filter grayscale" : ""
                        }`}
                      />
                      {index === 0 ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-white text-sm font-medium">
                              Upcoming
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2 bg-gradient-primary text-white text-xs px-2 py-1 rounded">
                        {video.tier}
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {video.title}
                    </CardTitle>
                    {index === 0 && video.isCrowdfunding && (
                      <div className="mt-2"></div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {index === 0 ? (
                      <div className="text-center">
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Coming Soon
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{video.views}</span>
                        </div>
                        <span>{video.posted}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Locked Videos (for non-subscribed users) */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Premium Content
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "locked1",
                  title: "Advanced JavaScript",
                  duration: "45:30",
                  tier: "VIP Member",
                  thumbnail:
                    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  id: "locked2",
                  title: "1-on-1 Code Review Session",
                  duration: "60:00",
                  tier: "VIP Member",
                  thumbnail:
                    "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  id: "locked3",
                  title: "Exclusive Project Walkthrough",
                  duration: "38:15",
                  tier: "VIP Member",
                  thumbnail:
                    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  id: "locked4",
                  title: "Live Workshop: Full-Stack Dev",
                  duration: "90:00",
                  tier: "VIP Member",
                  thumbnail:
                    "https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
              ].map((video) => (
                <Card
                  key={video.id}
                  className="bg-gradient-card border-border shadow-card relative overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover filter grayscale"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-white text-sm font-medium">
                            {video.tier} Only
                          </p>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2 bg-gradient-primary text-white text-xs px-2 py-1 rounded">
                        {video.tier}
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {video.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Button
                        size="sm"
                        className="bg-gradient-primary text-white w-full"
                        onClick={() => {
                          // Scroll to subscription tiers section
                          document
                            .querySelector(
                              '[data-section="subscription-tiers"]'
                            )
                            ?.scrollIntoView({
                              behavior: "smooth",
                            });
                        }}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Subscribe to Unlock
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* One-Time Purchases */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              One-Time Purchases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {oneTimePurchases.map((purchase) => (
                <Card
                  key={purchase.id}
                  className="bg-gradient-card border-border shadow-card"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">
                          {purchase.name}
                        </CardTitle>
                        <CardDescription>
                          ${purchase.price} (one-time)
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-muted-foreground mb-3">
                          {purchase.description}
                        </p>
                        <Badge variant="outline" className="capitalize mb-3">
                          {purchase.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {purchase.purchaseCount || 0} purchases
                        </span>
                        <Button
                          size="sm"
                          className="bg-gradient-primary text-white"
                          onClick={() => purchaseMutation.mutate(purchase.id)}
                        >
                          Purchase
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsumerDashboard;
