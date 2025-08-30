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
import {
  calculateMLScoreFromStringData,
  calculateRevenueSplit,
} from "@/lib/ml-utils";
import { baseVideos, getThumbnailImage, Video } from "@/lib/mockData";

// ML Model functions imported from shared utils

// Video Thumbnail Component
const VideoThumbnail = ({
  videoId,
  videoName,
}: {
  videoId: string;
  videoName: string;
}) => {
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

  // Calculate ML scores, splits, and revenue dynamically using useMemo
  const videos = useMemo(() => {
    return baseVideos.map((video) => {
      const mlScore = calculateMLScoreFromStringData(video);
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
                    <span>
                      {Math.floor(parseInt(video.watchtime) / 60000)}:
                      {((parseInt(video.watchtime) % 60000) / 1000)
                        .toString()
                        .padStart(2, "0")}
                    </span>
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
                        {Math.floor(parseInt(selectedVideo.watchtime) / 60000)}:
                        {((parseInt(selectedVideo.watchtime) % 60000) / 1000)
                          .toString()
                          .padStart(2, "0")}
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
                      <span className="text-muted-foreground">
                        Attributable Income:
                      </span>
                      <span className="font-medium">
                        {selectedVideo.donations}
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
