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
import {
  getFreeVideos,
  getExclusiveVideos,
  getPremiumVideos,
  getThumbnailImage,
} from "@/lib/mockData";

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
              {getFreeVideos().map((video) => (
                <Card
                  key={video.id}
                  className="bg-gradient-card border-border shadow-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={getThumbnailImage(video.name)}
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(parseInt(video.watchtime) / 60000)}:
                        {((parseInt(video.watchtime) % 60000) / 1000)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {video.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views}</span>
                      </div>
                      <span>{video.uploadDate}</span>
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
              {getExclusiveVideos().map((video, index) => (
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
                        src={getThumbnailImage(video.name)}
                        alt={video.name}
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
                        {Math.floor(parseInt(video.watchtime) / 60000)}:
                        {((parseInt(video.watchtime) % 60000) / 1000)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="absolute top-2 left-2 bg-gradient-primary text-white text-xs px-2 py-1 rounded">
                        Super Fan
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {video.name}
                    </CardTitle>
                    {index === 0 && (
                      <div className="mt-2">
                        <div className="text-right text-xs text-muted-foreground">
                          🎯 3/10 集資專屬
                        </div>
                      </div>
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
                        <span>{video.uploadDate}</span>
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
              {getPremiumVideos().map((video) => (
                <Card
                  key={video.id}
                  className="bg-gradient-card border-border shadow-card relative overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={getThumbnailImage(video.name)}
                        alt={video.name}
                        className="w-full h-full object-cover filter grayscale"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-white text-sm font-medium">
                            VIP Member Only
                          </p>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(parseInt(video.watchtime) / 60000)}:
                        {((parseInt(video.watchtime) % 60000) / 1000)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="absolute top-2 left-2 bg-gradient-primary text-white text-xs px-2 py-1 rounded">
                        VIP Member
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {video.name}
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
