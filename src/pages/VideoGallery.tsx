import { useState, useMemo } from "react";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  Eye,
  MessageCircle,
  Clock,
  Heart,
  Share2,
  DollarSign,
  TrendingUp,
  Star,
  Sparkles,
} from "lucide-react";

interface Video {
  id: string;
  name: string;
  links: string;
  tiktokId: string;
  views: string;
  comments: string;
  watchtime: string;
  likes: string;
  shares: string;
  donations: number;
  revenue: string;
  uploadDate: string;
  mlScore?: number;
  mlSplit?: number;
}

// ML Model functions based on models.py
const calculateMLScore = (
  video: Omit<Video, "mlScore" | "mlSplit" | "revenue">
): number => {
  let score = 0.0;

  // Convert string values to numbers for calculation
  const views =
    parseInt(video.views.replace(/[KMB]/g, "")) *
    (video.views.includes("K")
      ? 1000
      : video.views.includes("M")
      ? 1000000
      : 1);
  const comments = parseInt(video.comments);
  const watchTime = parseInt(video.watchtime);
  const likes =
    parseInt(video.likes.replace(/[KMB]/g, "")) *
    (video.likes.includes("K")
      ? 1000
      : video.likes.includes("M")
      ? 1000000
      : 1);
  const shares = parseInt(video.shares);

  // Originality factor (0-20 points) - vary based on video name uniqueness
  const nameUniqueness = video.name.charCodeAt(0) % 5; // 0-4 points based on name
  score += 10 + nameUniqueness;
  score += 5; // base originality

  // Watch time factor (0-25 points) - more granular scoring
  if (watchTime >= 150000) {
    score += 25; // 2.5+ minutes
  } else if (watchTime >= 120000) {
    score += 20; // 2+ minutes
  } else if (watchTime >= 90000) {
    score += 15; // 1.5+ minutes
  } else if (watchTime >= 60000) {
    score += 10; // 1+ minute
  } else {
    score += 5; // less than 1 minute
  }

  // Engagement factor (0-30 points) - more detailed scoring
  // Likes scoring (0-10 points)
  if (likes >= 2000) {
    score += 10;
  } else if (likes >= 1000) {
    score += 8;
  } else if (likes >= 500) {
    score += 6;
  } else if (likes >= 100) {
    score += 4;
  } else {
    score += 2;
  }

  // Comments scoring (0-10 points)
  if (comments >= 500) {
    score += 10;
  } else if (comments >= 200) {
    score += 8;
  } else if (comments >= 100) {
    score += 6;
  } else if (comments >= 50) {
    score += 4;
  } else if (comments >= 10) {
    score += 2;
  } else {
    score += 1;
  }

  // Shares scoring (0-10 points)
  if (shares >= 100) {
    score += 10;
  } else if (shares >= 50) {
    score += 8;
  } else if (shares >= 20) {
    score += 6;
  } else if (shares >= 10) {
    score += 4;
  } else if (shares >= 5) {
    score += 2;
  } else {
    score += 1;
  }

  // Views factor (0-15 points) - add views as a factor
  if (views >= 15000) {
    score += 15;
  } else if (views >= 10000) {
    score += 12;
  } else if (views >= 5000) {
    score += 8;
  } else if (views >= 1000) {
    score += 4;
  } else {
    score += 2;
  }

  // Content quality bonuses (0-10 points)
  score += 5; // no ads
  score += 5; // policy compliant

  return Math.min(100.0, score);
};

const calculateRevenueSplit = (mlScore: number): number => {
  if (mlScore >= 90) {
    return 0.75; // Top creators get 75%
  } else if (mlScore >= 80) {
    return 0.7; // Excellent creators get 70%
  } else if (mlScore >= 70) {
    return 0.65; // Good creators get 65%
  } else if (mlScore >= 60) {
    return 0.6; // Average creators get 60%
  } else if (mlScore >= 50) {
    return 0.55; // Below average creators get 55%
  } else {
    return 0.5; // Minimum split for low quality
  }
};

