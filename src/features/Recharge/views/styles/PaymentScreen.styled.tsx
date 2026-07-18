import styled from "@emotion/native";

import { ThemedText } from "@shared/components";

export const Screen = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  flex: 1,
}));

export const Scroll = styled.ScrollView(({ theme }) => ({
  backgroundColor: theme.colors.surface,
}));

export const PaymentContent = styled.View({
  alignItems: "center",
  paddingBottom: 32,
  paddingHorizontal: 30,
  paddingTop: 70,
});

export const Instruction = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 13,
  fontWeight: "600",
  lineHeight: 18,
  textAlign: "center",
}));

export const QrCard = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderColor: theme.colors.border,
  borderRadius: 16,
  borderWidth: 1,
  height: 190,
  justifyContent: "center",
  marginTop: 36,
  overflow: "hidden",
  width: 190,
}));

export const QrUnavailable = styled.View({
  alignItems: "center",
  height: 180,
  justifyContent: "center",
  padding: 16,
  width: 180,
});

export const AmountText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 24,
  fontWeight: "700",
  lineHeight: 30,
  marginTop: 14,
}));

export const CodeBox = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.primary,
  borderRadius: 20,
  borderWidth: 2,
  flexDirection: "row",
  marginTop: 16,
  minHeight: 40,
  paddingLeft: 8,
  paddingRight: 4,
  width: "100%",
}));

export const CodeText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  flex: 1,
  fontSize: 13,
  lineHeight: 18,
}));

export const CopyButton = styled.TouchableOpacity({
  alignItems: "center",
  backgroundColor: "transparent",
  borderWidth: 0,
  justifyContent: "center",
  padding: 8,
});

export const CopyFeedback = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 12,
  lineHeight: 16,
  marginTop: 6,
}));


export const TicketButton = styled.TouchableOpacity(({ theme }) => ({
  alignItems: "center",
  borderColor: theme.colors.border,
  borderRadius: 12,
  borderWidth: 1,
  marginTop: 10,
  paddingHorizontal: 14,
  paddingVertical: 10,
}));

export const TicketButtonText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 12,
  fontWeight: "600",
  lineHeight: 16,
}));

export const WaitingCard = styled.View(({ theme }) => ({
  alignItems: "center",
  alignSelf: "center",
  backgroundColor: theme.colors.primaryMuted,
  borderRadius: 14,
  flexDirection: "row",
  gap: 10,
  marginTop: 96,
  minHeight: 58,
  paddingHorizontal: 14,
  width: "88%",
}));

export const WaitingTexts = styled.View({ flex: 1 });

export const WaitingTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 13,
  fontWeight: "700",
  lineHeight: 18,
}));

export const WaitingDescription = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 11,
  lineHeight: 15,
}));

export const Expiration = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 13,
  fontWeight: "600",
  lineHeight: 18,
  marginTop: 12,
}));

export const Hint = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 11,
  lineHeight: 15,
  marginTop: 6,
  textAlign: "center",
}));

export const PollingError = styled.View({
  gap: 10,
  marginTop: 18,
  width: "100%",
});

export const PollingErrorText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.danger,
  fontSize: 12,
  lineHeight: 16,
  textAlign: "center",
}));

export const ResultContent = styled.View({
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
  paddingBottom: 54,
  paddingHorizontal: 20,
});

export const ResultIcon = styled.View({
  alignItems: "center",
  height: 126,
  justifyContent: "center",
  width: 126,
});

export const ResultTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 20,
  fontWeight: "700",
  lineHeight: 26,
  marginTop: 24,
  textAlign: "center",
}));

export const ResultDescription = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 14,
  lineHeight: 20,
  marginTop: 8,
  maxWidth: 310,
  textAlign: "center",
}));

export const BalanceCard = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.primaryMuted,
  borderRadius: 12,
  marginTop: 24,
  paddingHorizontal: 16,
  paddingVertical: 14,
  width: "100%",
}));

export const BalanceLabel = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 11,
  fontWeight: "600",
  lineHeight: 15,
}));

export const BalanceValue = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 24,
  fontWeight: "700",
  lineHeight: 30,
}));

export const ResultActions = styled.View({
  gap: 18,
  marginTop: 26,
  width: "100%",
});
