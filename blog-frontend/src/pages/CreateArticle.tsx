import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { PenSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function CreateArticle() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          You must be logged in to create an article.
        </div>
        <Link
          to="/login"
          className="mt-4 inline-block text-blue-600 transition-colors hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setLoading(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const articleData = {
        title,
        content,
        tags: tagsArray,
        isPublished,
        ...(publishedAt && { publishedAt: new Date(publishedAt).toISOString() }),
      };

      const article = await api.createArticle(articleData, token);
      toast.success("Article created successfully!");
      void navigate(`/articles/${article._id}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create article";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to articles
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-2">
          <PenSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl text-gray-900 dark:text-gray-100">Create New Article</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="tags" className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., nodejs, api, tutorial"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPublished"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700 dark:text-gray-300">
              Publish immediately
            </label>
          </div>

          {isPublished && (
            <div>
              <label htmlFor="publishedAt" className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                Publish Date (optional)
              </label>
              <input
                id="publishedAt"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Creating..." : "Create Article"}
            </button>
            <Link
              to="/"
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
