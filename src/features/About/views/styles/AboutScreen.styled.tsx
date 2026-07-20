import styled from "@emotion/native";
import { ThemedText, ThemedView } from "@shared/components";

export const Container = styled(ThemedView)(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  display: "flex",
  flexDirection: "column",
  flex: 1,
}));

export const ContentScroll = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 24,
  marginTop: 16,
});

export const CustomHeaderRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 16,
  paddingBottom: 24,
  paddingHorizontal: 24,
  paddingTop: 60,
});

export const BackButtonBox = styled.TouchableOpacity(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.primaryMuted,
  borderRadius: 12,
  height: 40,
  justifyContent: "center",
  width: 40,
}));

export const HeaderTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 22,
  fontWeight: "bold",
}));

export const HeroSection = styled.View({
  marginBottom: 40,
});

export const HeroTitleRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 12,
  marginBottom: 16,
});

export const HeroTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 28,
  fontWeight: "bold",
}));

export const HeroDescription = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 16,
  fontWeight: "500",
  lineHeight: 24,
}));

export const FaqSectionTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 20,
}));
