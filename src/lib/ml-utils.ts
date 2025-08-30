// ML Model functions - shared between frontend and backend
// This file mirrors the logic in backend/models.py

export interface MLVideoData {
  is_original?: boolean;
  unique_perspective?: boolean;
  watch_time?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  trending_topic?: boolean;
  searchable_content?: boolean;
  no_ads?: boolean;
  policy_compliant?: boolean;
}

/**
 * Rule-based ML model to calculate creator quality score
 * Based on TikTok's reward factors: originality, watch time, engagement, search value
 * This function mirrors the logic in backend/models.py
 */
export function calculateMLScore(videoData: MLVideoData): number {
  let score = 0.0;
  
  // Originality factor (0-25 points)
  if (videoData.is_original) {
    score += 15;
  }
  if (videoData.unique_perspective) {
    score += 10;
  }
  
  // Watch time factor (0-25 points)
  const watchTime = videoData.watch_time || 0;
  if (watchTime >= 120) { // 2+ minutes
    score += 15;
  } else if (watchTime >= 60) { // At least 1 minute
    score += 10;
  }
  
  // Engagement factor (0-25 points)
  const likes = videoData.likes || 0;
  const comments = videoData.comments || 0;
  const shares = videoData.shares || 0;
  
  if (likes >= 1000) {
    score += 10;
  } else if (likes >= 500) {
    score += 7;
  } else if (likes >= 100) {
    score += 5;
  }
  
  if (comments >= 100) {
    score += 10;
  } else if (comments >= 50) {
    score += 7;
  } else if (comments >= 10) {
    score += 5;
  }
  
  if (shares >= 50) {
    score += 5;
  } else if (shares >= 20) {
    score += 3;
  } else if (shares >= 5) {
    score += 1;
  }
  
  // Search value factor (0-25 points)
  if (videoData.trending_topic) {
    score += 15;
  }
  if (videoData.searchable_content) {
    score += 10;
  }
  
  // Content quality bonuses
  if (videoData.no_ads !== false) { // Default to true
    score += 5;
  }
  if (videoData.policy_compliant !== false) { // Default to true
    score += 5;
  }
  
  return Math.min(100.0, score);
}

/**
 * Calculate revenue split based on ML quality score
 * Higher scores get better revenue splits
 * This function mirrors the logic in backend/models.py
 */
export function calculateRevenueSplit(mlScore: number): number {
  if (mlScore >= 90) {
    return 0.75; // Top creators get 75%
  } else if (mlScore >= 80) {
    return 0.70; // Excellent creators get 70%
  } else if (mlScore >= 70) {
    return 0.65; // Good creators get 65%
  } else if (mlScore >= 60) {
    return 0.60; // Average creators get 60%
  } else if (mlScore >= 50) {
    return 0.55; // Below average creators get 55%
  } else {
    return 0.50; // Minimum split for low quality
  }
}

/**
 * Helper function to calculate ML score from string-based video data
 * Used for compatibility with existing frontend data structures
 */
export function calculateMLScoreFromStringData(video: {
  name: string;
  views: string;
  comments: string;
  watchtime: string;
  likes: string;
  shares: string;
}): number {
  // Convert string values to numbers for calculation
  const views = parseInt(video.views.replace(/[KMB]/g, "")) *
    (video.views.includes("K") ? 1000 : video.views.includes("M") ? 1000000 : 1);
  const comments = parseInt(video.comments);
  const watchTime = parseInt(video.watchtime);
  const likes = parseInt(video.likes.replace(/[KMB]/g, "")) *
    (video.likes.includes("K") ? 1000 : video.likes.includes("M") ? 1000000 : 1);
  const shares = parseInt(video.shares);

  
  // Create MLVideoData object with more realistic scoring
  const mlData: MLVideoData = {
    // Originality based on video name/content type
    is_original: video.name.toLowerCase().includes("tutorial") || 
                 video.name.toLowerCase().includes("course") || 
                 video.name.toLowerCase().includes("basics"),
    unique_perspective: video.name.toLowerCase().includes("advanced") || 
                       video.name.toLowerCase().includes("secrets") ||
                       video.name.toLowerCase().includes("patterns"),
    watch_time: watchTime,
    likes,
    comments,
    shares,
    // Trending topic based on engagement metrics
    trending_topic: (likes >= 2000 || comments >= 100 || shares >= 50),
    // Searchable content based on educational keywords
    searchable_content: video.name.toLowerCase().includes("tutorial") || 
                       video.name.toLowerCase().includes("course") || 
                       video.name.toLowerCase().includes("guide") ||
                       video.name.toLowerCase().includes("tips"),
    no_ads: true,
    policy_compliant: true
  }; 

  return calculateMLScore(mlData);
}
 