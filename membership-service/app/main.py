from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Membership Service Root"}

# In-memory storage for prototype
membership_tiers = []
subscriptions = []

ALLOWED_PRICES = [2.99, 5.99, 9.99]
MAX_TIERS_PER_CREATOR = 3

@app.post("/tiers/", response_model=MembershipTier)
def create_membership_tier(tier: MembershipTier):
    if len([t for t in membership_tiers if t.creator_id == tier.creator_id]) >= MAX_TIERS_PER_CREATOR:
        raise HTTPException(status_code=400, detail=f"Creator already has {MAX_TIERS_PER_CREATOR} tiers.")
    
    if tier.price not in ALLOWED_PRICES:
        raise HTTPException(status_code=400, detail=f"Price must be one of {ALLOWED_PRICES}.")

    membership_tiers.append(tier)
    return tier

@app.get("/tiers/{creator_id}", response_model=List[MembershipTier])
def get_creator_tiers(creator_id: str):
    return [tier for tier in membership_tiers if tier.creator_id == creator_id]

@app.put("/tiers/{tier_id}", response_model=MembershipTier)
def update_membership_tier(tier_id: str, updated_tier: MembershipTier):
    for idx, tier in enumerate(membership_tiers):
        if tier.id == tier_id:
            if updated_tier.price not in ALLOWED_PRICES:
                raise HTTPException(status_code=400, detail=f"Price must be one of {ALLOWED_PRICES}.")
            membership_tiers[idx] = updated_tier
            return updated_tier
    raise HTTPException(status_code=404, detail="Tier not found")

@app.post("/subscribe/", response_model=Subscription)
def subscribe_to_tier(subscription: Subscription):
    # In a real application, this would involve payment processing
    # and verification with TikTok's existing payment infrastructure.
    subscriptions.append(subscription)
    return subscription

@app.get("/subscriptions/{user_id}", response_model=List[Subscription])
def get_user_subscriptions(user_id: str):
    return [sub for sub in subscriptions if sub.user_id == user_id]

@app.post("/kyc/verify/{creator_id}")
def kyc_verification(creator_id: str):
    # Placeholder for KYC verification process
    # In a real system, this would involve integrating with a third-party KYC provider
    return {"message": f"KYC verification initiated for creator {creator_id}"}

@app.get("/dashboard/{creator_id}")
def creator_dashboard(creator_id: str):
    # Placeholder for creator dashboard analytics
    # This would involve aggregating data on memberships, revenue, content performance, etc.
    return {"message": f"Dashboard data for creator {creator_id}",
            "total_members": len([sub for sub in subscriptions if sub.creator_id == creator_id]),
            "monthly_revenue": sum([tier.price for sub in subscriptions if sub.creator_id == creator_id for tier in membership_tiers if tier.id == sub.tier_id])}

@app.post("/payout/{creator_id}")
def creator_payout(creator_id: str):
    # Placeholder for ML-based revenue allocation and smoothed payout
    # In a real system, this would involve a complex ML model and a rolling average calculation.
    
    # KYC Gate: Creators must complete KYC before payout
    # For this prototype, we'll assume KYC is a separate process and just simulate a check.
    kyc_verified = True # This would come from a real KYC status check
    
    if not kyc_verified:
        raise HTTPException(status_code=403, detail="Creator must complete KYC verification before withdrawing funds.")

    # Mock performance score and smoothed payout
    performance_score = 0.75 # Placeholder value
    direct_membership_revenue = sum([tier.price for sub in subscriptions if sub.creator_id == creator_id for tier in membership_tiers if tier.id == sub.tier_id])
    
    # Simplified payout calculation (not a true ML model or smoothed payout)
    daily_earnings = direct_membership_revenue * performance_score
    smoothed_payout_amount = daily_earnings / 7 # Simulate a 7-day rolling average limit

    return {"message": f"Payout calculated for creator {creator_id}",
            "performance_score": performance_score,
            "direct_membership_revenue": direct_membership_revenue,
            "smoothed_payout_amount": round(smoothed_payout_amount, 2),
            "kyc_status": "verified" if kyc_verified else "pending"}
