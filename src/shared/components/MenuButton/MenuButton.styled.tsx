import styled from "@emotion/native";

export const CircularIconButton = styled.TouchableOpacity(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.onPrimaryMuted,
  borderRadius: 999,
  height: 44,
  justifyContent: "center",
  width: 44,
}));
