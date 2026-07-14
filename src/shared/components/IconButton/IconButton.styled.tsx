import styled from "@emotion/native";

export type IconButtonVariant = "plain" | "soft" | "outlined" | "onPrimary";

export const IconButtonContainer = styled.Pressable<{
  variant: IconButtonVariant;
  size: number;
}>(({ theme, variant, size, disabled }) => ({
  alignItems: "center",
  backgroundColor:
    variant === "soft"
      ? theme.colors.primarySoft
      : variant === "onPrimary"
        ? theme.colors.onPrimaryOverlay
        : theme.colors.transparent,
  borderColor:
    variant === "outlined" ? theme.colors.border : theme.colors.transparent,
  borderRadius: theme.layout.radius.md,
  borderWidth: variant === "outlined" ? 1 : 0,
  height: Math.max(size, 44),
  justifyContent: "center",
  opacity: disabled ? 0.45 : 1,
  width: Math.max(size, 44),
}));
