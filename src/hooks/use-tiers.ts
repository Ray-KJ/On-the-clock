import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type TierRecord = {
  id: string;
  name: string;
  price: number;
  benefits?: string[];
  subscriberCount?: number;
};

export function useTiers(creatorId: string) {
  const query = useQuery({
    queryKey: ["tiers", creatorId],
    queryFn: async () => {
      // 使用正確的 membership 服務端點
      const data = await api.get(`/tiers/${creatorId}`, "membership");
      return Array.isArray(data) ? (data as TierRecord[]) : (data?.tiers ?? []);
    },
    staleTime: 10_000,
  });

  const tiers = (Array.isArray(query.data) ? query.data : []) as TierRecord[];
  const totalSubscribers = tiers.reduce((sum, t) => sum + (t.subscriberCount ?? 0), 0);
  const grossMonthly = tiers.reduce((sum, t) => sum + (t.price ?? 0) * (t.subscriberCount ?? 0), 0);

  return {
    ...query,
    tiers,
    totalSubscribers,
    grossMonthly,
  };
}


