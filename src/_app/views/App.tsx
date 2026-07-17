import { ThemeProvider as EmotionProvider } from "@emotion/react";
import "@features/configurationScreen/tasks/balanceMonitorTask";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { configureNotificationHandler } from "@shared/notifications/configureNotificationHandler";
import { darkColorSchema, lightColorSchema, theme } from "@shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useInitializeApp } from "../hooks/useInitializeApp";
import RouterSlot from "./RouterSlot";

export default function App() {
  const { colorScheme, loaded } = useInitializeApp();

  useEffect(() => {
    void configureNotificationHandler();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <QueryClientProvider client={new QueryClient()}>
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
