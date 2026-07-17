import styled from "@emotion/native";
import { ThemedText, ThemedView } from "@shared/components";

export const Container = styled(ThemedView)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  paddingHorizontal: 20,
  paddingTop: 40,
  paddingBottom: 24,
  gap: 24,
}));

export const TopBar = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
});

export const TopBarActions = styled.View({
  flexDirection: "row",
  gap: 10,
});

export const GreetingRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 16,
});

export const GreetingText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  flex: 1,
}));

export const BalanceBlock = styled.View({
  gap: 4,
});

export const BalanceLabel = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontSize: 13,
  lineHeight: 18,
  opacity: 0.9,
}));

export const BalanceRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
});

export const BalanceValue = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontSize: 28,
  fontWeight: "700",
  lineHeight: 34,
}));

export const BalanceVisibilityButton = styled.TouchableOpacity({
  alignItems: "center",
  height: 36,
  justifyContent: "center",
  width: 36,
});
