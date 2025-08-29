from fastapi import APIRouter, Form, HTTPException
from models import tiers_db, subscriptions_db, kyc_db

router = APIRouter()

@router.get("/tiers/{creator_id}")
def get_tiers(creator_id: str):
    return tiers_db

# @router.get("/lu")
# def get_lu():
#     print("lu")
#     return "lu"

@router.post("/tiers/")
def create_tier(tier: dict):
    tier["id"] = f"tier{len(tiers_db)+1}"
    tiers_db.append(tier)
    print(f"Created tier: {tier['name']}")
    return tier

@router.put("/tiers/{tier_id}")
def update_tier(tier_id: str, tier: dict):
    for t in tiers_db:
        if t["id"] == tier_id:
            t.update(tier)
            return t
    raise HTTPException(status_code=404, detail="Tier not found")

@router.delete("/tiers/{tier_id}")
def delete_tier(tier_id: str):
    global tiers_db
    tiers_db = [t for t in tiers_db if t["id"] != tier_id]
    return {"success": True}

@router.post("/subscribe/")
def subscribe(user_id: str = Form(...), tier_id: str = Form(...)):
    subscriptions_db.append({"user_id": user_id, "tier_id": tier_id})
    # Increment subscriber count on the tier
    for t in tiers_db:
        if t["id"] == tier_id:
            t["subscriberCount"] = (t.get("subscriberCount", 0) or 0) + 1
            break
    return {"success": True}

@router.post("/subscribe_json")
def subscribe_json(payload: dict):
    user_id = payload.get("user_id")
    tier_id = payload.get("tier_id")
    if not user_id or not tier_id:
        raise HTTPException(status_code=400, detail="user_id and tier_id required")
    subscriptions_db.append({"user_id": user_id, "tier_id": tier_id})
    for t in tiers_db:
        if t["id"] == tier_id:
            t["subscriberCount"] = (t.get("subscriberCount", 0) or 0) + 1
            break
    return {"success": True}

@router.get("/subscriptions/{user_id}")
def get_subscriptions(user_id: str):
    return [s for s in subscriptions_db if s["user_id"] == user_id]

@router.post("/kyc/verify/{creator_id}")
def trigger_kyc(creator_id: str):
    kyc_db[creator_id] = {"status": "pending"}
    return {"status": "pending"}

@router.get("/kyc/status/{creator_id}")
def get_kyc_status(creator_id: str):
    return kyc_db.get(creator_id, {"status": "not_started"})

@router.get("/dashboard/{creator_id}")
def get_dashboard(creator_id: str):
    # Example stats
    return {
        "total_subscribers": sum(t["subscriberCount"] for t in tiers_db),
        "total_tiers": len(tiers_db),
        "revenue": sum(t["price"] * t["subscriberCount"] for t in tiers_db),
    }

@router.post("/payout/{creator_id}")
def trigger_payout(creator_id: str):
    # Example ML payout simulation
    return {
        "smoothed_payouts": [100, 120, 110, 130],
        "insights": "Payouts are increasing month over month."
    }