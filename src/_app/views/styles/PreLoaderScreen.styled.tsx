import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const Content = styled.View({
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 24,
});

export const CreditText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
  marginTop: 24,
}));

export const LoadingBlock = styled.View({
  alignItems: "center",
  gap: 12,
  marginTop: 18,
});

export const LoadingText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
}));
