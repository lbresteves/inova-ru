import styled from "@emotion/native";

export const HeaderContainer = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.surface,
  flexDirection: "row",
  gap: 10,
  paddingHorizontal: 20,
  paddingVertical: 12,
}));
