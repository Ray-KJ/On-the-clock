// API client with retry + timeouts for backend/mainC.py service

const MEMBERSHIP_API_URL = import.meta.env.VITE_MEMBERSHIP_API_URL || "http://localhost:8001";
const CONTENT_API_URL = import.meta.env.VITE_CONTENT_API_URL || "http://localhost:8001";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function getHeaders(isJson = true) {
  const headers: Record<string, string> = {};
  if (API_TOKEN) headers["Authorization"] = `Bearer ${API_TOKEN}`;
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
}

export type Tier = {
  id: string;
  name: string;
  price: number;
  benefits?: string[];
  subscriberCount?: number;
};

const RETRYABLE_STATUS = new Set([502, 503, 504]);
const RETRY_DELAYS_MS = [200, 500, 1000];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}, maxRetries = 3) {
  const timeoutMs = init.timeoutMs ?? 4000;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), timeoutMs);
    try {
      const res = await fetch(input, { ...init, signal: abort.signal });
      clearTimeout(timer);
      if (!res.ok) {
        // Retry on transient server errors
        if (RETRYABLE_STATUS.has(res.status) && attempt < maxRetries) {
          await sleep(RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)]);
          continue;
        }
        throw new Error(await res.text());
      }
      return res;
    } catch (err: any) {
      clearTimeout(timer);
      // Network-level errors (e.g., ECONNREFUSED during server reload)
      const isAbort = err?.name === "AbortError";
      const isNetwork = err instanceof TypeError || /Failed to fetch|NetworkError|ECONNREFUSED/i.test(String(err?.message ?? ""));
      if ((isAbort || isNetwork) && attempt < maxRetries) {
        await sleep(RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)]);
        continue;
      }
      throw err;
    }
  }
  // Should never reach here
  throw new Error("Request failed after retries");
}

export const api = {
  // Membership Service API calls (使用 /membership 前綴)
  getTiers: async (creatorId: string): Promise<Tier[]> => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/tiers/${creatorId}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  // Content Service API calls (使用 /content 前綴)
  getCreatorContent: async (creatorId: string): Promise<any[]> => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/content/creator/${creatorId}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  uploadContent: async (formData: FormData): Promise<void> => {
    await fetchWithRetry(`${MEMBERSHIP_API_URL}/content/`, {
      method: "POST",
      headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
      body: formData,
    });
  },

  // Generic API methods with proper service routing
  get: async (url: string, service: "membership" | "content" = "membership") => {
    const base = MEMBERSHIP_API_URL; // 兩個服務都運行在同一個端口
    // 根據服務類型添加正確的前綴
    const fullUrl = service === "membership" 
      ? `${base}/membership${url}` 
      : `${base}/content${url}`;
    const res = await fetchWithRetry(fullUrl, { headers: getHeaders() });
    return res.json();
  },

  post: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = MEMBERSHIP_API_URL; // 兩個服務都運行在同一個端口
    // 根據服務類型添加正確的前綴
    const fullUrl = service === "membership" 
      ? `${base}/membership${url}` 
      : `${base}/content${url}`;
    const res = await fetchWithRetry(fullUrl, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  put: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = MEMBERSHIP_API_URL; // 兩個服務都運行在同一個端口
    // 根據服務類型添加正確的前綴
    const fullUrl = service === "membership" 
      ? `${base}/membership${url}` 
      : `${base}/content${url}`;
    const res = await fetchWithRetry(fullUrl, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (url: string, service: "membership" | "content" = "membership") => {
    const base = MEMBERSHIP_API_URL; // 兩個服務都運行在同一個端口
    // 根據服務類型添加正確的前綴
    const fullUrl = service === "membership" 
      ? `${base}/membership${url}` 
      : `${base}/content${url}`;
    const res = await fetchWithRetry(fullUrl, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // Legacy methods for backward compatibility
  postJson: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = MEMBERSHIP_API_URL; // 兩個服務都運行在同一個端口
    // 根據服務類型添加正確的前綴
    const fullUrl = service === "membership" 
      ? `${base}/membership${url}` 
      : `${base}/content${url}`;
    const res = await fetchWithRetry(fullUrl, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  upload: async (url: string, formData: FormData) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/content${url}`, {
      method: "POST",
      headers: API_TOKEN ? { "Authorization": `Bearer ${API_TOKEN}` } : {},
      body: formData,
    });
    return res.json();
  },

  // Additional helper methods for membership service
  getKYCStatus: async (creatorId: string) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/kyc/status/${creatorId}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  triggerKYC: async (creatorId: string) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/kyc/verify/${creatorId}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  getDashboard: async (creatorId: string) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/dashboard/${creatorId}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  triggerPayout: async (creatorId: string) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/payout/${creatorId}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  // One-time purchase methods
  getOneTimePurchases: async (creatorId: string) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/one-time-purchases/${creatorId}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  createOneTimePurchase: async (purchase: any) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/one-time-purchases/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(purchase),
    });
    return res.json();
  },

  updateOneTimePurchase: async (purchaseId: string, purchase: any) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/one-time-purchases/${purchaseId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(purchase),
    });
    return res.json();
  },

  deleteOneTimePurchase: async (purchaseId: string) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/one-time-purchases/${purchaseId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  purchaseItem: async (purchaseId: string, userId: string) => {
    const formData = new FormData();
    formData.append("user_id", userId);
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/membership/one-time-purchases/${purchaseId}/purchase`, {
      method: "POST",
      headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
      body: formData,
    });
    return res.json();
  },

  // ML model methods
  getContentMLScore: async (contentId: string) => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/content/ml-score/${contentId}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },
};