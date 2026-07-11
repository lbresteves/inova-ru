import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const Container = styled.ScrollView(({ theme }) => ({
  backgroundColor: theme.colors.surface,
}));

export const Content = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.transparent,
  gap: 12,
  paddingHorizontal: 16,
  paddingTop: 40,
}));

export const PrimaryAction = styled.TouchableOpacity(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.primary,
  borderRadius: 12,
  justifyContent: "center",
  minHeight: 50,
  paddingHorizontal: 16,
}));

export const PrimaryActionContent = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 8,
});

export const PrimaryActionText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontSize: 15,
  fontWeight: "700",
  lineHeight: 20,
}));

export const HistoryActions = styled.View({
  gap: 10,
});

export const HistoryAction = styled.TouchableOpacity(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.border,
  borderRadius: 12,
  borderWidth: 1,
  elevation: 2,
  flexDirection: "row",
  gap: 12,
  minHeight: 66,
  paddingHorizontal: 16,
  paddingVertical: 10,
  shadowColor: theme.colors.shadow,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 8,
}));

export const ActionIconBox = styled.View(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.primaryMuted,
  borderRadius: 10,
  height: 42,
  justifyContent: "center",
  width: 42,
}));

export const ActionTexts = styled.View({
  flex: 1,
});

export const HistoryTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 15,
  fontWeight: "700",
  lineHeight: 20,
}));

export const HistoryDescription = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 12,
  lineHeight: 16,
}));
