from typing import List, Dict, Any
from datetime import datetime

# --- Mock Database Storage ---
tiers_db = [
    {"id": "tier1", "name": "Basic Fan", "price": 4.99, "benefits": ["Behind-the-scenes access"], "subscriberCount": 2500},
    {"id": "tier2", "name": "Super Fan", "price": 9.99, "benefits": ["Q&As"], "subscriberCount": 1200},
    {"id": "tier3", "name": "VIP Circle", "price": 24.99, "benefits": ["1-on-1 access"], "subscriberCount": 180},
]

# One-time purchase items
one_time_purchases_db = [
    {"id": "purchase1", "name": "Exclusive Bootcamp", "price": 19.99, "description": "Learn advanced techniques", "type": "video", "creator_id": "creator1", "purchaseCount": 45},
    {"id": "purchase2", "name": "Premium E-book Guide", "price": 29.99, "description": "Complete guide to success", "type": "ebook", "creator_id": "creator1", "purchaseCount": 23},
    {"id": "purchase3", "name": "Limited Edition Merch", "price": 49.99, "description": "Exclusive creator merchandise", "type": "merchandise", "creator_id": "creator1", "purchaseCount": 12},
]

subscriptions_db: List[Dict[str, str]] = []
kyc_db: Dict[str, Dict[str, str]] = {}
videos_db: List[Dict[str, Any]] = []

# ML Model parameters for revenue calculation
def calculate_ml_score(video_data: Dict[str, Any]) -> float:
    """
    Rule-based ML model to calculate creator quality score
    Based on TikTok's reward factors: originality, watch time, engagement, search value
    """
    score = 0.0
    
    # Originality factor (0-25 points)
    if video_data.get("is_original", False):
        score += 15
    if video_data.get("unique_perspective", False):
        score += 10
    
    # Watch time factor (0-25 points)
    watch_time = video_data.get("watch_time", 0)
    if watch_time >= 60:  # At least 1 minute
        score += 10
    if watch_time >= 120:  # 2+ minutes
        score += 15
    elif watch_time >= 60:
        score += 10
    
    # Engagement factor (0-25 points)
    likes = video_data.get("likes", 0)
    comments = video_data.get("comments", 0)
    shares = video_data.get("shares", 0)
    
    if likes >= 1000:
        score += 10
    elif likes >= 500:
        score += 7
    elif likes >= 100:
        score += 5
    
    if comments >= 100:
        score += 10
    elif comments >= 50:
        score += 7
    elif comments >= 10:
        score += 5
    
    if shares >= 50:
        score += 5
    elif shares >= 20:
        score += 3
    elif shares >= 5:
        score += 1
    
    # Search value factor (0-25 points)
    if video_data.get("trending_topic", False):
        score += 15
    if video_data.get("searchable_content", False):
        score += 10
    
    # Content quality bonuses
    if video_data.get("no_ads", True):
        score += 5
    if video_data.get("policy_compliant", True):
        score += 5
    
    return min(100.0, score)

def calculate_revenue_split(ml_score: float) -> float:
    """
    Calculate revenue split based on ML quality score
    Higher scores get better revenue splits
    """
    if ml_score >= 90:
        return 0.75  # Top creators get 75%
    elif ml_score >= 80:
        return 0.70  # Excellent creators get 70%
    elif ml_score >= 70:
        return 0.65  # Good creators get 65%
    elif ml_score >= 60:
        return 0.60  # Average creators get 60%
    elif ml_score >= 50:
        return 0.55  # Below average creators get 55%
    else:
        return 0.50  # Minimum split for low quality