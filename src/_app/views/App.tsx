import { ThemeProvider as EmotionProvider } from "@emotion/react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { darkColorSchema, lightColorSchema, theme } from "@shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useInitializeApp } from "../hooks/useInitializeApp";

export default function App() {
  const { colorScheme, loaded } = useInitializeApp();
  const [queryClient] = useState(() => new QueryClient());

  if (!loaded) {
    return null;
  }

  const colors = colorScheme === "dark" ? darkColorSchema : lightColorSchema;
  const navigationTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider
      value={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: colors.background,
          border: colors.border,
          card: colors.surface,
          primary: colors.primary,
          text: colors.text,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <EmotionProvider theme={{ ...theme, colors }}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </SafeAreaProvider>
        </EmotionProvider>
      </QueryClientProvider>
    </NavigationThemeProvider>
  );
}
