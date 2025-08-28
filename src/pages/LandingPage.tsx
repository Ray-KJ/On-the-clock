import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-creator.jpg";
import { 
  Crown,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Play,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Tiered Subscriptions",
      description: "Create up to 3 subscription tiers with customizable benefits and pricing"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "ML Revenue Optimization",
      description: "AI-powered payout smoothing reduces volatility while maximizing earnings"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Anti-Fraud Protection",
      description: "KYC/AML compliance and fraud detection protect your revenue stream"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Track subscriber growth, engagement, and revenue with detailed insights"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Smoothed Payouts", 
      description: "Predictable income with time-distributed high-value withdrawals"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Fair Revenue Split",
      description: "Transparent, creator-friendly revenue sharing with no hidden fees"
    }
  ];

  const stats = [
    { label: "Active Creators", value: "50K+", icon: <Users className="w-5 h-5" /> },
    { label: "Monthly Payouts", value: "$2.5M", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Avg Revenue Increase", value: "340%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Payout Reliability", value: "99.9%", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TikTok Creator Economy
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/consumer">Consumer View</Link>
              </Button>
              <Button variant="gradient" asChild>
                <Link to="/">Creator Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gradient-primary text-white">
                <Crown className="w-3 h-3 mr-1" />
                Revolutionary Creator Economy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Monetize Your 
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Content</span> 
                <br />Like Never Before
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your TikTok creativity into sustainable income with our tiered creator economy. 
                ML-optimized payouts, anti-fraud protection, and fair revenue sharing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" variant="hero" asChild>
                  <Link to="/">
                    Start Creating
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/consumer">
                    <Play className="w-5 h-5 mr-2" />
                    View Demo
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground mb-1">
                      <span className="text-primary">{stat.icon}</span>
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="TikTok Creator Studio" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Creator Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with creator-first design principles 
              to maximize your earning potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tier Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Tiers, Unlimited Potential
            </h2>
            <p className="text-xl text-muted-foreground">
              Structure your content with our proven tier system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic Fan",
                price: "$4.99",
                color: "bg-primary",
                features: ["Early access to videos", "Exclusive behind-the-scenes", "Fan badge", "Priority comments"]
              },
              {
                name: "Super Fan", 
                price: "$9.99",
                color: "bg-secondary",
                popular: true,
                features: ["All Basic benefits", "Monthly Q&A sessions", "Custom shoutouts", "Discord access", "Merchandise discounts"]
              },
              {
                name: "VIP Circle",
                price: "$24.99", 
                color: "bg-gradient-primary",
                features: ["All Super Fan benefits", "1-on-1 video calls", "Course content", "Collaboration opportunities", "Exclusive events"]
              }
            ].map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-primary shadow-glow' : ''} bg-gradient-card border-border`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${tier.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                    {index === 0 && <Users className="w-8 h-8" />}
                    {index === 1 && <Star className="w-8 h-8" />}
                    {index === 2 && <Crown className="w-8 h-8" />}
                  </div>
                  <CardTitle className="text-foreground">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-foreground">{tier.price}<span className="text-sm text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Creator Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators already earning sustainable income through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/consumer">
                Explore as Fan
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                TikTok Creator Economy
              </span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              Empowering creators with sustainable monetization since 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;