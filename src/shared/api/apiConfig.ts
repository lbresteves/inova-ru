import { Platform } from "react-native";

function resolveDefaultApiUrl() {
  return Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";
}

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const apiConfig = {
  baseURL: (configuredUrl || resolveDefaultApiUrl()).replace(/\/$/, ""),
  timeout: 10_000,
};
