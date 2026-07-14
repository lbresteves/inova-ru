import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const HeaderContent = styled.View<{ safeTop: number }>(({ theme, safeTop }) => ({
  gap: theme.layout.spacing.md,
  paddingBottom: 28,
  paddingHorizontal: theme.layout.spacing.xl,
  paddingTop: Math.max(safeTop, 12) + 8,
}));
export const TopBar = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
});
export const TopBarActions = styled.View({ alignItems: "center", flexDirection: "row", gap: 4 });
export const GreetingRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 2,
});
export const GreetingText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontFamily: "Poppins_600SemiBold",
  fontSize: 24,
  fontWeight: "600",
  lineHeight: 36,
}));
export const BalanceLabel = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.onPrimaryMuted,
  marginTop: 4,
}));
export const BalanceRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
});
export const BalanceValue = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimaryMuted,
  fontFamily: "Poppins_700Bold",
  fontSize: 30,
  fontWeight: "700",
  lineHeight: 45,
}));
export const VisibilityButton = styled.Pressable({
  alignItems: "center",
  height: 44,
  justifyContent: "center",
  width: 44,
});
