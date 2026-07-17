import styled from "@emotion/native";
import { fontFamilies } from "@shared/theme";
import { ActivityIndicator } from "react-native";

const Button = styled.Pressable<{ $disabled: boolean }>(
  ({ theme, $disabled }) => ({
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 52,
    opacity: $disabled ? 0.5 : 1,
    paddingHorizontal: 18,
  }),
);
const ButtonText = styled.Text(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontFamily: fontFamilies.inter.bold,
  fontSize: 16,
  lineHeight: 22,
}));

type LoginButtonProps = {
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
};

export function LoginButton({
  disabled,
  loading,
  onPress,
}: LoginButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Button
      $disabled={isDisabled}
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <ButtonText>Entrar</ButtonText>}
    </Button>
  );
}
