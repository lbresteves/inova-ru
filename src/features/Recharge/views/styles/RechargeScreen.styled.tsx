import styled from "@emotion/native";

import { ThemedText } from "@shared/components";

export const Screen = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  flex: 1,
}));

export const Scroll = styled.ScrollView(({ theme }) => ({
  backgroundColor: theme.colors.surface,
}));

export const Content = styled.View({
  gap: 22,
  paddingBottom: 32,
  paddingHorizontal: 20,
  paddingTop: 72,
});

export const Section = styled.View({ gap: 10 });

export const SectionLabel = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 13,
  fontWeight: "600",
  lineHeight: 18,
}));

export const ChipsRow = styled.View({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
});

export const HintText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 12,
  lineHeight: 16,
}));

export const ErrorText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.danger,
  fontSize: 12,
  lineHeight: 16,
}));

export const Notice = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.primaryMuted,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 14,
}));

export const NoticeText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 12,
  lineHeight: 18,
}));

export const BalanceText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 12,
  lineHeight: 16,
}));

export const ButtonArea = styled.View({ marginTop: 26 });
