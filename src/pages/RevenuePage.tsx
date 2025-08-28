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
import { Navigation } from "@/components/Navigation";
import { RevenueChart } from "@/components/RevenueChart";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  ArrowUpRight,
  Shield,
  Clock,
} from "lucide-react";

const RevenuePage = () => {
  // --- Mock tier breakdown (three entries) ---
  const tiers = [
    {
      tier: "Basic Fan ($4.99)",
      price: 4.99,
      subscribers: 1200,
      color: "bg-primary",
    },
    {
      tier: "Super Fan ($9.99)",
      price: 9.99,
      subscribers: 500,
      color: "bg-secondary",
    },
    {
      tier: "VIP Circle ($24.99)",
      price: 24.99,
      subscribers: 90,
      color: "bg-gradient-primary",
    },
  ];
  const tierMonthly = tiers.map((t) => ({
    ...t,
    revenue: Math.round(t.price * t.subscribers),
  }));

  // --- Six-month view with three-month model revenue (post-split) ---
  // Base gross revenue for Jan–Mar (mocked) and quality-based split to creator
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const baseSum = tierMonthly.reduce((s, t) => s + t.revenue, 0);
  const grossJan = baseSum * 0.9;
  const grossFeb = baseSum * 1.05;
  const grossMar = baseSum * 0.8;
  const grossByMonth = [grossJan, grossFeb, grossMar, 0, 0, 0];
  const qualitySplits = [0.6, 0.5, 0.6, 0, 0, 0]; // only first 3 months have revenue
  const modelRevenue = grossByMonth.map((g, i) =>
    Math.round(g * (qualitySplits[i] || 0))
  );

  // --- Smoothing logic (starts in Feb):
  // Jan: 0 (no deferred payout in Jan)
  // Feb: receives Jan * 1.06 / 3
  // Mar: receives Jan * 1.06 / 3 + Feb * 1.06 / 3
  // Apr: receives Jan * 1.06 / 3 + Feb * 1.06 / 3 + Mar * 1.06 / 3
  // May: receives Feb * 1.06 / 3 + Mar * 1.06 / 3
  // Jun: receives Mar * 1.06 / 3
  const interest = 0.06;
  const window = 3;
  const smoothed = (() => {
    const arr = new Array(months.length).fill(0);
    // For each contributing month (Jan, Feb, Mar), distribute to the next 3 months
    for (let m = 0; m <= 2; m++) {
      const base = modelRevenue[m] || 0;
      if (!base) continue;
      const portion = (base * (1 + interest)) / window;
      for (let k = 1; k <= window; k++) {
        const idx = m + k; // deferred starts the following month
        if (idx < arr.length) arr[idx] += portion;
      }
    }
    return arr.map((v) => Math.round(v));
  })();

  // Chart state: toggle smoothed series visibility
  const [showSmoothed, setShowSmoothed] = useState(false);

  const chartData = months.map((m, i) => ({
    month: m,
    revenue: modelRevenue[i],
    smoothed: smoothed[i],
  }));

  const totalRevenue = modelRevenue.reduce((s, v) => s + v, 0);
  const totalSmoothed = smoothed.reduce((s, v) => s + v, 0);

  // Align all sections to the same data source
  // Treat current month as Mar (index 2) in this demo
  const currentMonthIndex = 2;
  const sumAll = tierMonthly.reduce((s, t) => s + t.revenue, 0);
  const currentGrossScale =
    sumAll > 0 ? grossByMonth[currentMonthIndex] / sumAll : 0;
  const currentSplit = qualitySplits[currentMonthIndex];
  const tierMonthlyCurrent = tierMonthly.map((t) => ({
    ...t,
    creatorRevenue: Math.round(t.revenue * currentGrossScale * currentSplit),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Revenue Analytics
            </h1>
            <p className="text-muted-foreground">
              ML-optimized payout smoothing and earnings insights
            </p>
          </div>

          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue (3mo)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +23.1% from last period
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Smoothed Payouts
                </CardTitle>
                <Shield className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${totalSmoothed.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  ML-optimized distribution
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Payout
                </CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${smoothed[currentMonthIndex].toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {months[currentMonthIndex]} 1st, 2024
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="xl:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Revenue Trends (Jan–Jun)
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant={showSmoothed ? "default" : "outline"}
                  onClick={() => setShowSmoothed((v) => !v)}
                >
                  {showSmoothed
                    ? "Hide Smoothed Payouts"
                    : "Show Smoothed Payouts"}
                </Button>
              </div>
              <RevenueChart data={chartData} showSmoothed={showSmoothed} />
            </div>

            {/* Payout Schedule */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Payout Schedule
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Upcoming ML-smoothed payouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {months
                  .map((m, i) => ({
                    date: `${m} 1`,
                    amount: smoothed[i],
                    status:
                      i < currentMonthIndex
                        ? "completed"
                        : i === currentMonthIndex
                        ? "pending"
                        : "scheduled",
                  }))
                  .map((payout, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {payout.date}, 2024
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${payout.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          payout.status === "pending" ? "default" : "secondary"
                        }
                      >
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
                <CardTitle className="text-foreground">
                  Revenue Breakdown
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Subscriptions by tier with monthly earnings
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tierMonthlyCurrent.map((item, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                      <h3 className="font-medium text-foreground">
                        {item.tier}
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Creator Revenue (this month):
                        </span>
                        <span className="text-foreground font-medium">
                          ${item.creatorRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Subscribers:
                        </span>
                        <span className="text-foreground font-medium">
                          {item.subscribers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Avg per Sub (creator share):
                        </span>
                        <span className="text-foreground font-medium">
                          ${(item.creatorRevenue / item.subscribers).toFixed(2)}
                        </span>
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
              <CardTitle className="text-foreground">
                ML Payout Insights
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Quality-based split and optional smoothing explained
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                  <h4 className="font-medium text-foreground mb-2">
                    Quality-Based Revenue Split
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Creator share is determined monthly by a quality model. For
                    example: 60% (excellent), 50% (average), 60% (excellent) for
                    the last three months. The red line shows this post-split
                    creator revenue each month.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-secondary">
                  <h4 className="font-medium text-foreground mb-2">
                    Optional Smoothing with 6% Uplift
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Opt in to spread each month's revenue evenly over three
                    months with a 6% uplift (e.g., $1,000 becomes $1,060 total ≈
                    $353/month). The blue line appears when smoothing is enabled
                    and reflects deferred payouts.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                  <h4 className="font-medium text-foreground mb-2">
                    Risk Reduction & Incentives
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Deferring payouts reduces volatility and helps mitigate AML
                    risks, while the interest subsidy increases total creator
                    earnings versus taking funds immediately.
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
