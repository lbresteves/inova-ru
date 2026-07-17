import { useSessionStore } from "@features/Auth";
import { Redirect, Stack } from "expo-router";

export default function MainLayout() {
  const status = useSessionStore((state) => state.status);

  if (status !== "authenticated") {
    return <Redirect href="/auth/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
