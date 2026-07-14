import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const ActionCard = styled.Pressable(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.borderSubtle,
  borderRadius: theme.layout.radius.lg,
  borderWidth: 1,
  elevation: 2,
  flexDirection: "row",
  gap: theme.layout.spacing.md,
  minHeight: 70,
  paddingHorizontal: theme.layout.spacing.lg,
  paddingVertical: theme.layout.spacing.md,
  shadowColor: theme.colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
}));
export const ActionIcon = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.primarySoft,
  borderRadius: theme.layout.radius.md,
  height: 44,
  justifyContent: "center",
  width: 44,
}));
export const ActionTextBlock = styled.View({ flex: 1 });
export const ActionTitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.text,
  fontFamily: "Inter_700Bold",
  fontSize: 14,
  fontWeight: "700",
}));
export const ActionDescription = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
}));
