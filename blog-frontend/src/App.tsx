import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  createArticle,
  deleteArticle,
  fetchArticles,
  login,
  register,
  updateArticle,
  type Article,
  type PaginatedArticles,
  type User,
} from "./api";

const TOKEN_KEY = "blog_token";
const USER_KEY = "blog_user";

function isOwner(user: User | null, article: Article): boolean {
  if (!user || !article.author) return false;
  return String(article.author._id) === String(user.id);
}

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [list, setList] = useState<PaginatedArticles | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formPublished, setFormPublished] = useState(false);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const [editing, setEditing] = useState<Article | null>(null);

  const persistAuth = (t: string, u: User) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const loadArticles = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const data = await fetchArticles(page, limit);
      setList(data);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load articles");
      setList(null);
    } finally {
      setListLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    try {
      if (authTab === "register") {
        const { token: t, user: u } = await register(email, password);
        persistAuth(t, u);
        setFormMsg("Account created. You are logged in.");
      } else {
        const { token: t, user: u } = await login(email, password);
        persistAuth(t, u);
        setFormMsg("Logged in.");
      }
      setPassword("");
    } catch (err) {
      setFormMsg(err instanceof Error ? err.message : "Auth failed");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFormMsg(null);
    try {
      const tags = formTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await createArticle(token, {
        title: formTitle,
        content: formContent,
        tags,
        isPublished: formPublished,
      });
      setFormTitle("");
      setFormContent("");
      setFormTags("");
      setFormPublished(false);
      setFormMsg("Article created.");
      setPage(1);
      void loadArticles();
    } catch (err) {
      setFormMsg(err instanceof Error ? err.message : "Create failed");
    }
  };

  const startEdit = (a: Article) => {
    setEditing(a);
    setFormMsg(null);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editing) return;
    setFormMsg(null);
    try {
      await updateArticle(token, editing._id, {
        title: editing.title,
        content: editing.content,
        tags: editing.tags,
        isPublished: editing.isPublished,
      });
      setEditing(null);
      setFormMsg("Article updated.");
      void loadArticles();
    } catch (err) {
      setFormMsg(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Delete this article?")) return;
    setFormMsg(null);
    try {
      await deleteArticle(token, id);
      setFormMsg("Article deleted.");
      void loadArticles();
    } catch (err) {
      setFormMsg(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="app">
      <div className="header-bar">
        <div>
          <h1>Personal blog</h1>
          <p className="sub">Read articles with pagination. Sign in to create, edit, or delete your own posts.</p>
        </div>
        {user ? (
          <div className="header-user">
            <span className="user-pill">{user.email}</span>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </div>
        ) : null}
      </div>

      {!user ? (
        <div className="panel">
          <h2>Account</h2>
          <div className="tabs">
            <button type="button" className={authTab === "login" ? "active" : ""} onClick={() => setAuthTab("login")}>
              Log in
            </button>
            <button
              type="button"
              className={authTab === "register" ? "active" : ""}
              onClick={() => setAuthTab("register")}
            >
              Register
            </button>
          </div>
          <form onSubmit={handleAuth}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password (min 6 characters)</label>
              <input
                id="password"
                type="password"
                autoComplete={authTab === "register" ? "new-password" : "current-password"}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {authTab === "register" ? "Create account" : "Log in"}
            </button>
          </form>
        </div>
      ) : (
        <div className="panel">
          <h2>New article</h2>
          <form onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" value={formTitle} onChange={(ev) => setFormTitle(ev.target.value)} required maxLength={100} />
            </div>
            <div className="field">
              <label htmlFor="content">Content</label>
              <textarea id="content" value={formContent} onChange={(ev) => setFormContent(ev.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                id="tags"
                value={formTags}
                onChange={(ev) => setFormTags(ev.target.value)}
                placeholder="nodejs, api"
              />
            </div>
            <label className="checkbox">
              <input type="checkbox" checked={formPublished} onChange={(ev) => setFormPublished(ev.target.checked)} />
              Published
            </label>
            <button type="submit" className="btn btn-primary">
              Publish article
            </button>
          </form>
        </div>
      )}

      {formMsg ? (
        <div
          className={`msg ${/fail|invalid|error|not authorized|required/i.test(formMsg) ? "msg-error" : "msg-success"}`}
        >
          {formMsg}
        </div>
      ) : null}

      <div className="panel">
        <h2>Articles</h2>
        {listLoading ? <p className="loading">Loading…</p> : null}
        {listError ? <div className="msg msg-error">{listError}</div> : null}
        {!listLoading && list?.data.length === 0 ? <p className="loading">No articles yet.</p> : null}
        {list?.data.map((a) => (
          <article key={a._id} className="article-card">
            <h3>{a.title}</h3>
            <div className="meta">
              {a.author?.email ? <span>By {a.author.email}</span> : <span>Unknown author</span>}
              {" · "}
              <span>{new Date(a.createdAt).toLocaleString()}</span>
              {a.isPublished ? <span> · Published</span> : <span> · Draft</span>}
            </div>
            {a.tags?.length ? (
              <div className="tags">
                {a.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            <p className="content-preview">{a.content}</p>
            {user && isOwner(user, a) ? (
              <div className="actions">
                <button type="button" className="btn btn-ghost" onClick={() => startEdit(a)}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={() => void handleDelete(a._id)}>
                  Delete
                </button>
              </div>
            ) : null}
          </article>
        ))}
        {list && list.pagination.totalPages > 0 ? (
          <div className="pager">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span>
              Page {list.pagination.page} of {list.pagination.totalPages} ({list.pagination.total} total)
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page >= list.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <div className="panel edit-panel">
          <h2>Edit article</h2>
          <form onSubmit={handleUpdate}>
            <div className="field">
              <label htmlFor="et">Title</label>
              <input
                id="et"
                value={editing.title}
                onChange={(ev) => setEditing({ ...editing, title: ev.target.value })}
                required
                maxLength={100}
              />
            </div>
            <div className="field">
              <label htmlFor="ec">Content</label>
              <textarea
                id="ec"
                value={editing.content}
                onChange={(ev) => setEditing({ ...editing, content: ev.target.value })}
                required
              />
            </div>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={editing.isPublished}
                onChange={(ev) => setEditing({ ...editing, isPublished: ev.target.checked })}
              />
              Published
            </label>
            <div className="actions">
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
              <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
