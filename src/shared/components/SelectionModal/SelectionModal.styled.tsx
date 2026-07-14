import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export const Backdrop = styled.Pressable(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.scrim,
  flex: 1,
  justifyContent: "center",
  padding: theme.layout.spacing.xl,
}));
export const ModalCard = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.layout.radius.xl,
  gap: theme.layout.spacing.sm,
  maxWidth: 420,
  padding: theme.layout.spacing.xl,
  width: "100%",
}));
export const ModalTitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.screenTitle,
  color: theme.colors.text,
  marginBottom: theme.layout.spacing.sm,
}));
export const OptionButton = styled.Pressable<{ selected: boolean }>(({ theme, selected }) => ({
  alignItems: "center",
  backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
  borderColor: selected ? theme.colors.primary : theme.colors.borderSubtle,
  borderRadius: theme.layout.radius.md,
  borderWidth: 1,
  flexDirection: "row",
  justifyContent: "space-between",
  minHeight: 46,
  paddingHorizontal: theme.layout.spacing.lg,
}));
export const OptionText = styled(ThemedText)<{ selected: boolean }>(({ theme, selected }) => ({
  ...theme.typography.bodySmall,
  color: selected ? theme.colors.textOnSoftSurface : theme.colors.text,
  fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
}));
export const CloseButton = styled.Pressable(({ theme }) => ({
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  marginTop: theme.layout.spacing.sm,
}));
