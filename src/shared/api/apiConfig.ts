import { Platform } from "react-native";

function resolveDefaultApiUrl(): string {
  return Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";
}

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const apiConfig = {
  ruApiBaseUrl: (configuredUrl || resolveDefaultApiUrl()).replace(/\/$/, ""),
  timeoutMs: 10_000,
} as const;
