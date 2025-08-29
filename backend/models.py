from typing import List, Dict, Any
from datetime import datetime

# --- Mock Database Storage ---
tiers_db = [
    {"id": "tier1", "name": "Basic Fan", "price": 4.99, "benefits": ["Behind-the-scenes access"], "subscriberCount": 2500},
    {"id": "tier2", "name": "Super Fan", "price": 9.99, "benefits": ["Q&As", "Community access"], "subscriberCount": 1200},
    {"id": "tier3", "name": "VIP Circle", "price": 24.99, "benefits": ["1-on-1 access"], "subscriberCount": 180},
]

subscriptions_db: List[Dict[str, str]] = []
kyc_db: Dict[str, Dict[str, str]] = {}
videos_db: List[Dict[str, Any]] = []