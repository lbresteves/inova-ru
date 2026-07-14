import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export const Chip = styled.Pressable<{ selected: boolean }>(
  ({ theme, selected, disabled }) => ({
    alignItems: "center",
    backgroundColor: disabled
      ? theme.colors.disabledSurface
      : selected
        ? theme.colors.primary
        : theme.colors.surface,
    borderColor: disabled
      ? theme.colors.borderSubtle
      : selected
        ? theme.colors.primary
        : theme.colors.border,
    borderRadius: theme.layout.radius.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 38,
    opacity: disabled ? 0.55 : 1,
    paddingHorizontal: theme.layout.spacing.lg,
  }),
);

export const ChipText = styled(ThemedText)<{
  selected: boolean;
  disabled: boolean;
}>(({ theme, selected, disabled }) => ({
  ...theme.typography.label,
  color: disabled
    ? theme.colors.disabledContent
    : selected
      ? theme.colors.onPrimary
      : theme.colors.textSecondary,
}));
