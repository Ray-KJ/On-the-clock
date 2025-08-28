import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { api, Tier } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, FileText, Tag, Users, Clock, Play } from "lucide-react";

const CREATOR_ID = "creator1";

const UploadVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minTier, setMinTier] = useState<string>("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tiers = [], isLoading: tiersLoading } = useQuery({
    queryKey: ["tiers", CREATOR_ID],
    queryFn: () => api.getTiers(CREATOR_ID),
    staleTime: 5 * 60 * 1000,
  });

  const { data: existingContent = [], isLoading: contentLoading } = useQuery({
    queryKey: ["content", CREATOR_ID],
    queryFn: () => api.getCreatorContent(CREATOR_ID),
    staleTime: 2 * 60 * 1000,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => api.uploadContent(formData),
    onSuccess: () => {
      toast({
        title: "Upload Successful!",
        description:
          "Your video has been uploaded and is now available to your subscribers.",
      });
      setFile(null);
      setTitle("");
      setDescription("");
      setMinTier("");
      setTags("");
      queryClient.invalidateQueries({ queryKey: ["content", CREATOR_ID] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description:
          error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select a video file.",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a video file smaller than 100MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !minTier) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields and select a video file.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("minTier", minTier);
      formData.append("tags", tags);
      formData.append("creator_id", CREATOR_ID);
      await uploadMutation.mutateAsync(formData);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTierName = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    return tier ? tier.name : "Unknown Tier";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Upload Video
            </h1>
            <p className="text-muted-foreground">
              Share exclusive content with your subscribers
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload New Video
                </CardTitle>
                <CardDescription>
                  Fill in the details and select your video file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="videoFile">Video File *</Label>
                    <div className="mt-2">
                      <Input
                        id="videoFile"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                    {file && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Video className="w-4 h-4" />
                          <span className="font-medium">{file.name}</span>
                          <Badge variant="secondary">
                            {formatFileSize(file.size)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter video title..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your video content..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minTier">Minimum Tier Required *</Label>
                    <Select value={minTier} onValueChange={setMinTier}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select minimum tier for access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public (Free)</SelectItem>
                        {tiers.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name} (${tier.price}/month)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter tags separated by commas..."
                      className="mt-2"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary text-white shadow-glow"
                    disabled={isUploading || !file || !title.trim() || !minTier}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Your Content Library
                  </CardTitle>
                  <CardDescription>Manage your uploaded videos</CardDescription>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-muted rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : existingContent.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No videos uploaded yet</p>
                      <p className="text-sm">
                        Start by uploading your first video!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {existingContent.map((content: any) => (
                        <div
                          key={content.id}
                          className="p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Play className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {content.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {content.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Users className="w-3 h-3 mr-1" />
                                  {getTierName(content.minTier)}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(
                                    content.created_at
                                  ).toLocaleDateString()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Upload Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Maximum file size: 100MB</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Supported formats: MP4, MOV, AVI, WebM</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>
                      Set appropriate tier restrictions to maximize engagement
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>
                      Add descriptive titles and tags for better discoverability
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadVideo;