// Video Thumbnail Component
const VideoThumbnail = ({
  videoId,
  videoName,
}: {
  videoId: string;
  videoName: string;
}) => {
  // Map video names to specific Unsplash images
  const getThumbnailImage = (name: string) => {
    const imageMap: { [key: string]: string } = {
      // Original 4 videos
      "React Tutorial for Beginners":
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "CSS Tutorial – Full Course for Beginners":
        "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Learn HTML in 2 minutes":
        "https://images.unsplash.com/photo-1632882765546-1ee75f53becb?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Learn JavaScript - Full Course for Beginners":
        "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      // Free Videos
      "React Basics":
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
      "CSS Grid":
        "https://plus.unsplash.com/premium_photo-1680700308566-543a60569017?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "JavaScript Fundamentals":
        "https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Web Dev Tips":
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      // Exclusive Content
      "Advanced React":
        "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Code Review":
        "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Q&A Session":
        "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "State Management":
        "https://plus.unsplash.com/premium_photo-1678566111481-8e275550b700?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };

    return imageMap[name] || imageMap["React"]; // fallback to React image
  };

  return (
    <div className="relative w-full h-full group">
      {/* Video Thumbnail Image */}
      <img
        src={getThumbnailImage(videoName)}
        alt={`${videoName} Video Thumbnail`}
        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          // Fallback to a gradient background if image fails to load
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />

      {/* Fallback Gradient Background */}
      <div
        className="w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden hidden"
        style={{
          background: `linear-gradient(135deg, hsl(${
            videoName.charCodeAt(0) % 360
          }, 60%, 50%), hsl(${
            (videoName.charCodeAt(0) + 30) % 360
          }, 60%, 60%))`,
        }}
      >
        <div className="text-white/80 text-xs font-mono bg-black/30 px-2 py-1 rounded">
          {videoId.slice(-8)}
        </div>
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-lg">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Play className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showMLDialog, setShowMLDialog] = useState(false);

  const baseVideos: Omit<Video, "mlScore" | "mlSplit" | "revenue">[] = [
    // Original 4 videos
    {
      id: "1",
      name: "React Tutorial for Beginners",
      links:
        "https://www.tiktok.com/@odahojr_dev/video/7417885638571134213?q=react&t=1756469300348",
      tiktokId: "7515754084410952967",
      views: "10.2K",
      comments: "523",
      watchtime: "145500",
      likes: "1.2K",
      shares: "320",
      donations: 4500,
      uploadDate: "2025-03-15",
    },
    {
      id: "2",
      name: "CSS Tutorial – Full Course for Beginners",
      links:
        "https://www.tiktok.com/@codetheworld.io/video/7277023138456538375?q=css&t=1756469316434",
      tiktokId: "7515754084410952968",
      views: "8.5K",
      comments: "412",
      watchtime: "135000",
      likes: "950",
      shares: "280",
      donations: 3800,
      uploadDate: "2025-03-10",
    },
    {
      id: "3",
      name: "Learn HTML in 2 minutes",
      links:
        "https://www.tiktok.com/@thecodedonkey/video/7267611793382558977?q=html&t=1756469331327",
      tiktokId: "7515754084410952969",
      views: "15.7K",
      comments: "678",
      watchtime: "152000",
      likes: "2.1K",
      shares: "450",
      donations: 5200,
      uploadDate: "2025-03-05",
    },
    {
      id: "4",
      name: "Learn JavaScript - Full Course for Beginners",
      links:
        "https://www.tiktok.com/@devslopes/video/7184676171588668715?q=Javascript&t=1756469345593",
      tiktokId: "7515754084410952970",
      views: "12.3K",
      comments: "589",
      watchtime: "148000",
      likes: "1.8K",
      shares: "390",
      donations: 4200,
      uploadDate: "2025-02-28",
    },
    // Free Videos from ConsumerDashboard
    {
      id: "5",
      name: "React Basics",
      links:
        "https://www.tiktok.com/@reacttutorials/video/7417885638571134214?q=react+basics&t=1756469300349",
      tiktokId: "7515754084410952968",
      views: "45.2K",
      comments: "892",
      watchtime: "923000",
      likes: "3.8K",
      shares: "567",
      donations: 6800,
      uploadDate: "2025-02-20",
    },
    {
      id: "6",
      name: "CSS Grid",
      links:
        "https://www.tiktok.com/@cssmaster/video/7277023138456538376?q=css+grid&t=1756469316435",
      tiktokId: "7515754084410952969",
      views: "38.7K",
      comments: "654",
      watchtime: "1338000",
      likes: "2.9K",
      shares: "423",
      donations: 5800,
      uploadDate: "2025-02-15",
    },
    {
      id: "7",
      name: "JavaScript Fundamentals",
      links:
        "https://www.tiktok.com/@jsdev/video/7267611793382558978?q=javascript+fundamentals&t=1756469331328",
      tiktokId: "7515754084410952971",
      views: "52.1K",
      comments: "1.2K",
      watchtime: "1125000",
      likes: "4.5K",
      shares: "678",
      donations: 7200,
      uploadDate: "2025-02-10",
    },
    {
      id: "8",
      name: "Web Dev Tips",
      links:
        "https://www.tiktok.com/@webdevtips/video/7184676171588668716?q=web+development+tips&t=1756469345594",
      tiktokId: "7515754084410952972",
      views: "29.8K",
      comments: "456",
      watchtime: "753000",
      likes: "2.1K",
      shares: "234",
      donations: 4800,
      uploadDate: "2025-02-05",
    },
    // Exclusive Content from ConsumerDashboard
    {
      id: "9",
      name: "Advanced React",
      links:
        "https://www.tiktok.com/@reactpro/video/7417885638571134215?q=advanced+react&t=1756469300350",
      tiktokId: "7515754084410952973",
      views: "18.9K",
      comments: "789",
      watchtime: "1695000",
      likes: "3.2K",
      shares: "456",
      donations: 8500,
      uploadDate: "2025-01-25",
    },
    {
      id: "10",
      name: "Code Review",
      links:
        "https://www.tiktok.com/@codereviewer/video/7277023138456538377?q=code+review&t=1756469316436",
      tiktokId: "7515754084410952974",
      views: "8.9K",
      comments: "345",
      watchtime: "2142000",
      likes: "1.8K",
      shares: "234",
      donations: 6500,
      uploadDate: "2025-01-15",
    },
    {
      id: "11",
      name: "Q&A Session",
      links:
        "https://www.tiktok.com/@devqa/video/7267611793382558979?q=qa+session&t=1756469331329",
      tiktokId: "7515754084410952975",
      views: "15.7K",
      comments: "567",
      watchtime: "2538000",
      likes: "2.7K",
      shares: "345",
      donations: 7800,
      uploadDate: "2025-01-05",
    },
    {
      id: "12",
      name: "State Management",
      links:
        "https://www.tiktok.com/@statemaster/video/7184676171588668717?q=state+management&t=1756469345595",
      tiktokId: "7515754084410952976",
      views: "9.4K",
      comments: "234",
      watchtime: "1885000",
      likes: "1.5K",
      shares: "189",
      donations: 5500,
      uploadDate: "2024-12-20",
    },
  ];

  // Calculate ML scores, splits, and revenue dynamically using useMemo
  const videos = useMemo(() => {
    return baseVideos.map((video) => {
      const mlScore = calculateMLScore(video);
      const mlSplit = calculateRevenueSplit(mlScore);
      const revenue = video.donations * mlSplit;

      return {
        ...video,
        mlScore,
        mlSplit,
        revenue: `$${revenue.toLocaleString()}`,
      };
    });
  }, []);

  const totalRevenue = useMemo(() => {
    return videos.reduce((sum, video) => {
      const revenue = parseFloat(
        video.revenue.replace("$", "").replace(",", "")
      );
      return sum + revenue;
    }, 0);
  }, [videos]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setShowMLDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Video Gallery
            </h1>
          </div>

          {/* Revenue Summary */}
          <Card className="mb-8 bg-card border-border shadow-lg max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground flex items-center justify-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                Total Revenue Overview
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                ML Model Split Applied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-muted/50 rounded-lg border border-border">
                <div className="text-3xl font-bold text-foreground">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Attributable Income
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                onClick={() => handleVideoClick(video)}
              >
                <CardHeader className="pb-3">
                  <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                    <VideoThumbnail
                      videoId={video.tiktokId}
                      videoName={video.name}
                    />
                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full border border-border z-10 font-medium">
                      {(
                        (parseFloat(
                          video.revenue.replace("$", "").replace(",", "")
                        ) /
                          totalRevenue) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {video.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{video.views}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{parseInt(video.watchtime) / 1000}s</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Revenue:
                      </span>
                      <span className="font-semibold text-foreground">
                        {video.revenue}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        ML Split:
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-muted text-foreground border-border"
                      >
                        {(video.mlSplit! * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Upload:
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(video.uploadDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* ML Model Details Dialog */}
      <Dialog open={showMLDialog} onOpenChange={setShowMLDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              ML Model Analysis: {selectedVideo?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed performance metrics and ML model scoring
            </DialogDescription>
          </DialogHeader>

          {selectedVideo && (
            <div className="space-y-6">
              {/* Video Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Video Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views:</span>
                      <span className="font-medium">{selectedVideo.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Watch Time:</span>
                      <span className="font-medium">
                        {parseInt(selectedVideo.watchtime) / 1000}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Likes:</span>
                      <span className="font-medium">{selectedVideo.likes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comments:</span>
                      <span className="font-medium">
                        {selectedVideo.comments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shares:</span>
                      <span className="font-medium">
                        {selectedVideo.shares}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Revenue & ML
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Revenue:
                      </span>
                      <span className="font-medium text-green-600">
                        {selectedVideo.revenue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Donations:</span>
                      <span className="font-medium">
                        {selectedVideo.donations}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ML Score:</span>
                      <span className="font-medium">
                        {selectedVideo.mlScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ML Split:</span>
                      <span className="font-medium">
                        {(selectedVideo.mlSplit! * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => window.open(selectedVideo.links, "_blank")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoGallery;
