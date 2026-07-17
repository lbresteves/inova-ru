import { useSessionBootstrap } from "@features/Auth";
import { ThemeProvider as EmotionProvider } from "@emotion/react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { darkColorSchema, lightColorSchema, theme } from "@shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useInitializeApp } from "../hooks/useInitializeApp";
import RouterSlot from "./RouterSlot";

export default function App() {
  const { colorScheme, loaded } = useInitializeApp();
  const sessionStatus = useSessionBootstrap();
  const [queryClient] = useState(() => new QueryClient());

  if (!loaded || sessionStatus === "initializing") {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <QueryClientProvider client={queryClient}>
        <EmotionProvider
          theme={{
            ...theme,
            colors: colorScheme === "dark" ? darkColorSchema : lightColorSchema,
          }}
        >
          <SafeAreaProvider>
            <RouterSlot />
            <StatusBar style="inverted" />
          </SafeAreaProvider>
        </EmotionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
