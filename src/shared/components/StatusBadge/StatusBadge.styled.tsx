import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export const StatusBadgeContainer = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.onPrimaryMuted,
  borderRadius: theme.layout.radius.pill,
  justifyContent: "center",
  paddingHorizontal: 12,
  paddingVertical: 5,
}));

export const StatusBadgeText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textOnSoftSurface,
  fontFamily: "Inter_700Bold",
  fontWeight: "700",
}));
