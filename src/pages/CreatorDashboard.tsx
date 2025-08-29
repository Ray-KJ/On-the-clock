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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useTiers } from "@/hooks/use-tiers";
import {
  Play,
  Users,
  Heart,
  Crown,
  Star,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const CREATOR_ID = "creator1";

const CreatorDashboard = () => {
  const { tiers } = useTiers(CREATOR_ID);

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard", CREATOR_ID],
    queryFn: () => api.getDashboard(CREATOR_ID),
  });

  const { data: oneTimePurchases = [] } = useQuery({
    queryKey: ["one-time-purchases", CREATOR_ID],
    queryFn: () => api.getOneTimePurchases(CREATOR_ID),
  });

  // Calculate one-time purchase revenue
  const oneTimeRevenue = oneTimePurchases.reduce((total, purchase) => {
    return total + purchase.price * (purchase.purchaseCount || 0);
  }, 0);

  // Use real data from API for consistent revenue display
  const realTotalRevenue = dashboardData?.total_revenue || 0;
  const realSubscriptionRevenue = dashboardData?.revenue || 0;
  const realOneTimeRevenue = dashboardData?.one_time_revenue || 0;

  // Mock data for demonstration with volatile one-time purchase revenue
  const monthlyData = [
    { month: "Jan", subscription: 2400, oneTime: 800, total: 3200 },
    { month: "Feb", subscription: 2800, oneTime: 1200, total: 4000 },
    { month: "Mar", subscription: 3200, oneTime: 900, total: 4100 },
    { month: "Apr", subscription: 3600, oneTime: 1500, total: 5100 },
    { month: "May", subscription: 4000, oneTime: 2200, total: 6200 },
    { month: "Jun", subscription: 4400, oneTime: 1800, total: 6200 },
    { month: "Jul", subscription: 4800, oneTime: 2500, total: 7300 },
    { month: "Aug", subscription: 5200, oneTime: 3200, total: 8400 },
    { month: "Sep", subscription: 5600, oneTime: 2800, total: 8400 },
    { month: "Oct", subscription: 6000, oneTime: 3500, total: 9500 },
    { month: "Nov", subscription: 6400, oneTime: 4200, total: 10600 },
    { month: "Dec", subscription: 6800, oneTime: 4800, total: 11600 },
  ];

  // Add one volatile month (e.g., March with high one-time revenue)
  monthlyData[2].oneTime = 8500; // March has very high one-time revenue
  monthlyData[2].total = 11700;

  // Use real data for current month display
  const currentMonth = {
    subscription: realSubscriptionRevenue,
    oneTime: realOneTimeRevenue,
    total: realTotalRevenue,
  };
  const previousMonth = monthlyData[10]; // November

  const subscriptionGrowth =
    ((currentMonth.subscription - previousMonth.subscription) /
      previousMonth.subscription) *
    100;
  const oneTimeGrowth =
    ((currentMonth.oneTime - previousMonth.oneTime) / previousMonth.oneTime) *
    100;
  const totalGrowth =
    ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your performance and revenue across all platforms
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attributable Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${currentMonth.total.toLocaleString()}
                </div>
                <p
                  className={`text-xs flex items-center ${
                    totalGrowth >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalGrowth >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(totalGrowth).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attributable Income - Subscription
                </CardTitle>
                <Users className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${currentMonth.subscription.toLocaleString()}
                </div>
                <p
                  className={`text-xs flex items-center ${
                    subscriptionGrowth >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {subscriptionGrowth >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(subscriptionGrowth).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attributable Income - One-Time Revenue
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${currentMonth.oneTime.toLocaleString()}
                </div>
                <p
                  className={`text-xs flex items-center ${
                    oneTimeGrowth >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {oneTimeGrowth >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(oneTimeGrowth).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subscribers
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {dashboardData?.total_subscribers?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all tiers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Revenue Breakdown */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Monthly Revenue Breakdown
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Last 6 months performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.slice(-6).map((month, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="font-medium text-foreground">
                          {month.month}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          ${month.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sub: ${month.subscription.toLocaleString()} |
                          One-time: ${month.oneTime.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Tiers */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Top Performing Tiers
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Revenue by subscription tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiers.slice(0, 3).map((tier, index) => (
                    <div
                      key={tier.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? "bg-primary"
                              : index === 1
                              ? "bg-secondary"
                              : "bg-gradient-primary"
                          }`}
                        ></div>
                        <span className="font-medium text-foreground">
                          {tier.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          $
                          {(
                            (tier.price || 0) * (tier.subscriberCount || 0)
                          ).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tier.subscriberCount || 0} subscribers
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* One-Time Purchase Performance */}
          {oneTimePurchases.length > 0 && (
            <Card className="mb-8 bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  One-Time Purchase Performance
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Revenue from individual item sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {oneTimePurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="p-4 bg-muted rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">
                          {purchase.name}
                        </h4>
                        <Badge variant="outline" className="capitalize">
                          {purchase.type}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="text-foreground font-medium">
                            ${purchase.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sales:</span>
                          <span className="text-foreground font-medium">
                            {purchase.purchaseCount || 0}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">
                            Attributable Revenue:
                          </span>
                          <span className="text-primary">
                            $
                            {(
                              (purchase.price || 0) *
                              (purchase.purchaseCount || 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">
                      Total One-Time Revenue:
                    </span>
                    <span className="text-primary font-bold text-xl">
                      ${oneTimeRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Manage Tiers</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create and customize subscription tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/tiers">Go to Tiers</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Upload Content
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Share new videos with your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/upload">Upload Video</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  View Analytics
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Detailed revenue and performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/revenue">Revenue Analytics</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;
