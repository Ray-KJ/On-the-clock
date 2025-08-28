from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local dev; restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory mock data for demonstration
tiers_db = [
    {"id": "tier1", "name": "Basic Fan", "price": 4.99, "benefits": ["Behind-the-scenes access"], "subscriberCount": 10},
    {"id": "tier2", "name": "Super Fan", "price": 9.99, "benefits": ["Q&As", "Community access"], "subscriberCount": 5},
    {"id": "tier3", "name": "VIP Circle", "price": 24.99, "benefits": ["1-on-1 access"], "subscriberCount": 2},
]

videos_db = []

@app.get("/tiers/{creator_id}")
def get_tiers(creator_id: str):
    # For demo, return all tiers
    return tiers_db

@app.post("/tiers/")
def create_tier(tier: dict):
    tier["id"] = f"tier{len(tiers_db)+1}"
    tiers_db.append(tier)
    return tier

@app.put("/tiers/{tier_id}")
def update_tier(tier_id: str, tier: dict):
    for t in tiers_db:
        if t["id"] == tier_id:
            t.update(tier)
            return t
    return {"error": "Tier not found"}

@app.delete("/tiers/{tier_id}")
def delete_tier(tier_id: str):
    global tiers_db
    tiers_db = [t for t in tiers_db if t["id"] != tier_id]
    return {"success": True}

@app.post("/content/")
async def upload_content(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    minTier: str = Form(...),
    tags: str = Form("")
):
    video = {
        "id": f"video{len(videos_db)+1}",
        "filename": file.filename,
        "title": title,
        "description": description,
        "minTier": minTier,
        "tags": tags,
    }
    videos_db.append(video)
    return video

@app.get("/content/creator/{creator_id}")
def get_creator_content(creator_id: str):
    # For demo, return all videos
    return videos_db

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)