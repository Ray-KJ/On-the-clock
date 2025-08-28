// Dummy API helpers for development

export type Tier = {
  id: string;
  name: string;
  price: number;
};

export const api = {
  getTiers: async (creatorId: string): Promise<Tier[]> => {
    // Replace with real API call
    return [
      { id: "tier1", name: "Bronze", price: 5 },
      { id: "tier2", name: "Silver", price: 10 },
      { id: "tier3", name: "Gold", price: 20 },
    ];
  },
  getCreatorContent: async (creatorId: string): Promise<any[]> => {
    // Replace with real API call
    return [];
  },
  uploadContent: async (formData: FormData): Promise<void> => {
    // Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};