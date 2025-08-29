from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models import videos_db

router = APIRouter()

@router.post("/")
async def upload_content(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    minTier: str = Form(...),
    tags: str = Form(""),
    creator_id: str = Form("")
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
    }
    videos_db.append(video)
    return video

@router.get("/creator/{creator_id}")
def get_creator_content(creator_id: str):
    return videos_db

@router.get("/{content_id}")
def get_content(content_id: str, user_id: str):
    # For demo, just return the video if found
    for v in videos_db:
        if v["id"] == content_id:
            return v
    raise HTTPException(status_code=404, detail="Content not found")