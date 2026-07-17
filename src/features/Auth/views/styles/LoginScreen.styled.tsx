import styled from "@emotion/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = styled(SafeAreaView)(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  flex: 1,
}));

export const KeyboardContent = styled.KeyboardAvoidingView({ flex: 1 });
export const LoginScroll = styled.ScrollView({ flex: 1 });
export const LoginContent = styled.View({
  alignSelf: "center",
  flexGrow: 1,
  maxWidth: 520,
  paddingBottom: 32,
  paddingHorizontal: 24,
  paddingTop: 42,
  width: "100%",
});
export const BrandBlock = styled.View({ alignItems: "center" });
export const ScreenTitle = styled.Text(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 28,
  fontWeight: theme.typography.title.fontWeight,
  lineHeight: 36,
  marginTop: 12,
  textAlign: "center",
}));
export const Subtitle = styled.Text(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 14,
  fontWeight: theme.typography.default.fontWeight,
  lineHeight: 20,
  marginTop: 2,
  textAlign: "center",
}));
export const Form = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.border,
  borderRadius: 16,
  borderWidth: 1,
  elevation: 2,
  gap: 18,
  marginTop: 32,
  padding: 20,
  shadowColor: theme.colors.shadow,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 8,
}));
export const Spacer = styled.View({ flex: 1, minHeight: 32 });
export const ServerErrorText = styled.Text(({ theme }) => ({
  color: theme.colors.danger,
  fontSize: 13,
  fontWeight: theme.typography.default.fontWeight,
  lineHeight: 18,
}));
