/** API base including `/api` prefix (matches blog-api mounts for Vercel + local). */
function apiBase(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (raw != null && raw !== "") {
    return `${raw.replace(/\/$/, "")}/api`;
  }
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  }
  return "/api";
}

const base = apiBase();

export type User = { id: string; email: string };

export type Article = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: { _id: string; email: string } | null;
};

export type PaginatedArticles = {
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function authHeaders(token: string | null): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function register(email: string, password: string) {
  const res = await fetch(`${base}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data as { token: string; user: User };
}

export async function login(email: string, password: string) {
  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data as { token: string; user: User };
}

export async function fetchArticles(page: number, limit: number) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${base}/articles?${params}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data as PaginatedArticles;
}

export async function createArticle(
  token: string,
  body: { title: string; content: string; tags?: string[]; isPublished?: boolean }
) {
  const res = await fetch(`${base}/articles`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || JSON.stringify(data.errors) || res.statusText);
  return data as Article;
}

export async function updateArticle(
  token: string,
  id: string,
  body: Partial<{ title: string; content: string; tags: string[]; isPublished: boolean }>
) {
  const res = await fetch(`${base}/articles/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || JSON.stringify(data.errors) || res.statusText);
  return data as Article;
}

export async function deleteArticle(token: string, id: string) {
  const res = await fetch(`${base}/articles/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}
