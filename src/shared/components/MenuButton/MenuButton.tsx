import { useTheme } from "@emotion/react";
import type { ComponentProps } from "react";

import { IconSymbol } from "../IconSymbol/IconSymbol";
import { CircularIconButton } from "./MenuButton.styled";

type IconName = ComponentProps<typeof IconSymbol>["name"];

interface MenuButtonProps {
  name?: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
}

export function MenuButton({
  name = "line.3.horizontal",
  accessibilityLabel,
  onPress,
}: MenuButtonProps) {
  const theme = useTheme();

  return (
    <CircularIconButton
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.75}
      onPress={onPress}
    >
      <IconSymbol color={theme.colors.onPrimary} name={name} size={22} />
    </CircularIconButton>
  );
}
