import styled from "@emotion/native";
import { fontFamilies } from "@shared/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = styled(SafeAreaView)(({ theme }) => ({
  backgroundColor: theme.colors.background,
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
  color: theme.colors.text,
  fontFamily: fontFamilies.poppins.bold,
  fontSize: 28,
  lineHeight: 36,
  marginTop: 12,
  textAlign: "center",
}));
export const Subtitle = styled.Text(({ theme }) => ({
  color: theme.colors.mutedText,
  fontFamily: fontFamilies.inter.regular,
  fontSize: 14,
  lineHeight: 20,
  marginTop: 2,
  textAlign: "center",
}));
export const Form = styled.View({ gap: 18, marginTop: 64 });
export const Spacer = styled.View({ flex: 1, minHeight: 56 });
export const ServerErrorText = styled.Text(({ theme }) => ({
  color: theme.colors.danger,
  fontFamily: fontFamilies.inter.regular,
  fontSize: 13,
  lineHeight: 18,
}));
