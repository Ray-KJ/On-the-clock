import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreatorDashboard from "./pages/CreatorDashboard";
import RevenuePage from "./pages/RevenuePage";
import ManageTiers from "./pages/ManageTiers";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import CreatorProfile from "./pages/CreatorProfile";
import LandingPage from "./pages/LandingPage";
import UploadVideo from "./pages/UploadVideo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<CreatorDashboard />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/tiers" element={<ManageTiers />} />
          <Route path="/consumer" element={<ConsumerDashboard />} />
          <Route path="/creator/:id" element={<CreatorProfile />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/kyc" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
