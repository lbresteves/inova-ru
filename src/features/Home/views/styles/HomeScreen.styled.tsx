import styled from "@emotion/native";
import { BoxContent } from "@shared/components";

export const Container = styled.ScrollView(({ theme }) => ({
  padding: 16,
  backgroundColor: theme.colors.surface,
}));
export const Section = styled(BoxContent)(({ theme }) => ({
  padding: 16,
  borderWidth: 2,
  backgroundColor: theme.colors.transparent,
  borderColor: theme.colors.border,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 200,
  borderStyle: "dashed",
}));

export const HorizontalScrollSection = styled.View({
  paddingVertical: 16,
  minHeight: 200,
});
