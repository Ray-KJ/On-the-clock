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
  get: async (url: string, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetch(`${base}${url}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetch(`${base}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  put: async (url: string, data: any, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetch(`${base}${url}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (url: string, service: "membership" | "content" = "membership") => {
    const base = service === "membership" ? MEMBERSHIP_API_URL : CONTENT_API_URL;
    const res = await fetch(`${base}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  upload: async (url: string, formData: FormData) => {
    const res = await fetch(`${CONTENT_API_URL}${url}`, {
      method: "POST",
      headers: API_TOKEN ? { "Authorization": `Bearer ${API_TOKEN}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};