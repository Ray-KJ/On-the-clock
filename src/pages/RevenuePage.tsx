import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { RevenueChart } from "@/components/RevenueChart";
import { mockRevenueData, mockCreatorStats } from "@/lib/mockData";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  ArrowUpRight,
  Shield,
  Clock
} from "lucide-react";

const RevenuePage = () => {
  const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSmoothed = mockRevenueData.reduce((sum, item) => sum + item.smoothed, 0);
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Revenue Analytics</h1>
            <p className="text-muted-foreground">ML-optimized payout smoothing and earnings insights</p>
          </div>

          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue (6mo)</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +23.1% from last period
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smoothed Payouts</CardTitle>
                <Shield className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${totalSmoothed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  ML-optimized distribution
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$4,250</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  March 1st, 2024
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="xl:col-span-2">
              <RevenueChart data={mockRevenueData} />
            </div>

            {/* Payout Schedule */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Payout Schedule</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Upcoming ML-smoothed payouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { date: "Mar 1", amount: 4250, status: "pending" },
                  { date: "Apr 1", amount: 4650, status: "scheduled" },
                  { date: "May 1", amount: 4320, status: "scheduled" },
                  { date: "Jun 1", amount: 4890, status: "scheduled" }
                ].map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{payout.date}, 2024</p>
                      <p className="text-sm text-muted-foreground">${payout.amount.toLocaleString()}</p>
                    </div>
                    <Badge variant={payout.status === "pending" ? "default" : "secondary"}>
                      {payout.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card className="mt-8 bg-gradient-card border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Revenue Breakdown</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Detailed earnings by tier and source
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { tier: "Basic Fan ($4.99)", revenue: 6215, subscribers: 1247, color: "bg-primary" },
                  { tier: "Super Fan ($9.99)", revenue: 5225, subscribers: 523, color: "bg-secondary" }, 
                  { tier: "VIP Circle ($24.99)", revenue: 2224, subscribers: 89, color: "bg-gradient-primary" }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <h3 className="font-medium text-foreground">{item.tier}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Revenue:</span>
                        <span className="text-foreground font-medium">${item.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subscribers:</span>
                        <span className="text-foreground font-medium">{item.subscribers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg per Sub:</span>
                        <span className="text-foreground font-medium">${(item.revenue / item.subscribers).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ML Insights */}
          <Card className="mt-8 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">ML Payout Insights</CardTitle>
              <CardDescription className="text-muted-foreground">
                AI-powered revenue optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                  <h4 className="font-medium text-foreground mb-2">Optimal Tier Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    ML analysis suggests increasing Super Fan tier to $12.99 could boost revenue by 15% 
                    with minimal subscriber loss.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-secondary">
                  <h4 className="font-medium text-foreground mb-2">Content Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    Q&A sessions generate 3x higher engagement. Consider increasing frequency for 
                    Super Fan and VIP tiers.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                  <h4 className="font-medium text-foreground mb-2">Payout Smoothing</h4>
                  <p className="text-sm text-muted-foreground">
                    Current smoothing algorithm reduces payout volatility by 34% while maintaining 
                    98% of total earnings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RevenuePage;