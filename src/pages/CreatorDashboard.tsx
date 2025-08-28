import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RevenueChart } from "@/components/RevenueChart";
import { Navigation } from "@/components/Navigation";
import { mockCreatorStats, mockRevenueData, mockTiers } from "@/lib/mockData";
import {
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  Play,
  Eye,
  Crown,
  Zap,
} from "lucide-react";
import { useTiers } from "@/hooks/use-tiers";

const CreatorDashboard = () => {
  const stats = mockCreatorStats;
  const creatorId = "creator1";
  const { tiers, totalSubscribers, grossMonthly } = useTiers(creatorId);

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
              Track your tiered creator economy performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {(
                    totalSubscribers || stats.totalSubscribers
                  ).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${(grossMonthly || stats.monthlyRevenue).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Watch Time
                </CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {(stats.totalWatchTime / 60).toFixed(0)}h
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +15.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Engagement Rate
                </CardTitle>
                <Zap className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.engagementRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <RevenueChart
                data={mockRevenueData.slice(0, 3)}
                showSmoothed={false}
              />
            </div>

            {/* Tier Performance */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Tier Performance
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Current subscriber distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(tiers.length ? tiers : mockTiers).map((tier, index) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          index === 0
                            ? "bg-primary/20 text-primary"
                            : index === 1
                            ? "bg-secondary/20 text-secondary"
                            : "bg-gradient-primary"
                        }`}
                      >
                        {index === 2 ? (
                          <Crown className="h-4 w-4 text-white" />
                        ) : (
                          <Users className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {tier.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${tier.price}/month
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {(tier as any).subscriberCount ?? 0}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top Videos */}
          <Card className="mt-8 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Top Performing Videos
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your highest engagement content this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Tier: {video.tier}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{video.views.toLocaleString()}</span>
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

export default CreatorDashboard;
