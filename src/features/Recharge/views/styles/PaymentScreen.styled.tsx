import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const PaymentContent = styled.View(({ theme }) => ({
  alignItems: "center",
  gap: theme.layout.spacing.lg,
  paddingTop: theme.layout.spacing.xl,
}));
export const PaymentDescription = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.body,
  color: theme.colors.textMuted,
  textAlign: "center",
}));
export const AmountText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.displayAmount,
  color: theme.colors.text,
}));
export const WaitingBadge = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.warningSurface,
  borderColor: theme.colors.warningBorder,
  borderRadius: theme.layout.radius.pill,
  borderWidth: 1,
  paddingHorizontal: 14,
  paddingVertical: 7,
}));
export const WaitingText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.warning,
}));
export const QrCard = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.borderSubtle,
  borderRadius: theme.layout.radius.xl,
  borderWidth: 1,
  elevation: 2,
  padding: theme.layout.spacing.xl,
  shadowColor: theme.colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  width: "100%",
}));
export const QrImage = styled.Image({ height: 210, width: 210 });
export const QrUnavailable = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.surfaceMuted,
  height: 210,
  justifyContent: "center",
  width: 210,
}));
export const PixInstruction = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.textSecondary,
  marginTop: theme.layout.spacing.md,
  textAlign: "center",
}));
export const CodeBox = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.surfaceMuted,
  borderColor: theme.colors.border,
  borderRadius: theme.layout.radius.md,
  borderWidth: 1,
  flexDirection: "row",
  marginTop: theme.layout.spacing.md,
  paddingLeft: theme.layout.spacing.md,
  width: "100%",
}));
export const CodeText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.monospace,
  color: theme.colors.textSecondary,
  flex: 1,
}));
export const CopyFeedback = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.success,
  marginTop: theme.layout.spacing.sm,
}));
export const PaymentError = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.dangerSurface,
  borderColor: theme.colors.dangerBorder,
  borderRadius: theme.layout.radius.lg,
  borderWidth: 1,
  gap: theme.layout.spacing.md,
  padding: theme.layout.spacing.lg,
  width: "100%",
}));
export const PaymentErrorText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.danger,
}));
export const FooterInfo = styled.View({ alignItems: "center", gap: 4 });
export const Expiration = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.warning,
}));
export const Hint = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textMuted,
  textAlign: "center",
}));
export const ResultContent = styled.View(({ theme }) => ({
  alignItems: "center",
  alignSelf: "center",
  flex: 1,
  justifyContent: "center",
  maxWidth: theme.layout.contentMaxWidth,
  padding: theme.layout.spacing.xl,
  width: "100%",
}));
export const ResultIcon = styled.View<{ failure: boolean }>(({ theme, failure }) => ({
  alignItems: "center",
  backgroundColor: failure ? theme.colors.warningSurface : theme.colors.successSurface,
  borderColor: failure ? theme.colors.warningBorder : theme.colors.successBorder,
  borderRadius: 125,
  borderWidth: 2,
  height: 126,
  justifyContent: "center",
  width: 126,
}));
export const ResultTitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.sectionTitle,
  color: theme.colors.text,
  marginTop: theme.layout.spacing.xl,
  textAlign: "center",
}));
export const ResultDescription = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.body,
  color: theme.colors.textMuted,
  marginTop: theme.layout.spacing.sm,
  textAlign: "center",
}));
export const BalanceCard = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.successSurface,
  borderRadius: theme.layout.radius.lg,
  marginTop: theme.layout.spacing.xl,
  padding: theme.layout.spacing.lg,
  width: "100%",
}));
export const BalanceLabel = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.colors.success,
}));
export const BalanceValue = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.displayAmount,
  color: theme.colors.textOnStatusSurface,
}));
export const ResultActions = styled.View(({ theme }) => ({
  gap: theme.layout.spacing.md,
  marginTop: theme.layout.spacing.xl,
  width: "100%",
}));
