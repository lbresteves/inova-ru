import { create } from "axios";
import { useSessionStore } from "@shared/store";
import { apiConfig } from "./apiConfig";
import { normalizeAxiosError } from "./normalizeAxiosError";

export const axiosClient = create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = useSessionStore.getState().token;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const normalizedError = normalizeAxiosError(error);
    if (normalizedError.status === 401) {
      useSessionStore.getState().clearSession();
    }
    return Promise.reject(normalizedError);
  },
);
