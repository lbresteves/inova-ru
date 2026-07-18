import { ThemeProvider as EmotionProvider } from "@emotion/react";
import { useSessionBootstrap } from "@features/Auth";
import "@features/configurationScreen/tasks/balanceMonitorTask";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { configureNotificationHandler } from "@shared/notifications/configureNotificationHandler";
import { darkColorSchema, lightColorSchema, theme } from "@shared/theme";
import { QueryClientProvider } from "@tanstack/react-query";
import { appQueryClient } from "../query";
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

  const sessionStatus = useSessionBootstrap();

  if (!loaded || sessionStatus === "initializing") {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <QueryClientProvider client={appQueryClient}>
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
