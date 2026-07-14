import styled from "@emotion/native";
import { ThemedView } from "@shared/components";

export const Root = styled(ThemedView)({ flex: 1 });
export const HomeScroll = styled.ScrollView({ flex: 1 });
export const Content = styled.View(({ theme }) => ({
  alignSelf: "center",
  gap: theme.layout.spacing.md,
  maxWidth: theme.layout.contentMaxWidth,
  paddingBottom: theme.layout.spacing.xxl,
  paddingHorizontal: theme.layout.spacing.xl,
  paddingTop: 34,
  width: "100%",
}));
export const CardGroup = styled.View(({ theme }) => ({ gap: theme.layout.spacing.md }));
