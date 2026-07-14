import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export const HeaderContainer = styled.View(({ theme }) => ({
  alignItems: "center",
  flexDirection: "row",
  gap: theme.layout.spacing.sm,
  minHeight: 62,
  paddingHorizontal: theme.layout.spacing.xl,
  paddingVertical: theme.layout.spacing.sm,
}));

export const HeaderTitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.screenTitle,
  color: theme.colors.text,
  flex: 1,
}));
