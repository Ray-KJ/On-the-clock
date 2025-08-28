import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    smoothed?: number;
  }>;
  showSmoothed?: boolean;
}

export const RevenueChart = ({
  data,
  showSmoothed = true,
}: RevenueChartProps) => {
  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Revenue Trends</CardTitle>
        <CardDescription className="text-muted-foreground">
          ML-optimized payout smoothing over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            {showSmoothed && (
              <Area
                type="monotone"
                dataKey="smoothed"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.15}
                name="Smoothed Payout (Area)"
              />
            )}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#ef4444" /* red */
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              name="Model Revenue (post-split)"
            />
            {showSmoothed && (
              <Line
                type="monotone"
                dataKey="smoothed"
                stroke="#3b82f6" /* blue */
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Smoothed Payout"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
