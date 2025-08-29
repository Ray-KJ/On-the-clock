import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import {
  Plus,
  Edit,
  Users,
  Crown,
  Star,
  Trash2,
  Save,
  X,
  ShoppingBag,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const creatorId = "creator1";

const tierIcons = {
  0: <Users className="w-5 h-5" />,
  1: <Star className="w-5 h-5" />,
  2: <Crown className="w-5 h-5" />,
};

const tierColors = {
  0: "bg-primary text-primary-foreground",
  1: "bg-secondary text-secondary-foreground",
  2: "bg-gradient-primary text-white",
};

const ManageTiers = () => {
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [showAddTier, setShowAddTier] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<string | null>(null);
  const [showAddPurchase, setShowAddPurchase] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: tiersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tiers", creatorId],
    queryFn: () => api.get(`/tiers/${creatorId}`, "membership"),
  });

  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    isError: purchasesError,
  } = useQuery({
    queryKey: ["one-time-purchases", creatorId],
    queryFn: () => api.getOneTimePurchases(creatorId),
  });

  // Ensure tiers is always an array
  const tiers = Array.isArray(tiersData) ? tiersData : tiersData?.tiers ?? [];
  const purchases = Array.isArray(purchasesData) ? purchasesData : [];

  const createTierMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      price: number;
      benefits?: string[];
    }) =>
      api.post(`/tiers/`, { creator_id: creatorId, ...payload }, "membership"),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tiers", creatorId] }),
  });

  const updateTierMutation = useMutation({
    mutationFn: (vars: {
      tierId: string;
      name?: string;
      price?: number;
      benefits?: string[];
    }) =>
      api.put(
        `/tiers/${vars.tierId}`,
        {
          name: vars.name,
          price: vars.price,
          benefits: vars.benefits,
        },
        "membership"
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiers", creatorId] });
      // Invalidate all related queries to ensure data consistency across all pages
      queryClient.invalidateQueries({ queryKey: ["dashboard", creatorId] });
      queryClient.invalidateQueries({
        queryKey: ["one-time-purchases", creatorId],
      });
      setEditingTier(null);
    },
  });

  const deleteTierMutation = useMutation({
    mutationFn: (tierId: string) =>
      api.delete(`/tiers/${tierId}`, "membership"),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tiers", creatorId] }),
  });

  // One-time purchase mutations
  const createPurchaseMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      price: number;
      description: string;
      type: string;
      creator_id: string;
    }) => api.createOneTimePurchase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["one-time-purchases", creatorId],
      });
    },
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: (vars: {
      purchaseId: string;
      name?: string;
      price?: number;
      description?: string;
      type?: string;
    }) =>
      api.updateOneTimePurchase(vars.purchaseId, {
        name: vars.name,
        price: vars.price,
        description: vars.description,
        type: vars.type,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["one-time-purchases", creatorId],
      });
    },
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: (purchaseId: string) => api.deleteOneTimePurchase(purchaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["one-time-purchases", creatorId],
      });
    },
  });

  if (isLoading || purchasesLoading) return <div>Loading...</div>;
  if (isError || purchasesError) return <div>Error loading data.</div>;
  if (!Array.isArray(tiers) || tiers.length === 0)
    return <div>No tiers found. Create one!</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Manage Tiers & One-time Purchases
              </h1>
              <p className="text-muted-foreground">
                Create and customize your subscription tiers and one-time
                purchase items
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddTier(true)}
                className="bg-gradient-primary text-white shadow-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tier
              </Button>
              <Button
                onClick={() => setShowAddPurchase(true)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add One-time Purchase
              </Button>
            </div>
          </div>

          {/* Tier Guidelines */}
          <Card className="mb-8 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Tier Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {tiers.slice(0, 3).map((tier, idx) => (
                  <div key={tier.id} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">
                      Tier {idx + 1}: {tier.name} (${tier.price})
                    </h4>
                    <p className="text-muted-foreground">
                      {(
                        tier.benefits ?? [
                          idx === 0
                            ? "Behind-the-scenes access"
                            : idx === 1
                            ? "Q&As, community access"
                            : "Premium experiences, 1-on-1 access",
                        ]
                      ).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Tiers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Subscription Tiers
            </h2>
            <div className="space-y-6">
              {tiers.map((tier, index) => (
                <Card
                  key={tier.id}
                  className="bg-gradient-card border-border shadow-card"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            tierColors[index as keyof typeof tierColors] ||
                            "bg-muted"
                          }`}
                        >
                          {tierIcons[index as keyof typeof tierIcons] || (
                            <Users className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-foreground">
                            {tier.name}
                          </CardTitle>
                          <CardDescription>${tier.price}/month</CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {tier.subscriberCount ?? 0} subscribers
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTier(tier.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => deleteTierMutation.mutate(tier.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingTier === tier.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tierName">Tier Name</Label>
                            <Input id="tierName" defaultValue={tier.name} />
                          </div>
                          <div>
                            <Label htmlFor="tierPrice">Price (USD)</Label>
                            <Input
                              id="tierPrice"
                              type="number"
                              defaultValue={tier.price}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="benefits">
                            Benefits (one per line)
                          </Label>
                          <Textarea
                            id="benefits"
                            defaultValue={tier.benefits?.join("\n") ?? ""}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-primary text-white"
                            onClick={() => {
                              const name = (
                                document.getElementById(
                                  "tierName"
                                ) as HTMLInputElement
                              ).value;
                              const price = Number(
                                (
                                  document.getElementById(
                                    "tierPrice"
                                  ) as HTMLInputElement
                                ).value
                              );
                              const benefits = (
                                document.getElementById(
                                  "benefits"
                                ) as HTMLTextAreaElement
                              ).value
                                .split("\n")
                                .filter(Boolean);
                              updateTierMutation.mutate({
                                tierId: tier.id,
                                name,
                                price,
                                benefits,
                              });
                            }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTier(null)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-foreground mb-3">
                          Benefits:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(tier.benefits ?? []).map((benefit, bIndex) => (
                            <div
                              key={bIndex}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* One-time Purchases */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              One-time Purchases
            </h2>
            <div className="space-y-6">
              {purchases.map((purchase) => (
                <Card
                  key={purchase.id}
                  className="bg-gradient-card border-border shadow-card"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground">
                            {purchase.name}
                          </CardTitle>
                          <CardDescription>
                            ${purchase.price} (one-time)
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {purchase.purchaseCount ?? 0} purchases
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {purchase.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPurchase(purchase.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            deletePurchaseMutation.mutate(purchase.id)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingPurchase === purchase.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="purchaseName">Item Name</Label>
                            <Input
                              id="purchaseName"
                              defaultValue={purchase.name}
                            />
                          </div>
                          <div>
                            <Label htmlFor="purchasePrice">Price (USD)</Label>
                            <Input
                              id="purchasePrice"
                              type="number"
                              defaultValue={purchase.price}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="purchaseType">Type</Label>
                            <select
                              id="purchaseType"
                              className="w-full p-2 border border-input rounded-md bg-background"
                              defaultValue={purchase.type}
                            >
                              <option value="video">Video</option>
                              <option value="ebook">E-book</option>
                              <option value="merchandise">Merchandise</option>
                              <option value="course">Course</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="purchaseDescription">
                              Description
                            </Label>
                            <Input
                              id="purchaseDescription"
                              defaultValue={purchase.description}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-primary text-white"
                            onClick={() => {
                              const name = (
                                document.getElementById(
                                  "purchaseName"
                                ) as HTMLInputElement
                              ).value;
                              const price = Number(
                                (
                                  document.getElementById(
                                    "purchasePrice"
                                  ) as HTMLInputElement
                                ).value
                              );
                              const type = (
                                document.getElementById(
                                  "purchaseType"
                                ) as HTMLSelectElement
                              ).value;
                              const description = (
                                document.getElementById(
                                  "purchaseDescription"
                                ) as HTMLInputElement
                              ).value;
                              updatePurchaseMutation.mutate({
                                purchaseId: purchase.id,
                                name,
                                price,
                                type,
                                description,
                              });
                              setEditingPurchase(null);
                            }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPurchase(null)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted-foreground mb-3">
                          {purchase.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-foreground font-medium">
                            Total Revenue: $
                            {(
                              (purchase.price || 0) *
                              (purchase.purchaseCount || 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add New Tier Modal */}
          {showAddTier && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Create New Tier
                  </CardTitle>
                  <CardDescription>
                    Add a new subscription tier for your fans
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newTierName">Tier Name</Label>
                    <Input id="newTierName" placeholder="e.g., Premium Fan" />
                  </div>
                  <div>
                    <Label htmlFor="newTierPrice">Price (USD)</Label>
                    <Input
                      id="newTierPrice"
                      type="number"
                      placeholder="19.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newTierBenefits">
                      Benefits (one per line)
                    </Label>
                    <Textarea
                      id="newTierBenefits"
                      placeholder="Exclusive videos&#10;Live chat access&#10;Monthly video calls"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-gradient-primary text-white"
                      onClick={() => {
                        const name = (
                          document.getElementById(
                            "newTierName"
                          ) as HTMLInputElement
                        ).value;
                        const price = Number(
                          (
                            document.getElementById(
                              "newTierPrice"
                            ) as HTMLInputElement
                          ).value
                        );
                        const benefits = (
                          document.getElementById(
                            "newTierBenefits"
                          ) as HTMLTextAreaElement
                        ).value
                          .split("\n")
                          .filter(Boolean);
                        createTierMutation.mutate({ name, price, benefits });
                        setShowAddTier(false);
                      }}
                    >
                      Create Tier
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddTier(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add New One-time Purchase Modal */}
          {showAddPurchase && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Create New One-time Purchase
                  </CardTitle>
                  <CardDescription>
                    Add a new one-time purchase item for your fans
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newPurchaseName">Item Name</Label>
                    <Input
                      id="newPurchaseName"
                      placeholder="e.g., Exclusive Video Tutorial"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPurchasePrice">Price (USD)</Label>
                    <Input
                      id="newPurchasePrice"
                      type="number"
                      placeholder="19.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPurchaseType">Type</Label>
                    <select
                      id="newPurchaseType"
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="video">Video</option>
                      <option value="ebook">E-book</option>
                      <option value="merchandise">Merchandise</option>
                      <option value="course">Course</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="newPurchaseDescription">Description</Label>
                    <Input
                      id="newPurchaseDescription"
                      placeholder="Brief description of the item"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-gradient-primary text-white"
                      onClick={() => {
                        const name = (
                          document.getElementById(
                            "newPurchaseName"
                          ) as HTMLInputElement
                        ).value;
                        const price = Number(
                          (
                            document.getElementById(
                              "newPurchasePrice"
                            ) as HTMLInputElement
                          ).value
                        );
                        const type = (
                          document.getElementById(
                            "newPurchaseType"
                          ) as HTMLSelectElement
                        ).value;
                        const description = (
                          document.getElementById(
                            "newPurchaseDescription"
                          ) as HTMLInputElement
                        ).value;
                        createPurchaseMutation.mutate({
                          name,
                          price,
                          type,
                          description,
                          creator_id: creatorId,
                        });
                        setShowAddPurchase(false);
                      }}
                    >
                      Create Item
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddPurchase(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Performance Analytics */}
          <Card className="mt-8 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Tier Performance Analytics
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Insights and recommendations for your tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier, index) => (
                  <div key={tier.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`p-2 rounded-full ${
                          tierColors[index as keyof typeof tierColors] ||
                          "bg-muted"
                        }`}
                      >
                        {tierIcons[index as keyof typeof tierIcons] || (
                          <Users className="w-5 h-5" />
                        )}
                      </div>
                      <h4 className="font-medium text-foreground">
                        {tier.name}
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Conversion Rate:
                        </span>
                        <span className="text-foreground font-medium">
                          {index === 0 ? "8.2%" : index === 1 ? "3.4%" : "1.2%"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Retention:
                        </span>
                        <span className="text-foreground font-medium">
                          {index === 0 ? "85%" : index === 1 ? "92%" : "96%"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Churn Risk:
                        </span>
                        <Badge
                          variant={
                            index === 0
                              ? "destructive"
                              : index === 1
                              ? "secondary"
                              : "default"
                          }
                        >
                          {index === 0
                            ? "High"
                            : index === 1
                            ? "Medium"
                            : "Low"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ManageTiers;
