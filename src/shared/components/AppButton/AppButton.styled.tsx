import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export type AppButtonVariant = "primary" | "outlined" | "text";

export const ButtonContainer = styled.Pressable<{
  buttonVariant: AppButtonVariant;
}>(({ theme, buttonVariant, disabled }) => ({
  alignItems: "center",
  backgroundColor:
    buttonVariant === "primary" ? theme.colors.primary : theme.colors.transparent,
  borderColor:
    buttonVariant === "outlined" ? theme.colors.primary : theme.colors.transparent,
  borderRadius: theme.layout.radius.lg,
  borderWidth: buttonVariant === "outlined" ? 1 : 0,
  flexDirection: "row",
  gap: theme.layout.spacing.sm,
  justifyContent: "center",
  minHeight: 48,
  opacity: disabled ? 0.45 : 1,
  paddingHorizontal: theme.layout.spacing.lg,
  paddingVertical: 12,
}));

export const ButtonText = styled(ThemedText)<{
  buttonVariant: AppButtonVariant;
}>(({ theme, buttonVariant }) => ({
  ...theme.typography.button,
  color:
    buttonVariant === "primary" ? theme.colors.onPrimary : theme.colors.primary,
  textAlign: "center",
}));
