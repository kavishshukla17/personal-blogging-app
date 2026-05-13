import { useState, useEffect } from "react";
import { api, type PaginatedResponse } from "../services/api";
import { ArticleCard } from "../components/ArticleCard";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tagDraft, setTagDraft] = useState("");
  const [dateDraft, setDateDraft] = useState("");
  const [appliedTags, setAppliedTags] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getArticles({
          page,
          limit: 10,
          tags: appliedTags || undefined,
          publishedAt: appliedDate || undefined,
        });
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load articles");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, appliedTags, appliedDate]);

  const handleApply = () => {
    setAppliedTags(tagDraft);
    setAppliedDate(dateDraft);
    setPage(1);
  };

  const clearFilters = () => {
    setTagDraft("");
    setDateDraft("");
    setAppliedTags("");
    setAppliedDate("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl text-transparent dark:from-blue-400 dark:to-purple-400">
          All Articles
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Discover stories, thinking, and expertise from writers
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-blue-900/20"
      >
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg text-gray-900 dark:text-gray-100">Filter Articles</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              placeholder="e.g., nodejs,api"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Published After</label>
            <input
              type="date"
              value={dateDraft}
              onChange={(e) => setDateDraft(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex items-end gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApply}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white transition-shadow hover:shadow-lg dark:from-blue-500 dark:to-purple-500"
            >
              Apply
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Clear
            </motion.button>
          </div>
        </div>
      </motion.div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {data.articles.length === 0 ? (
            <p className="py-12 text-center text-gray-500 dark:text-gray-400">No articles found</p>
          ) : (
            <div className="mb-8 space-y-6">
              {data.articles.map((article, index) => (
                <ArticleCard key={article._id} article={article} index={index} />
              ))}
            </div>
          )}

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <span className="text-gray-700 dark:text-gray-300">
                Page {data.currentPage} of {data.totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
