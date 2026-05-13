import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export function Root() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50 transition-colors dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Outlet />
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}
