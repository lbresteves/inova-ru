import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const Filters = styled.View(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.layout.spacing.sm,
  marginBottom: theme.layout.spacing.md,
  marginTop: theme.layout.spacing.xl,
}));
export const FilterButton = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.border,
  borderRadius: theme.layout.radius.md,
  borderWidth: 1,
  justifyContent: "center",
  minHeight: 44,
  paddingHorizontal: theme.layout.spacing.md,
}));
export const FilterText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.textSecondary,
}));
export const List = styled.View(({ theme }) => ({ gap: theme.layout.spacing.sm }));
export const Card = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.borderSubtle,
  borderRadius: theme.layout.radius.lg,
  borderWidth: 1,
  flexDirection: "row",
  justifyContent: "space-between",
  minHeight: 64,
  padding: theme.layout.spacing.lg,
}));
export const Info = styled.View({ flex: 1, gap: 2 });
export const Restaurant = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.text,
  fontFamily: "Inter_700Bold",
  fontWeight: "700",
}));
export const DateText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
}));
export const Amount = styled(ThemedText)<{ free: boolean }>(({ theme, free }) => ({
  ...theme.typography.label,
  color: free ? theme.colors.success : theme.colors.text,
}));
export const EmptyState = styled.View(({ theme }) => ({
  alignItems: "center",
  gap: theme.layout.spacing.md,
  paddingVertical: theme.layout.spacing.xxl,
}));
export const StateText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.textMuted,
  textAlign: "center",
}));
