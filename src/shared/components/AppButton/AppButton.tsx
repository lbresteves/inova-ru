import { ActivityIndicator, type PressableProps } from "react-native";
import { useTheme } from "@emotion/react";
import { ButtonContainer, ButtonText, type AppButtonVariant } from "./AppButton.styled";

export type AppButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: AppButtonVariant;
};

export function AppButton({
  label,
  loading = false,
  variant = "primary",
  disabled,
  ...props
}: AppButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  return (
    <ButtonContainer
      accessibilityLabel={props.accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={isDisabled}
      buttonVariant={variant}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? theme.colors.onPrimary : theme.colors.primary}
        />
      ) : (
        <ButtonText buttonVariant={variant}>{label}</ButtonText>
      )}
    </ButtonContainer>
  );
}
