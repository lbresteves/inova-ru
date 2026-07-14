import styled from "@emotion/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SafeScreen = styled(SafeAreaView)(({ theme }) => ({
  backgroundColor: theme.colors.background,
  flex: 1,
}));

export const ScreenScroll = styled.ScrollView(({ theme }) => ({
  backgroundColor: theme.colors.background,
  flex: 1,
}));

export const ScreenContent = styled.View(({ theme }) => ({
  alignSelf: "center",
  maxWidth: theme.layout.contentMaxWidth,
  paddingBottom: theme.layout.spacing.xxl,
  paddingHorizontal: theme.layout.spacing.xl,
  width: "100%",
}));
