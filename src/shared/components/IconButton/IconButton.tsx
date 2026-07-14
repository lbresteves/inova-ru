import type { ComponentProps } from "react";
import type { PressableProps } from "react-native";
import { IconSymbol } from "../IconSymbol/IconSymbol";
import {
  IconButtonContainer,
  type IconButtonVariant,
} from "./IconButton.styled";

type IconName = ComponentProps<typeof IconSymbol>["name"];
type IconColor = ComponentProps<typeof IconSymbol>["color"];

export type IconButtonProps = Omit<PressableProps, "children"> & {
  accessibilityLabel: string;
  name: IconName;
  iconColor?: IconColor;
  iconSize?: number;
  size?: number;
  variant?: IconButtonVariant;
};

export function IconButton({
  accessibilityLabel,
  name,
  iconColor = "primary",
  iconSize = 22,
  size = 44,
  variant = "plain",
  ...props
}: IconButtonProps) {
  return (
    <IconButtonContainer
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      size={size}
      variant={variant}
      {...props}
    >
      <IconSymbol color={iconColor} name={name} size={iconSize} />
    </IconButtonContainer>
  );
}
