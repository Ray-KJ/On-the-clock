# On-the-clock
Design the value sharing mechanism of creator economy

# Tiered Creator Economy (TCE) Prototype

This repository contains a prototype implementation of the Tiered Creator Economy (TCE) monetization framework, as outlined in the Product Requirements Document. The system is designed to provide TikTok creators with a sustainable, subscription-style revenue system.

## Project Structure

The prototype consists of two independent FastAPI services:

1.  **`membership-service`**: Handles creator membership tiers, user subscriptions, KYC verification (placeholder), and creator dashboards (placeholder).
2.  **`content-service`**: Manages content uploads, content gating based on membership tiers, and integrates with the `membership-service` to verify user subscriptions.

## Setup and Running the Prototype

To run the prototype, you need to set up and start both the `membership-service` and `content-service`.

### Prerequisites

*   Python 3.8+
*   `pip` (Python package installer)

### 1. Membership Service

Navigate to the `membership-service` directory:

```bash
cd membership-service
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Run the `membership-service` using Uvicorn on port 8001:

```bash
uvicorn app.main:app --port 8001
```

### 2. Content Service

Open a new terminal or command prompt.

Navigate to the `content-service` directory:

```bash
cd content-service
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Run the `content-service` using Uvicorn on port 8000:

```bash
uvicorn app.main:app --port 8000
```

## API Endpoints and Example Usage

Once both services are running, you can interact with their APIs. You can use tools like Postman, Insomnia, or `curl`.

### Membership Service (http://localhost:8001)

#### 1. Create a Membership Tier

**Endpoint**: `POST /tiers/`

**Note**: There's a limit of 3 tiers per creator, and the price must be one of `$2.99`, `$5.99`, or `$9.99`.

**Body**:
```json
{
  "creator_id": "creator123",
  "name": "Bronze Tier",
  "price": 2.99,
  "perks": ["Exclusive Videos", "Early Access"]
}
```

**Example `curl` command**:
```bash
curl -X POST http://localhost:8001/tiers/ \
     -H "Content-Type: application/json" \
     -d '{"creator_id": "creator123", "name": "Bronze Tier", "price": 2.99, "perks": ["Exclusive Videos", "Early Access"]}'
```

#### 2. Get Creator's Membership Tiers

**Endpoint**: `GET /tiers/{creator_id}`

**Example `curl` command**:
```bash
curl -X GET http://localhost:8001/tiers/creator123
```

#### 3. Update a Membership Tier

**Endpoint**: `PUT /tiers/{tier_id}`

**Note**: The price must be one of `$2.99`, `$5.99`, or `$9.99`.

**Body**:
```json
{
  "id": "<the-tier-id>",
  "creator_id": "creator123",
  "name": "Silver Tier",
  "price": 5.99,
  "perks": ["Exclusive Videos", "Early Access", "Members-Only Q&A"]
}
```

**Example `curl` command**:
```bash
curl -X PUT http://localhost:8001/tiers/<the-tier-id> \
     -H "Content-Type: application/json" \
     -d '{"id": "<the-tier-id>", "creator_id": "creator123", "name": "Silver Tier", "price": 5.99, "perks": ["Exclusive Videos", "Early Access", "Members-Only Q&A"]}'
```

#### 4. Subscribe to a Tier

**Endpoint**: `POST /subscribe/`

**Body**:
```json
{
  "user_id": "user456",
  "creator_id": "creator123",
  "tier_id": "<the-tier-id>"
}
```

**Example `curl` command**:
```bash
curl -X POST http://localhost:8001/subscribe/ \
     -H "Content-Type: application/json" \
     -d '{"user_id": "user456", "creator_id": "creator123", "tier_id": "<the-tier-id>"}'
```

#### 5. Get User Subscriptions

**Endpoint**: `GET /subscriptions/{user_id}`

**Example `curl` command**:
```bash
curl -X GET http://localhost:8001/subscriptions/user456
```

#### 6. KYC Verification (Placeholder)

**Endpoint**: `POST /kyc/verify/{creator_id}`

**Example `curl` command**:
```bash
curl -X POST http://localhost:8001/kyc/verify/creator123
```

#### 7. Creator Dashboard

**Endpoint**: `GET /dashboard/{creator_id}`

**Description**: This endpoint now provides simplified analytics, including the total number of members and monthly revenue for the specified creator.

**Example `curl` command**:
```bash
curl -X GET http://localhost:8001/dashboard/creator123
```

#### 8. Creator Payout (Placeholder)

**Endpoint**: `POST /payout/{creator_id}`

**Description**: This is a placeholder endpoint simulating the ML-based revenue allocation and smoothed payout mechanism. It includes a mock KYC verification check.

**Example `curl` command**:
```bash
curl -X POST http://localhost:8001/payout/creator123
```

### Content Service (http://localhost:8000)

#### 1. Upload Content

**Endpoint**: `POST /content/`

**Body**:
```json
{
  "creator_id": "creator123",
  "title": "My Exclusive Video",
  "description": "A video for my loyal members.",
  "video_url": "http://example.com/video1.mp4",
  "visibility": "members_only",
  "allowed_tier_ids": ["<the-tier-id>"]
}
```

**Example `curl` command**:
```bash
curl -X POST http://localhost:8000/content/ \
     -H "Content-Type: application/json" \
     -d '{"creator_id": "creator123", "title": "My Exclusive Video", "description": "A video for my loyal members.", "video_url": "http://example.com/video1.mp4", "visibility": "members_only", "allowed_tier_ids": ["<the-tier-id>"]}'
```

#### 2. Get Content

**Endpoint**: `GET /content/{content_id}?user_id={user_id}`

**Example `curl` command (as a subscribed user)**:
```bash
curl -X GET "http://localhost:8000/content/<the-content-id>?user_id=user456"
```

**Example `curl` command (as an unsubscribed user)**:
```bash
curl -X GET "http://localhost:8000/content/<the-content-id>"
```

#### 3. Get Creator's Content

**Endpoint**: `GET /content/creator/{creator_id}`

**Example `curl` command**:
```bash
curl -X GET http://localhost:8000/content/creator/creator123
```
