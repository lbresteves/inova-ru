import { AppLogo, ThemedView } from "@shared/components";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "@emotion/react";
import {
  Content,
  CreditText,
  LoadingBlock,
  LoadingText,
} from "./styles/PreLoaderScreen.styled";

export default function PreLoaderScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => router.replace("/auth/login"), 650);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Content>
        <AppLogo size={52} />
        <CreditText>Créditos do RU · UFMG</CreditText>
        <LoadingBlock>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <LoadingText>carregando...</LoadingText>
        </LoadingBlock>
      </Content>
    </ThemedView>
  );
}
