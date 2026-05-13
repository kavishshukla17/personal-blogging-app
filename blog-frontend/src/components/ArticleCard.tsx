import { Link } from "react-router";
import type { Article } from "../services/api";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const dateStr = article.publishedAt || article.createdAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group"
    >
      <Link
        to={`/articles/${article._id}`}
        className="relative block overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/20 dark:to-purple-900/20" />

        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <h2 className="pr-4 text-2xl text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
              {article.title}
            </h2>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 0 }}
              whileHover={{ x: 5, opacity: 1 }}
              className="shrink-0"
            >
              <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {dateStr && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(dateStr), "MMM dd, yyyy")}
              </div>
            )}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4" />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="line-clamp-3 text-gray-700 dark:text-gray-300">{article.content}</p>
        </div>
      </Link>
    </motion.div>
  );
}
