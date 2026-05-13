import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PenSquare, LogOut, LogIn, UserPlus, Home, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ThemeToggle } from "../components/ThemeToggle";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <nav className="border-b border-gray-200/80 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm backdrop-blur-sm transition-colors dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                Blog Platform
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Home className="h-4 w-4" />
              Articles
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/create"
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-shadow hover:shadow-lg dark:from-blue-500 dark:to-purple-500"
                  >
                    <PenSquare className="h-4 w-4" />
                    New Article
                  </Link>
                </motion.div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-shadow hover:shadow-lg dark:from-blue-500 dark:to-purple-500"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
