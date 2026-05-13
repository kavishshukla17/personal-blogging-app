import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { api, type Article } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Calendar, Tag, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { toast } from "sonner";

function isOwner(userId: string | undefined, article: Article) {
  if (!userId || !article.author) return false;
  return String(article.author._id) === String(userId);
}

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const result = await api.getArticle(id);
        if (!cancelled) setArticle(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id || !token || !window.confirm("Are you sure you want to delete this article?")) return;

    setDeleting(true);
    try {
      await api.deleteArticle(id, token);
      toast.success("Article deleted successfully");
      void navigate("/");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete article";
      toast.error(errorMsg);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl justify-center px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error || "Article not found"}
        </div>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>
      </div>
    );
  }

  const showOwnerActions = Boolean(token) && isOwner(user?.id, article);
  const dateStr = article.publishedAt || article.createdAt;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to articles
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl text-transparent dark:from-blue-400 dark:to-purple-400">
          {article.title}
        </h1>

        {article.author?.email && (
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">By {article.author.email}</p>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
          {dateStr && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(dateStr), "MMMM dd, yyyy")}
            </div>
          )}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="prose mb-8 max-w-none">
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{article.content}</p>
        </div>

        {showOwnerActions && (
          <div className="flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/edit/${article._id}`}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-shadow hover:shadow-lg dark:from-blue-500 dark:to-purple-500"
              >
                <Edit className="h-4 w-4" />
                Edit Article
              </Link>
            </motion.div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete Article"}
            </motion.button>
          </div>
        )}
      </motion.article>
    </div>
  );
}
