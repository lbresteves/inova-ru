import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const AboutContent = styled.View(({ theme }) => ({
  gap: theme.layout.spacing.xl,
  paddingTop: theme.layout.spacing.xl,
}));
export const TitleRow = styled.View(({ theme }) => ({
  alignItems: "center",
  flexDirection: "row",
  gap: theme.layout.spacing.md,
}));
export const MainTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontFamily: "Poppins_600SemiBold",
  fontSize: 28,
  fontWeight: "600",
  lineHeight: 42,
}));
export const Description = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontFamily: "Poppins_600SemiBold",
  fontSize: 14,
  fontWeight: "600",
  lineHeight: 22,
}));
export const FaqTitle = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.screenTitle,
  color: theme.colors.text,
  fontSize: 22,
  lineHeight: 32,
  marginTop: 18,
}));
export const FaqList = styled.View(({ theme }) => ({ gap: theme.layout.spacing.md }));
export const Answer = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: theme.colors.text,
}));
