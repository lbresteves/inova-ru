import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export const FieldContainer = styled.View(({ theme }) => ({ gap: theme.layout.spacing.xs }));
export const FieldLabel = styled(ThemedText)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  ...theme.typography.label,
  color: disabled ? theme.colors.disabledContent : theme.colors.textSecondary,
}));
export const InputShell = styled.View<{
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
}>(({ theme, focused, invalid, disabled }) => ({
  alignItems: "center",
  backgroundColor: disabled ? theme.colors.disabledSurface : theme.colors.surfaceMuted,
  borderColor: invalid
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border,
  borderRadius: theme.layout.radius.lg,
  borderWidth: 1,
  flexDirection: "row",
  minHeight: 48,
  opacity: disabled ? 0.6 : 1,
  paddingHorizontal: theme.layout.spacing.lg,
}));
export const PrefixText = styled(ThemedText)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  ...theme.typography.screenTitle,
  color: disabled ? theme.colors.disabledContent : theme.colors.textSecondary,
  marginRight: theme.layout.spacing.sm,
}));
export const Input = styled.TextInput(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.text,
  flex: 1,
  minHeight: 46,
  paddingVertical: 0,
}));
export const HelpText = styled(ThemedText)<{ invalid?: boolean }>(({ theme, invalid }) => ({
  ...theme.typography.caption,
  color: invalid ? theme.colors.danger : theme.colors.textMuted,
}));
