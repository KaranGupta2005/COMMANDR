import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug: log which API URL is being used (remove after confirming)
if (typeof window !== "undefined") {
  console.log("[COMMANDR] API URL:", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api (FALLBACK)");
}

// Response interceptor — auto refresh token on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

// Routes that should NOT trigger refresh or redirect
const AUTH_ROUTES = ["/auth/refresh", "/auth/login", "/auth/signup", "/auth/me"];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry auth routes — just reject silently
      const isAuthRoute = AUTH_ROUTES.some((route) =>
        originalRequest.url?.includes(route)
      );
      if (isAuthRoute) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/auth/refresh");
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Only redirect if we're NOT already on an auth page
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          if (!path.startsWith("/auth")) {
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
