from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models import videos_db, calculate_ml_score, calculate_revenue_split

router = APIRouter()

@router.post("/")
async def upload_content(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    minTier: str = Form(...),
    tags: str = Form(""),
    creator_id: str = Form(""),
    is_original: bool = Form(True),
    unique_perspective: bool = Form(False),
    trending_topic: bool = Form(False),
    searchable_content: bool = Form(True),
    no_ads: bool = Form(True),
    policy_compliant: bool = Form(True)
):
    video = {
        "id": f"video{len(videos_db)+1}",
        "filename": file.filename,
        "title": title,
        "description": description,
        "minTier": minTier,
        "tags": tags,
        "creator_id": creator_id,
        "created_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        # ML model parameters
        "is_original": is_original,
        "unique_perspective": unique_perspective,
        "trending_topic": trending_topic,
        "searchable_content": searchable_content,
        "no_ads": no_ads,
        "policy_compliant": policy_compliant,
        # Mock engagement data (in real app, this would come from TikTok API)
        "watch_time": 90,  # seconds
        "likes": 500,
        "comments": 75,
        "shares": 25,
    }
    
    # Calculate ML score and revenue split
    ml_score = calculate_ml_score(video)
    revenue_split = calculate_revenue_split(ml_score)
    
    video["ml_score"] = ml_score
    video["revenue_split"] = revenue_split
    
    videos_db.append(video)
    return video

@router.get("/creator/{creator_id}")
def get_creator_content(creator_id: str):
    return [v for v in videos_db if v["creator_id"] == creator_id]

@router.get("/{content_id}")
def get_content(content_id: str, user_id: str):
    # For demo, just return the video if found
    for v in videos_db:
        if v["id"] == content_id:
            return v
    raise HTTPException(status_code=404, detail="Content not found")

@router.get("/ml-score/{content_id}")
def get_content_ml_score(content_id: str):
    for v in videos_db:
        if v["id"] == content_id:
            return {
                "content_id": content_id,
                "ml_score": v.get("ml_score", 0),
                "revenue_split": v.get("revenue_split", 0.5),
                "quality_factors": {
                    "originality": v.get("is_original", False),
                    "unique_perspective": v.get("unique_perspective", False),
                    "trending_topic": v.get("trending_topic", False),
                    "searchable_content": v.get("searchable_content", False),
                    "no_ads": v.get("no_ads", False),
                    "policy_compliant": v.get("policy_compliant", False),
                }
            }
    raise HTTPException(status_code=404, detail="Content not found")