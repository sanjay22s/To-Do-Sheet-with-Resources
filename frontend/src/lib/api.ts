import type {
  AuthResponse,
  RoadmapItem,
  RoadmapResponse,
  PlacementResource,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const TOKEN_KEY = "prepstack-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  roadmap: () => request<RoadmapResponse>("/api/roadmap"),
  updateItem: (id: number, body: Partial<RoadmapItem>) =>
    request<RoadmapItem>(`/api/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  createItem: (body: { categorySlug: string; title: string }) =>
    request<RoadmapItem>("/api/items", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteItem: (id: number) =>
    request<void>(`/api/items/${id}`, {
      method: "DELETE",
    }),
  createResource: (body: Omit<PlacementResource, "id">) =>
    request<PlacementResource>("/api/resources", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateResource: (id: number, body: Omit<PlacementResource, "id">) =>
    request<PlacementResource>(`/api/resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteResource: (id: number) =>
    request<void>(`/api/resources/${id}`, {
      method: "DELETE",
    }),
};
