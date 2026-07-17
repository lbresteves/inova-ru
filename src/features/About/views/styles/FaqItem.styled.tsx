import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const ItemContainer = styled.View({
  marginBottom: 12,
});

export const QuestionButton = styled.TouchableOpacity(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.primary,
  borderRadius: 24,
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  paddingVertical: 14,
}));

export const QuestionText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  flex: 1,
  fontSize: 16,
  fontWeight: "bold",
  marginRight: 16,
}));

export const AnswerContainer = styled.View({
  paddingHorizontal: 24,
  paddingTop: 12,
  paddingBottom: 8,
});

export const AnswerText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 14,
  fontWeight: "bold",
  lineHeight: 20,
}));
