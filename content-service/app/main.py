from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from enum import Enum
import requests

app = FastAPI()

class ContentVisibility(str, Enum):
    PUBLIC = "public"
    MEMBERS_ONLY = "members_only"

class Content(BaseModel):
    id: str = str(uuid.uuid4())
    creator_id: str
    title: str
    description: Optional[str] = None
    video_url: str
    visibility: ContentVisibility = ContentVisibility.PUBLIC
    allowed_tier_ids: List[str] = []  # Applicable if visibility is MEMBERS_ONLY

# In-memory storage for prototype
contents = []

# Mock URL for the membership service
MEMBERSHIP_SERVICE_URL = "http://localhost:8001" # Assuming membership service runs on port 8001

@app.get("/")
def read_root():
    return {"message": "Content Service Root"}

@app.post("/content/", response_model=Content)
def upload_content(content: Content):
    contents.append(content)
    return content

@app.get("/content/{content_id}", response_model=Content)
def get_content(content_id: str, user_id: Optional[str] = None):
    for content in contents:
        if content.id == content_id:
            if content.visibility == ContentVisibility.PUBLIC:
                return content
            elif content.visibility == ContentVisibility.MEMBERS_ONLY:
                if not user_id:
                    raise HTTPException(status_code=403, detail="User ID required for members-only content")
                
                # Check if user is subscribed to any of the allowed tiers
                try:
                    response = requests.get(f"{MEMBERSHIP_SERVICE_URL}/subscriptions/{user_id}")
                    response.raise_for_status() # Raise an exception for bad status codes
                    user_subscriptions = response.json()
                except requests.exceptions.RequestException as e:
                    raise HTTPException(status_code=500, detail=f"Failed to communicate with membership service: {e}")
                
                user_tier_ids = [sub['tier_id'] for sub in user_subscriptions if sub['creator_id'] == content.creator_id]
                
                if any(tier_id in content.allowed_tier_ids for tier_id in user_tier_ids):
                    content_dict = content.model_dump()  # Or .dict() for older Pydantic versions
                    content_dict["is_member"] = True
                    return content_dict
                else:
                    raise HTTPException(status_code=403, detail="Not subscribed to a required membership tier")
    raise HTTPException(status_code=404, detail="Content not found")

@app.get("/content/creator/{creator_id}", response_model=List[Content])
def get_creator_content(creator_id: str):
    return [c for c in contents if c.creator_id == creator_id]
