import styled from "@emotion/native";

import { ThemedText } from "../ThemedText/ThemedText";

export type AppButtonVariant = "primary" | "outlined";

export const ButtonContainer = styled.Pressable<{
  buttonVariant: AppButtonVariant;
}>(({ theme, buttonVariant, disabled }) => ({
  alignItems: "center",
  backgroundColor:
    buttonVariant === "primary"
      ? theme.colors.primary
      : theme.colors.transparent,
  borderColor: theme.colors.primary,
  borderRadius: 12,
  borderWidth: buttonVariant === "outlined" ? 1 : 0,
  justifyContent: "center",
  minHeight: 50,
  opacity: disabled ? 0.5 : 1,
  paddingHorizontal: 18,
  paddingVertical: 12,
}));

export const ButtonText = styled(ThemedText)<{
  buttonVariant: AppButtonVariant;
}>(({ theme, buttonVariant }) => ({
  color:
    buttonVariant === "primary"
      ? theme.colors.onPrimary
      : theme.colors.primary,
  fontSize: 15,
  fontWeight: "700",
  lineHeight: 20,
  textAlign: "center",
}));
