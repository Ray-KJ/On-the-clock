import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BarChart3, 
  Upload, 
  Settings, 
  Users, 
  Shield,
  Play
} from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/revenue", icon: BarChart3, label: "Revenue" },
    { path: "/tiers", icon: Users, label: "Manage Tiers" },
    { path: "/upload", icon: Upload, label: "Upload" },
    { path: "/kyc", icon: Shield, label: "KYC Status" },
    { path: "/consumer", icon: Play, label: "Consumer View" },
  ];

  return (
    <nav className="bg-card border-r border-border h-screen w-64 fixed left-0 top-0 z-40 p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Play className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          TikTok Creator
        </h1>
      </div>
      
      <div className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path}>
            <Button
              variant={isActive(path) ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 ${
                isActive(path) 
                  ? "bg-gradient-primary text-white shadow-glow" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Button>
          </Link>
        ))}
      </div>
      
      <div className="absolute bottom-6 left-6 right-6">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>
    </nav>
  );
};