/** API origin including `/api` (matches blog-api mounts). */
export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (raw != null && raw !== "") {
    return `${raw.replace(/\/$/, "")}/api`;
  }
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  }
  return "/api";
}
