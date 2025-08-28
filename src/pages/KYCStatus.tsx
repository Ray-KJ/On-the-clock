import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  FileText,
  Calendar,
  RefreshCw,
} from "lucide-react";

const CREATOR_ID = "creator1";

type KYCStatusType = "not_started" | "pending" | "verified" | "rejected";

interface KYCData {
  status: KYCStatusType;
  submitted_at?: string;
  verified_at?: string;
  rejection_reason?: string;
  documents?: string[];
}

const KYCStatus = () => {
  const [isTriggering, setIsTriggering] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kycData, isLoading } = useQuery({
    queryKey: ["kyc", CREATOR_ID],
    queryFn: async (): Promise<KYCData> => {
      // Replace with real API call: return api.getKYCStatus(CREATOR_ID);
      return { status: "not_started", documents: [] };
    },
    staleTime: 5 * 60 * 1000,
  });

  const kycMutation = useMutation({
    mutationFn: () => api.triggerKYC(CREATOR_ID),
    onSuccess: () => {
      toast({
        title: "KYC Verification Started",
        description:
          "Your verification request has been submitted. You'll receive updates via email.",
      });
      queryClient.invalidateQueries({ queryKey: ["kyc", CREATOR_ID] });
    },
    onError: (error: Error) => {
      toast({
        title: "KYC Verification Failed",
        description:
          error.message ||
          "Failed to start KYC verification. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTriggerKYC = async () => {
    setIsTriggering(true);
    try {
      await kycMutation.mutateAsync();
    } finally {
      setIsTriggering(false);
    }
  };

  const getStatusIcon = (status: KYCStatusType) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "rejected":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Shield className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: KYCStatusType) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getStatusDescription = (status: KYCStatusType) => {
    switch (status) {
      case "verified":
        return "Your identity has been verified. You can now access all platform features and receive payouts.";
      case "pending":
        return "Your verification is currently being reviewed. This usually takes 1-3 business days.";
      case "rejected":
        return "Your verification was not approved. Please review the feedback and resubmit.";
      default:
        return "Complete KYC verification to unlock platform features and enable payouts.";
    }
  };

  const getNextSteps = (status: KYCStatusType) => {
    switch (status) {
      case "verified":
        return [
          "You're all set! Access all platform features",
          "Receive payouts and analytics",
          "Build trust with your audience",
        ];
      case "pending":
        return [
          "Wait for verification review (1-3 business days)",
          "Check your email for updates",
          "Ensure all documents are clear and valid",
        ];
      case "rejected":
        return [
          "Review rejection feedback",
          "Update required documents",
          "Resubmit verification request",
        ];
      default:
        return [
          "Prepare government-issued ID",
          "Have business documents ready",
          "Ensure documents are clear and current",
        ];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="ml-64 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              KYC Verification
            </h1>
            <p className="text-muted-foreground">
              Verify your identity to unlock platform features
            </p>
          </div>
          <Card className="bg-gradient-card border-border shadow-card mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(kycData?.status || "not_started")}
                  <div>
                    <CardTitle className="text-foreground">
                      Verification Status
                    </CardTitle>
                    <CardDescription>
                      Current KYC verification status
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(kycData?.status || "not_started")}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                {getStatusDescription(kycData?.status || "not_started")}
              </p>
              {kycData?.status === "rejected" && kycData.rejection_reason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <h4 className="font-medium text-red-800 mb-2">
                    Rejection Reason:
                  </h4>
                  <p className="text-red-700">{kycData.rejection_reason}</p>
                </div>
              )}
              {kycData?.submitted_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Submitted:{" "}
                    {new Date(kycData.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {kycData?.verified_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    Verified:{" "}
                    {new Date(kycData.verified_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          {kycData?.status === "not_started" && (
            <Card className="bg-gradient-card border-border shadow-card mb-8">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Start Verification
                </CardTitle>
                <CardDescription>
                  Begin the KYC verification process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  KYC verification is required to ensure platform security and
                  enable payouts. The process typically takes 1-3 business days.
                </p>
                <Button
                  onClick={handleTriggerKYC}
                  disabled={isTriggering}
                  className="bg-gradient-primary text-white shadow-glow"
                >
                  {isTriggering ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Starting Verification...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Start KYC Verification
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          <Card className="bg-gradient-card border-border shadow-card mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Next Steps</CardTitle>
              <CardDescription>
                What happens next in your verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getNextSteps(kycData?.status || "not_started").map(
                  (step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-foreground">{step}</span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border shadow-card mb-8">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Documents needed for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">
                    Government-Issued ID
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Valid passport, driver's license, or national ID card
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">
                    Proof of Address
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Recent utility bill, bank statement, or lease agreement
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">
                    Business Information
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Business registration, tax documents, or professional
                    licenses
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Privacy & Security
                </h4>
                <p className="text-sm text-blue-700">
                  All documents are encrypted and stored securely. We only use
                  this information for identity verification and compliance
                  purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default KYCStatus;
