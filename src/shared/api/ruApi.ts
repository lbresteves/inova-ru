import { apiConfig } from "./apiConfig";
import { createAxiosHttpClient } from "./createAxiosHttpClient";

export const ruApi = createAxiosHttpClient({
  baseURL: apiConfig.ruApiBaseUrl,
  defaultHeaders: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeoutMs: apiConfig.timeoutMs,
});
