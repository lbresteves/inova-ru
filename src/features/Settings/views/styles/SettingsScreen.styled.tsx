import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const SettingsContent = styled.View(({ theme }) => ({
  gap: theme.layout.spacing.xl,
  paddingTop: theme.layout.spacing.xl,
}));
export const ScreenHeading = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.screenTitle,
  color: theme.colors.primary,
}));
export const SettingBlock = styled.View<{ disabled?: boolean }>(({ theme, disabled }) => ({
  gap: theme.layout.spacing.md,
  opacity: disabled ? 0.6 : 1,
}));
export const SettingRow = styled.View(({ theme }) => ({
  alignItems: "center",
  flexDirection: "row",
  gap: theme.layout.spacing.md,
}));
export const SettingLabel = styled(ThemedText)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  ...theme.typography.bodySmall,
  color: disabled ? theme.colors.disabledContent : theme.colors.primary,
  flex: 1,
  fontFamily: "Poppins_600SemiBold",
  fontWeight: "600",
}));
export const Thresholds = styled.View(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.layout.spacing.sm,
}));
export const Subsection = styled.View<{ disabled?: boolean }>(({ theme, disabled }) => ({
  gap: theme.layout.spacing.sm,
  opacity: disabled ? 0.55 : 1,
  paddingLeft: 52,
}));
export const Weekdays = styled.View(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.layout.spacing.sm,
}));
export const DayButton = styled.Pressable<{ selected: boolean }>(
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
    height: 38,
    justifyContent: "center",
    width: 38,
  }),
);
export const DayText = styled(ThemedText)<{
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
export const TimeButton = styled.Pressable(({ theme, disabled }) => ({
  alignItems: "center",
  alignSelf: "flex-start",
  backgroundColor: disabled ? theme.colors.disabledSurface : theme.colors.surface,
  borderColor: disabled ? theme.colors.borderSubtle : theme.colors.border,
  borderRadius: theme.layout.radius.md,
  borderWidth: 1,
  justifyContent: "center",
  minHeight: 38,
  paddingHorizontal: theme.layout.spacing.lg,
}));
export const TimeText = styled(ThemedText)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  ...theme.typography.label,
  color: disabled ? theme.colors.disabledContent : theme.colors.textSecondary,
}));
export const HelperText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
}));
