import styled from "@emotion/native";

export const IconButtonContainer = styled.TouchableOpacity(({ theme }) => ({
  alignItems: "center",
  justifyContent: "center",

  borderRadius: 24,
  backgroundColor: "transparent",
  padding: 8,
  borderColor: theme.colors.border,
  borderWidth: 1,
}));
