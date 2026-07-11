import styled from "@emotion/native";

import { ThemedText } from "../ThemedText/ThemedText";
import { ThemedView } from "../ThemedView/ThemedView";

export const StatusBadgeContainer = styled(ThemedView)(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.onPrimaryMuted,
  borderRadius: 999,
  justifyContent: "center",
  paddingHorizontal: 12,
  paddingVertical: 5,
}));

export const StatusBadgeText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontSize: 12,
  fontWeight: "600",
  lineHeight: 16,
}));
