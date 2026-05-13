import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "next-themes";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}

export function Root() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50 transition-colors dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Outlet />
        <ThemedToaster />
      </div>
    </ThemeProvider>
  );
}
