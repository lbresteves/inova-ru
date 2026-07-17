import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { ActivityIndicator } from "react-native";

const Button = styled.Pressable<{ $disabled: boolean }>(
  ({ theme, $disabled }) => ({
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 50,
    opacity: $disabled ? 0.5 : 1,
    paddingHorizontal: 18,
  }),
);
const ButtonText = styled.Text(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontSize: theme.typography.btnText.fontSize,
  fontWeight: theme.typography.btnText.fontWeight,
  lineHeight: theme.typography.btnText.lineHeight,
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
  const theme = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Button
      $disabled={isDisabled}
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <ButtonText>Entrar</ButtonText>
      )}
    </Button>
  );
}
