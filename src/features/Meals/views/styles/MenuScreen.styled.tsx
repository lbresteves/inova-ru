import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const MenuContent = styled.View(({ theme }) => ({
  gap: theme.layout.spacing.xl,
  paddingTop: theme.layout.spacing.xl,
}));
export const Selectors = styled.View(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.layout.spacing.sm,
}));
export const Selector = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.border,
  borderRadius: theme.layout.radius.md,
  borderWidth: 1,
  justifyContent: "center",
  minHeight: 44,
  paddingHorizontal: theme.layout.spacing.lg,
}));
export const SelectorText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.textSecondary,
  fontFamily: "Inter_600SemiBold",
  fontWeight: "600",
}));
export const Category = styled.View(({ theme }) => ({ gap: theme.layout.spacing.sm }));
export const CategoryTitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.screenTitle,
  color: theme.colors.text,
  fontSize: 22,
  lineHeight: 32,
}));
export const Item = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.borderSubtle,
  borderRadius: theme.layout.radius.pill,
  borderWidth: 1,
  justifyContent: "center",
  minHeight: 38,
  paddingHorizontal: theme.layout.spacing.lg,
}));
export const ItemText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.primary,
  fontFamily: "Inter_600SemiBold",
  fontSize: 16,
  fontWeight: "600",
}));
