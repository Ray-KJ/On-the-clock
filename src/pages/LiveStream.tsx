import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  Users,
  DollarSign,
  Target,
  Clock,
  Crown,
  Sparkles,
} from "lucide-react";
import { mockOneTimePurchases } from "@/lib/mockData";

const LiveStream = () => {
  const navigate = useNavigate();
  const { creatorId = "creator1" } = useParams();
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(1247);
  const [likeCount, setLikeCount] = useState(892);
  const [commentCount, setCommentCount] = useState(156);
  const [shareCount, setShareCount] = useState(89);
  const [fundingProgress, setFundingProgress] = useState(0.65); // 65% progress
  const [fundingGoal, setFundingGoal] = useState(10000);
  const [fundingRaised, setFundingRaised] = useState(6500);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [customAmount, setCustomAmount] = useState(0);

  // Simulate live updates
  useState(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 10 - 5));
      setLikeCount((prev) => prev + Math.floor(Math.random() * 5));
      setCommentCount((prev) => prev + Math.floor(Math.random() * 3));
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 3000);

    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePurchase = (purchase: any) => {
    // Handle purchase logic here
    console.log("Purchase:", purchase);
    // You can add actual purchase logic here
  };

  const handleCustomDonation = () => {
    if (customAmount > 0) {
      console.log("Custom donation:", customAmount);
      // Update funding progress
      const newRaised = fundingRaised + customAmount;
      const newProgress = Math.min(newRaised / fundingGoal, 1);
      setFundingRaised(newRaised);
      setFundingProgress(newProgress);
      setCustomAmount(0);
      // You can add actual donation logic here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-foreground hover:bg-muted"
          >
            ← Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              LIVE
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Live Stream Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Live Stream Video */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                      alt="Creator Avatar"
                      className="w-12 h-12 rounded-full border-2 border-primary"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        Alex Chen
                      </h2>
                      <p className="text-sm text-muted-foreground">@alexchen</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {viewerCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Viewers
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Live Stream Video */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {/* Background Image */}
                  <img
                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Live Stream Background"
                    className="w-full h-full object-cover opacity-80"
                  />

                  {/* TikTok-style Live Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">LIVE</span>
                  </div>

                  {/* Creator Info Overlay */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                        alt="Creator Avatar"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                      <div className="text-white">
                        <div className="text-sm font-medium">Alex Chen</div>
                        <div className="text-xs opacity-80">@alexchen</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Stats Overlay - TikTok Style */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-white text-sm font-medium">
                        {likeCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-medium">
                        {commentCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                      <Share2 className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm font-medium">
                        {shareCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Viewer Count - TikTok Style */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        {viewerCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Live Stream Content Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white bg-black/40 backdrop-blur-sm px-6 py-4 rounded-2xl">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                        <Play className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Advanced React Patterns
                      </h3>
                      <p className="text-white/90 text-sm">
                        Building complex state management solutions
                      </p>
                      <p className="text-white/70 text-xs mt-2">
                        Live coding session in progress...
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    {
                      user: "Sarah",
                      message: "This is amazing! 🚀",
                      time: "2m ago",
                    },
                    {
                      user: "Mike",
                      message: "Can you explain the context part?",
                      time: "1m ago",
                    },
                    {
                      user: "Emma",
                      message: "Just joined! What did I miss?",
                      time: "1m ago",
                    },
                    {
                      user: "Alex",
                      message: "Great question Mike! Let me show you...",
                      time: "now",
                    },
                    {
                      user: "David",
                      message: "This pattern is so useful!",
                      time: "now",
                    },
                  ].map((chat, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {chat.user.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {chat.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {chat.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Funding Progress */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Crowdfunding Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${fundingRaised.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    raised of ${fundingGoal.toLocaleString()} goal
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${fundingProgress * 100}%` }}
                  ></div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {Math.round(fundingProgress * 100)}% Complete
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((fundingGoal - fundingRaised) / 100) * 100} more
                    needed
                  </div>
                </div>

                {/* Fund Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Fund This Project
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Fund Exclusive Content
                      </SheetTitle>
                      <SheetDescription>
                        Support this project and unlock exclusive content when
                        the goal is reached!
                      </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">
                          🎯 Project: Advanced React Patterns Live Course
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Support this live coding session and unlock the
                          complete Advanced React Patterns course with exclusive
                          Q&A sessions and project templates.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">
                          Choose Your Contribution:
                        </h4>

                        {/* Custom Donation Amount */}
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-medium text-foreground mb-3">
                            💝 Custom Donation Amount
                          </h5>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                $
                              </span>
                              <input
                                type="number"
                                placeholder="Enter amount"
                                min="1"
                                step="1"
                                className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={customAmount}
                                onChange={(e) =>
                                  setCustomAmount(Number(e.target.value) || 0)
                                }
                              />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {[5, 10, 25, 50, 100].map((amount) => (
                                <button
                                  key={amount}
                                  onClick={() => setCustomAmount(amount)}
                                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                    customAmount === amount
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "border-input text-foreground hover:border-primary"
                                  }`}
                                >
                                  ${amount}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={handleCustomDonation}
                              disabled={customAmount <= 0}
                              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                            >
                              Donate ${customAmount}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Crown className="w-4 h-4" />
                          <span className="font-semibold">
                            Exclusive Benefits
                          </span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Early access to the complete course</li>
                          <li>• 1-on-1 Q&A session with Alex</li>
                          <li>• Exclusive project templates</li>
                          <li>• Priority support and updates</li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            {/* Live Stats */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Live Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Viewers</span>
                  <span className="font-medium text-foreground">
                    {viewerCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Likes</span>
                  <span className="font-medium text-foreground">
                    {likeCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Comments
                  </span>
                  <span className="font-medium text-foreground">
                    {commentCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shares</span>
                  <span className="font-medium text-foreground">
                    {shareCount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
