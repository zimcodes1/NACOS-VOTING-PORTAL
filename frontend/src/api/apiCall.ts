import axios from "axios";

// Helper to normalize VITE_API_BASE_URL to include http:// and /api path
const getNormalizedBaseUrl = (): string => {
  let envUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").trim();

  // Add http:// protocol if missing
  if (!/^https?:\/\//i.test(envUrl)) {
    envUrl = `http://${envUrl}`;
  }

  // Ensure /api path is included
  try {
    const urlObj = new URL(envUrl);
    if (!urlObj.pathname.includes("/api")) {
      urlObj.pathname = (urlObj.pathname.replace(/\/$/, "") + "/api/").replace(/\/\//g, "/");
    } else if (!urlObj.pathname.endsWith("/")) {
      urlObj.pathname = urlObj.pathname + "/";
    }
    return urlObj.toString();
  } catch {
    return "http://localhost:8000/api/";
  }
};

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: getNormalizedBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Response interceptor for clean handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("API Call Warning:", error.message || error);
    return Promise.reject(error);
  }
);

// Generic API call helper function
export default async function apiCall<T = any>(config: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}): Promise<T> {
  // Strip leading slash so relative URL appends correctly to baseURL subpath /api/
  const relativeUrl = config.url.replace(/^\//, "");

  const response = await apiClient.request<T>({
    url: relativeUrl,
    method: config.method || "GET",
    data: config.data,
    params: config.params,
    headers: config.headers,
  });
  return response.data;
}