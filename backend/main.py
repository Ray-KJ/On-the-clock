from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; restrict in prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Membership Service Mock Data ---
tiers_db = [
    {"id": "tier1", "name": "Basic Fan", "price": 4.99, "benefits": ["Behind-the-scenes access"], "subscriberCount": 2500},
    {"id": "tier2", "name": "Super Fan", "price": 9.99, "benefits": ["Q&As", "Community access"], "subscriberCount": 1200},
    {"id": "tier3", "name": "VIP Circle", "price": 24.99, "benefits": ["1-on-1 access"], "subscriberCount": 180},
]

subscriptions_db = []
kyc_db = {}

@app.get("/tiers/{creator_id}")
def get_tiers(creator_id: str):
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
    raise HTTPException(status_code=404, detail="Tier not found")

@app.delete("/tiers/{tier_id}")
def delete_tier(tier_id: str):
    global tiers_db
    tiers_db = [t for t in tiers_db if t["id"] != tier_id]
    return {"success": True}

@app.post("/subscribe/")
def subscribe(user_id: str = Form(...), tier_id: str = Form(...)):
    subscriptions_db.append({"user_id": user_id, "tier_id": tier_id})
    return {"success": True}

@app.get("/subscriptions/{user_id}")
def get_subscriptions(user_id: str):
    return [s for s in subscriptions_db if s["user_id"] == user_id]

@app.post("/kyc/verify/{creator_id}")
def trigger_kyc(creator_id: str):
    kyc_db[creator_id] = {"status": "pending"}
    return {"status": "pending"}

@app.get("/kyc/status/{creator_id}")
def get_kyc_status(creator_id: str):
    return kyc_db.get(creator_id, {"status": "not_started"})

@app.get("/dashboard/{creator_id}")
def get_dashboard(creator_id: str):
    # Example stats
    return {
        "total_subscribers": sum(t["subscriberCount"] for t in tiers_db),
        "total_tiers": len(tiers_db),
        "revenue": sum(t["price"] * t["subscriberCount"] for t in tiers_db),
    }

@app.post("/payout/{creator_id}")
def trigger_payout(creator_id: str):
    # Example ML payout simulation
    return {
        "smoothed_payouts": [100, 120, 110, 130],
        "insights": "Payouts are increasing month over month."
    }

# --- Content Service Mock Data ---
videos_db = []

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
    return videos_db

@app.get("/content/{content_id}")
def get_content(content_id: str, user_id: str):
    # For demo, just return the video if found
    for v in videos_db:
        if v["id"] == content_id:
            return v
    raise HTTPException(status_code=404, detail="Content not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)