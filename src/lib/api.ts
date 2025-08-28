// Dummy API helpers for development

const MEMBERSHIP_API_URL = import.meta.env.VITE_MEMBERSHIP_API_URL || "http://localhost:8001";
const CONTENT_API_URL = import.meta.env.VITE_CONTENT_API_URL || "http://localhost:8000";
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
  getTiers: async (creatorId: string): Promise<Tier[]> => {
    const res = await fetchWithRetry(`${MEMBERSHIP_API_URL}/tiers/${creatorId}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },
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
  get: async (url: string, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetchWithRetry(`${base}${url}`, { headers: getHeaders() });
    return res.json();
  },
  post: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetchWithRetry(`${base}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  put: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetchWithRetry(`${base}${url}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (url: string, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetchWithRetry(`${base}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
  postJson: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetchWithRetry(`${base}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  upload: async (url: string, formData: FormData) => {
    const res = await fetchWithRetry(`${CONTENT_API_URL}${url}`, {
      method: "POST",
      headers: API_TOKEN ? { "Authorization": `Bearer ${API_TOKEN}` } : {},
      body: formData,
    });
    return res.json();
  },
};