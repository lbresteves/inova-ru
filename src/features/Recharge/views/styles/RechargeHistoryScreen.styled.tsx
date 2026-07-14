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
  minHeight: 44,
  paddingHorizontal: theme.layout.spacing.md,
  justifyContent: "center",
}));
export const FilterText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.textSecondary,
}));
export const HistoryList = styled.View(({ theme }) => ({ gap: theme.layout.spacing.sm }));
export const HistoryCard = styled.View(({ theme }) => ({
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
export const HistoryInfo = styled.View({ flex: 1, gap: 2 });
export const Amount = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.text,
  fontFamily: "Inter_700Bold",
  fontWeight: "700",
}));
export const DateText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
}));
export const Badge = styled.View<{ approved: boolean }>(({ theme, approved }) => ({
  backgroundColor: approved ? theme.colors.successSurface : theme.colors.warningSurface,
  borderRadius: theme.layout.radius.pill,
  paddingHorizontal: 11,
  paddingVertical: 5,
}));
export const BadgeText = styled(ThemedText)<{ approved: boolean }>(({ theme, approved }) => ({
  ...theme.typography.caption,
  color: approved ? theme.colors.success : theme.colors.warning,
  fontFamily: "Inter_600SemiBold",
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
