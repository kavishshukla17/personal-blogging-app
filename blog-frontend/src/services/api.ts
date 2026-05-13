import { getApiBase } from "../lib/apiBase";

const base = getApiBase();

export interface Article {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: { _id: string; email: string } | null;
}

export interface PaginatedResponse {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  totalArticles: number;
}

export interface CreateArticleData {
  title: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || JSON.stringify(body.errors) || res.statusText;
  } catch {
    return res.statusText;
  }
}

export const api = {
  async register(email: string, password: string) {
    const response = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json() as Promise<{ token: string; user: { id: string; email: string } }>;
  },

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: { id: string; email: string } }> {
    const response = await fetch(`${base}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  async getArticles(params?: {
    tags?: string;
    publishedAt?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse> {
    const queryParams = new URLSearchParams();
    if (params?.tags) queryParams.append("tags", params.tags);
    if (params?.publishedAt) queryParams.append("publishedAt", params.publishedAt);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(`${base}/articles?${queryParams}`);
    if (!response.ok) throw new Error(await parseError(response));
    const json = (await response.json()) as {
      data: Article[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    };
    return {
      articles: json.data,
      currentPage: json.pagination.page,
      totalPages: json.pagination.totalPages,
      totalArticles: json.pagination.total,
    };
  },

  async getArticle(id: string): Promise<Article> {
    const response = await fetch(`${base}/articles/${id}`);
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  async createArticle(data: CreateArticleData, token: string): Promise<Article> {
    const response = await fetch(`${base}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  async updateArticle(id: string, data: Partial<CreateArticleData>, token: string): Promise<Article> {
    const response = await fetch(`${base}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  async deleteArticle(id: string, token: string): Promise<void> {
    const response = await fetch(`${base}/articles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await parseError(response));
  },
};
