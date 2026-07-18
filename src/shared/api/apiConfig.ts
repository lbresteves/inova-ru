import { Platform } from "react-native";

function resolveDefaultApiUrl(): string {
  return Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";
}

function resolveApiUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!configuredUrl) {
    if (!__DEV__) {
      throw new Error(
        "EXPO_PUBLIC_API_URL must be configured for production builds.",
      );
    }

    return resolveDefaultApiUrl();
  }

  const normalizedUrl = configuredUrl.replace(/\/$/, "");
  if (!__DEV__ && !normalizedUrl.toLowerCase().startsWith("https://")) {
    throw new Error("EXPO_PUBLIC_API_URL must use HTTPS in production.");
  }

  return normalizedUrl;
}

export const apiConfig = {
  ruApiBaseUrl: resolveApiUrl(),
  timeoutMs: 10_000,
} as const;
