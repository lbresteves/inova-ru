import { AppButton, Screen, ThemedText } from "@shared/components";
import { useRouter } from "expo-router";
import styled from "@emotion/native";

const Content = styled.View(({ theme }) => ({
  alignItems: "center",
  flex: 1,
  gap: theme.layout.spacing.lg,
  justifyContent: "center",
  padding: theme.layout.spacing.xl,
}));
const Title = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.sectionTitle,
  color: theme.colors.text,
  textAlign: "center",
}));
const Description = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.body,
  color: theme.colors.textMuted,
  textAlign: "center",
}));

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <Screen>
      <Content>
        <Title>Página não encontrada</Title>
        <Description>O endereço informado não existe neste aplicativo.</Description>
        <AppButton label="Voltar ao início" onPress={() => router.replace("/main/home")} />
      </Content>
    </Screen>
  );
}
