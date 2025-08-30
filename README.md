# Tierflow: Creator Revenue Management Platform

## 🎯 Project Overview

**Tierflow** is a creator revenue management platform and our submission for the sixth problem statement, "Value-Sharing Reimagined". The platform and its underlying value=sharing mechanism directly addresses the challenges of a transparent, fair, and legitimate flow of value from consumers to creators, tackling critical issues of money laundering risk, creator income volatility, and sub-optimal monetization in the digital economy. The platform allows content creators to create multiple subscription tiers, manage subscription tiers, one-time purchases, and analyze revenue through performance-driven scoring. The platform provides real-time analytics, payout smoothing, and content access control based on subscription levels. 

Instead of relying on a gifting-based system, Tierflow enables creators to create tiered memberships, exclusive content, or access to special events and interactions. Our platform then periodically distributes rewards to creators based on a performance-driven model that considers metrics such as engagement, subscriber retention, and attributable income of creators' content. To further mitigate financial instability for creators and money-laundering risk for the platform, our platform offers an option to smooth cash payouts over time, subsidized by platforms, providing a more stable and predictable revenue stream and reducing the incentive for criminals to use the platform as a quick-and-easy money laundering channel.

This model provides significant benefits: it reduces money laundering risks by tying payments to specific, verified benefits and promotes more robust KYC/AML procedures. It also decreases revenue volatility for creators, encouraging them to create high-quality content and reducing churn risk. For consumers, it deepens the creator-fan relationship by providing more tangible value and exclusive experiences.

## 🎯 Problem Statement

### Challenges in Current Value Sharing Mechanism and Creator Economy

Designing a fair and effective reward mechanism is complex. Issues such as unfairness, regulatory imcompliance, and fraud often lead to misaligned incentives, under-compensated creators, and reduced ecosystem engagement. Below are several critical challenges for creators and platforms:


1. **Money-laundering risks**: Under the current gifting mechanism, transactions are often small, numerous, and spontaneous, making it difficult to detect suspicious patterns and an easy way to disguise a payment for an illicit service
2. **Unfair Value-Sharing Mechanisms**: A uniform split ratio between creators and platforms, regardless of content quality, creates unfairness
3. **Value Transfer Pathways**: Consumers' gifting is not tied to specific, publicly defined benefits, making it susceptible to illicit financial activities
4. **Quality Recognition**: There is a lack of systematic, performance-driven quality assessment for content, leading to potential undercompensated creators
5. **Monetization and revenue instability**: No alternative ways (other than the gifting system) to monetize limits creator monetization potential. This could lead to creator churn. Gifting by nature is more volatile and leads to creator revenue instability.

### Our Solution

**Tierflow** addresses these challenges through:

- **AML (Anti-Money Laundering) & Anti-Fraud Prevention**: We ensure a secure and compliant ecosystem by requiring robust KYC for recurring payments and tying transactions to specific, verifiable benefits. Smoothed return over a period of time also makes the platform a less viable tool for money laundering
- **Profit-Sharing Mechanisms**: Our performance-driven model intelligently compensates creators based on content quality and engagement, ensuring fair rewards for top performers. (50%-75%) The platform's payout smoothing system also provides creators with a predictable and stable income, reducing financial instability
- **Value Transfer Pathways**: Consumers can contribute directly through Tiered Memberships and exclusive content purchases, creating a clear and auditable flow of value from the consumer to the creator.
- **Alternative ways to monetize**: A single platform for subscription tiers, one-time purchases, and access to special events and interactions. More monetization methods allow creator to deepen their relationship with consumers and reward from their fanbase. Platforms could thus retain top creators and their content within platforms, improving overall engagement
- **Analytics Dashboard**: The dashboard provides a transparent view of real-time analytics on earnings and subscriber growth, allowing creators to understand their performance and the value they are generating

### Target Impact

- **Reduce Money Laundering Risk**: Through KYC for recurring payments and tying transactions to specific, verifiable benefits.  it becomes significantly harder to use the platform for illicit financial activities. The smoothed return over time further reduces the platform's viability for large, rapid money transfers
- **Fair Value-Sharing Mechanism Rewards Top Creators and Contents**: Our Profit-Sharing Mechanisms and Payout Smoothing directly tackle creator income volatility and undercompensated top creators. Instead of relying on unpredictable gifts, creators receive rewards based on a performance-driven model and can opt to smooth their income over time, providing a stable and predictable revenue stream. This encourages long-term commitment and high-quality content production
- **Optimizing Monetization**: The Alternative ways to monetize feature expands beyond a single gifting model. Creators can build their income through diverse methods like tiered memberships and exclusive content sales, deepening their relationship with their fanbase. This not only increases revenue potential for creators but also helps the platform retain top talent and their content, improving overall engagement.
- **Streamline Operations**: Centralized management of all revenue streams

## ✨ Features & Functionality

### 🎬 Content Management

- **Video Upload & Management**: Upload videos with tier-based access control
- **Content Library**: Organize and manage uploaded content
- **Access Control**: Set content visibility based on subscription tiers

### 💰 Revenue Optimization

- **Subscription Tiers**: Create and manage multiple subscription levels (Basic Fan, Super Fan, VIP Circle)
- **One-time Purchases**: Sell individual content items (videos, ebooks, merchandise)
- **ML Revenue Split**: Quality-based revenue distribution (50%-75%) using TikTok reward factors
- **Payout Smoothing**: Intelligent payout distribution with 6% uplift subsidized by platforms
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

- **Unsplash Photos**: Video thumbnail images
- **Custom Icons**: Lucide React icon library


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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Ray-KJ/on-the-clock.git
cd on-the-clock
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
pip install -r requirements.txt
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
│   ├── membership_service.py  # Membership API endpoints
│   └── content_service.py     # Content API endpoints
├── public/                # Public assets (favicon, placeholder images)
└── supabase/              # Supabase configuration (placeholder)
```

Team Github: https://github.com/Ray-KJ/On-the-clock
