import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const Section = styled.View(({ theme }) => ({ gap: theme.layout.spacing.sm }));
export const SectionLabel = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.textSecondary,
}));
export const ChipsRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.layout.spacing.sm,
}));
export const Notice = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.primarySoft,
  borderRadius: theme.layout.radius.lg,
  padding: theme.layout.spacing.lg,
}));
export const NoticeText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textOnSoftSurface,
}));
export const ServerErrorText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.danger,
}));
export const FormContent = styled.View(({ theme }) => ({
  gap: theme.layout.spacing.lg,
  paddingTop: theme.layout.spacing.xl,
}));
export const BottomButton = styled.View(({ theme }) => ({
  marginTop: theme.layout.spacing.xl,
}));
