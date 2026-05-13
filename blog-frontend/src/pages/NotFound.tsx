import { Link } from "react-router";
import { FileQuestion } from "lucide-react";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FileQuestion className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
        <h1 className="mb-4 text-4xl text-gray-900 dark:text-gray-100">404 - Page Not Found</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">The page you&apos;re looking for doesn&apos;t exist.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white transition-shadow hover:shadow-lg dark:from-blue-500 dark:to-purple-500"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
