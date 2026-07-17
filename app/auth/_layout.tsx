import { useSessionStore } from "@features/Auth";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const status = useSessionStore((state) => state.status);

  if (status === "authenticated") {
    return <Redirect href="/main/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
