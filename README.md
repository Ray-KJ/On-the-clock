# On-the-clock: Creator Revenue Management Platform

## 🎯 Project Overview

**On-the-clock** is a creator revenue management platform that helps content creators manage subscription tiers, one-time purchases, and analyze revenue through ML-powered quality scoring. The platform provides real-time analytics, payout smoothing, and content access control based on subscription levels.

## ✨ Features & Functionality

### 🎬 Content Management

- **Video Upload & Management**: Upload videos with tier-based access control
- **Content Library**: Organize and manage uploaded content
- **Access Control**: Set content visibility based on subscription tiers

### 💰 Revenue Optimization

- **Subscription Tiers**: Create and manage multiple subscription levels (Basic Fan, Super Fan, VIP Circle)
- **One-time Purchases**: Sell individual content items (videos, ebooks, merchandise)
- **ML Revenue Split**: Quality-based revenue distribution (50%-75%) using TikTok reward factors
- **Payout Smoothing**: Intelligent payout distribution with 6% uplift
- **Real-time Analytics**: Live revenue tracking and performance metrics

### 📊 Dashboard & Analytics

- **Creator Dashboard**: Overview of earnings, subscribers, and content
- **Consumer Dashboard**: User-friendly content discovery with tier-based access
- **Revenue Analytics**: Detailed breakdown of subscription and one-time purchase revenue
- **Video Gallery**: Complete content library with ML analysis and revenue insights
- **KYC Management**: Identity verification and compliance tracking

### 🔧 Management Tools

- **Tier Management**: Add, edit, and delete subscription tiers with live updates
- **Purchase Management**: Manage one-time purchase items and track sales
- **User Management**: Handle subscriptions and user access control
- **Content Control**: Manage video access and visibility settings

## 🛠️ Development Tools

### Frontend

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development environment
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React component library (Radix UI primitives)

### Backend

- **FastAPI**: Modern Python web framework
- **Python 3.9+**: Core backend language
- **Uvicorn**: ASGI server for FastAPI with hot reload

### Development Environment

- **Node.js 18+**: JavaScript runtime
- **npm**: Package manager
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing

## 🔌 APIs Used

### Internal APIs

- **Membership Service** (`/membership/*`):

  - `GET /tiers/{creator_id}` - List subscription tiers
  - `POST /tiers/` - Create new tier
  - `PUT /tiers/{tier_id}` - Update tier
  - `DELETE /tiers/{tier_id}` - Delete tier
  - `GET /one-time-purchases/{creator_id}` - List one-time purchases
  - `POST /one-time-purchases/` - Create one-time purchase
  - `GET /dashboard/{creator_id}` - Get revenue analytics
  - `GET /kyc/status/{creator_id}` - Get KYC status

- **Content Service** (`/content/*`):
  - `POST /` - Upload video content
  - `GET /creator/{creator_id}` - Get creator's content
  - `GET /ml-score/{content_id}` - Get ML analysis results

## 🎨 Assets Used

### Images

- **Hero Creator Image**: `src/assets/hero-creator.jpg`
- **Unsplash Photos**: Video thumbnail images
- **Custom Icons**: Lucide React icon library

### Design Elements

- **Color Scheme**: Dark theme with accent colors
- **Typography**: Modern, readable fonts via Tailwind
- **Layout Components**: Responsive grid systems
- **Interactive Elements**: Hover effects and animations

## 📚 Libraries & Dependencies

### Frontend Libraries

```json
{
  "@tanstack/react-query": "Data fetching and state management",
  "react-router-dom": "Client-side routing",
  "lucide-react": "Icon library",
  "recharts": "Chart components for revenue analytics",
  "react-hook-form": "Form handling and validation",
  "zod": "Schema validation",
  "clsx": "Conditional CSS classes",
  "tailwind-merge": "Tailwind CSS utilities merging"
}
```

### Backend Libraries

```python
{
  "fastapi": "Web framework",
  "uvicorn": "ASGI server",
  "python-multipart": "File upload handling"
}
```

### UI Components

- **Shadcn/ui**: Button, Card, Dialog, Form, Navigation components
- **Custom Components**: RevenueChart, VideoThumbnail, Navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🎯 Problem Statement

### Current Challenges in Creator Economy

Content creators face several critical challenges in monetizing their work:

1. **Revenue Volatility**: Inconsistent income streams create financial instability
2. **Complex Monetization**: Difficulty in managing multiple revenue sources (subscriptions + one-time sales)
3. **Quality Recognition**: Lack of systematic quality assessment for content
4. **Payout Management**: Poor cash flow management and planning
5. **Access Control**: Complex content gating and subscription management

### Our Solution

**On-the-clock** addresses these challenges through:

- **ML-Powered Quality Assessment**: Automated content scoring based on TikTok's reward factors (originality, watch time, engagement, search value)
- **Intelligent Revenue Splits**: Quality-based creator compensation (50%-75%)
- **Payout Smoothing**: AI-driven payout distribution with 6% interest incentives
- **Unified Management**: Single platform for subscription tiers and one-time purchases
- **Real-time Analytics**: Live performance tracking and revenue insights

### Target Impact

- **Reduce Revenue Volatility**: Through payout smoothing and tier diversification
- **Increase Creator Earnings**: Through quality-based ML revenue splits
- **Improve Cash Flow**: Better financial planning through smoothed payouts
- **Streamline Operations**: Centralized management of all revenue streams

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-team/on-the-clock.git
cd on-the-clock
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd backend
pip install fastapi uvicorn python-multipart
```

4. **Start the development servers**

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
python mainC.py
```

5. **Access the application**

- Frontend: http://localhost:8080
- Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs

## 📁 Project Structure

```
on-the-clock/
├── src/                    # Frontend source code
│   ├── components/        # React components (Navigation, RevenueChart, etc.)
│   ├── pages/            # Page components (Dashboard, Revenue, ManageTiers, etc.)
│   ├── hooks/            # Custom React hooks (use-tiers, use-mobile)
│   ├── lib/              # Utility functions and API client
│   └── assets/           # Static assets (hero-creator.jpg)
├── backend/               # Backend Python code
│   ├── mainC.py          # Main FastAPI application
│   ├── models.py          # Data models and ML functions
│   ├── membership_service.py  # Membership API endpoints
│   └── content_service.py     # Content API endpoints
├── public/                # Public assets (favicon, placeholder images)
└── supabase/              # Supabase configuration (placeholder)
```

Team Github: https://github.com/Ray-KJ/On-the-clock
