import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export const Root = styled.View(({ theme }) => ({
  alignSelf: "center",
  flex: 1,
  gap: theme.layout.spacing.md,
  justifyContent: "center",
  maxWidth: 420,
  padding: theme.layout.spacing.xl,
  width: "100%",
}));
export const Title = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.screenTitle,
  color: theme.colors.text,
  textAlign: "center",
}));
export const Message = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.textMuted,
  textAlign: "center",
}));
