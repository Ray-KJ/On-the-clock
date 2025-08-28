// Mock data for the TikTok Creator Economy demo

export interface Tier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  subscriberCount: number;
}

export interface CreatorStats {
  totalSubscribers: number;
  monthlyRevenue: number;
  totalWatchTime: number;
  engagementRate: number;
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    tier: string;
  }>;
}

export interface RevenueData {
  month: string;
  revenue: number;
  smoothed: number;
}

export const mockTiers: Tier[] = [
  {
    id: "tier1",
    name: "Basic Fan",
    price: 4.99,
    benefits: ["Early access to videos", "Exclusive behind-the-scenes", "Fan badge"],
    subscriberCount: 5200
  },
  {
    id: "tier2",
    name: "Super Fan",
    price: 9.99,
    benefits: ["All Basic benefits", "Monthly Q&A sessions", "Custom shoutouts", "Discord access"],
    subscriberCount: 2400
  },
  {
    id: "tier3",
    name: "VIP Creator Circle",
    price: 24.99,
    benefits: ["All Super Fan benefits", "1-on-1 video calls", "Course content", "Collaboration opportunities"],
    subscriberCount: 460
  }
];

export const mockCreatorStats: CreatorStats = {
  totalSubscribers: 1859,
  monthlyRevenue: 18420,
  totalWatchTime: 125680,
  engagementRate: 8.7,
  topVideos: [
    {
      id: "1",
      title: "Dancing in Times Square! 🔥",
      views: 2450000,
      tier: "Public"
    },
    {
      id: "2", 
      title: "Behind the Scenes: NYC Shoot",
      views: 89500,
      tier: "Tier 1+"
    },
    {
      id: "3",
      title: "Q&A: Your Questions Answered",
      views: 45200,
      tier: "Tier 2+"
    }
  ]
};

export const mockRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 12500, smoothed: 13200 },
  { month: "Feb", revenue: 18900, smoothed: 14100 },
  { month: "Mar", revenue: 8200, smoothed: 15300 },
  { month: "Apr", revenue: 22100, smoothed: 16200 },
  { month: "May", revenue: 25400, smoothed: 17800 },
  { month: "Jun", revenue: 15600, smoothed: 18420 },
];

export const mockCreators = [
  {
    id: "creator1",
    name: "Alex Rivera",
    username: "@alexdances",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
    subscribers: "2.1M",
    description: "Professional dancer & choreographer sharing exclusive content",
    verified: true,
    tiers: mockTiers
  }
];