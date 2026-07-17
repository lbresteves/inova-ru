import type { ComponentProps } from "react";

import { IconSymbol } from "../IconSymbol/IconSymbol";
import { IconButtonContainer } from "./IconButton.styled";

export interface IconButtonProps extends ComponentProps<typeof IconSymbol> {
  accessibilityLabel?: string;
  disabled?: boolean;
  onPress: () => void;
}

export const IconButton = ({
  name,
  color,
  size,
  onPress,
  accessibilityLabel,
  disabled,
}: IconButtonProps) => {
  return (
    <IconButtonContainer
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
    >
      <IconSymbol size={size} name={name} color={color} />
    </IconButtonContainer>
  );
};
