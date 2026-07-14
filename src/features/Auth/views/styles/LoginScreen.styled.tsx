import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const KeyboardContent = styled.KeyboardAvoidingView({ flex: 1 });
export const LoginScroll = styled.ScrollView({ flex: 1 });
export const LoginContent = styled.View(({ theme }) => ({
  alignSelf: "center",
  flexGrow: 1,
  maxWidth: 520,
  paddingBottom: theme.layout.spacing.xl,
  paddingHorizontal: 24,
  paddingTop: 42,
  width: "100%",
}));
export const BrandBlock = styled.View({ alignItems: "center" });
export const ScreenTitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.screenTitle,
  color: theme.colors.text,
  marginTop: 12,
  textAlign: "center",
}));
export const Subtitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
  marginTop: 2,
  textAlign: "center",
}));
export const Form = styled.View(({ theme }) => ({
  gap: theme.layout.spacing.md,
  marginTop: 76,
}));
export const Spacer = styled.View({ flex: 1, minHeight: 80 });
export const BottomActions = styled.View(({ theme }) => ({ gap: theme.layout.spacing.sm }));
export const HelpButton = styled.Pressable({ alignItems: "center", minHeight: 44, justifyContent: "center" });
export const HelpText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.primary,
}));

export const ServerErrorText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.danger,
}));
