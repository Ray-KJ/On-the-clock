from fastapi import APIRouter, Form, HTTPException
from models import tiers_db, subscriptions_db, kyc_db, one_time_purchases_db

router = APIRouter()

@router.get("/tiers/{creator_id}")
def get_tiers(creator_id: str):
    return tiers_db

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

# One-time purchase endpoints
@router.get("/one-time-purchases/{creator_id}")
def get_one_time_purchases(creator_id: str):
    return [p for p in one_time_purchases_db if p["creator_id"] == creator_id]

@router.post("/one-time-purchases/")
def create_one_time_purchase(purchase: dict):
    purchase["id"] = f"purchase{len(one_time_purchases_db)+1}"
    purchase["purchaseCount"] = 0
    one_time_purchases_db.append(purchase)
    print(f"Created one-time purchase: {purchase['name']}")
    return purchase

@router.put("/one-time-purchases/{purchase_id}")
def update_one_time_purchase(purchase_id: str, purchase: dict):
    for p in one_time_purchases_db:
        if p["id"] == purchase_id:
            p.update(purchase)
            return p
    raise HTTPException(status_code=404, detail="One-time purchase not found")

@router.delete("/one-time-purchases/{purchase_id}")
def delete_one_time_purchase(purchase_id: str):
    global one_time_purchases_db
    one_time_purchases_db = [p for p in one_time_purchases_db if p["id"] != purchase_id]
    return {"success": True}

@router.post("/one-time-purchases/{purchase_id}/purchase")
def purchase_item(purchase_id: str, user_id: str = Form(...)):
    for p in one_time_purchases_db:
        if p["id"] == purchase_id:
            p["purchaseCount"] = p.get("purchaseCount", 0) + 1
            return {"success": True, "purchase_id": purchase_id, "user_id": user_id}
    raise HTTPException(status_code=404, detail="One-time purchase not found")

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
    # Example stats including one-time purchases
    one_time_revenue = sum(p["price"] * p.get("purchaseCount", 0) for p in one_time_purchases_db if p["creator_id"] == creator_id)
    
    # Ensure subscriberCount is not None and calculate safely
    total_subscribers = sum(t.get("subscriberCount", 0) or 0 for t in tiers_db)
    subscription_revenue = sum(t["price"] * (t.get("subscriberCount", 0) or 0) for t in tiers_db)
    
    return {
        "total_subscribers": total_subscribers,
        "total_tiers": len(tiers_db),
        "revenue": subscription_revenue,
        "one_time_revenue": one_time_revenue,
        "total_revenue": subscription_revenue + one_time_revenue,
    }

@router.post("/payout/{creator_id}")
def trigger_payout(creator_id: str):
    # Example ML payout simulation
    return {
        "smoothed_payouts": [100, 120, 110, 130],
        "insights": "Payouts are increasing month over month."
    }