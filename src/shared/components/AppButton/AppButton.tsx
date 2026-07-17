import { useTheme } from "@emotion/react";
import { ActivityIndicator, type PressableProps } from "react-native";

import {
  ButtonContainer,
  ButtonText,
  type AppButtonVariant,
} from "./AppButton.styled";

export type AppButtonProps = Omit<PressableProps, "children"> & {
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
      buttonVariant={variant}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary"
              ? theme.colors.onPrimary
              : theme.colors.primary
          }
        />
      ) : (
        <ButtonText buttonVariant={variant}>{label}</ButtonText>
      )}
    </ButtonContainer>
  );
}
