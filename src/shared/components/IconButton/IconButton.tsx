import { ComponentProps } from "react";
import { IconSymbol } from "../IconSymbol/IconSymbol";
import { IconButtonContainer } from "./IconButton.styled";

export interface IconButtonProps extends ComponentProps<typeof IconSymbol> {
  onPress: () => void;
}

export const IconButton = ({ name, color, size, onPress }: IconButtonProps) => {
  return (
    <IconButtonContainer onPress={onPress}>
      <IconSymbol size={size} name={name} color={color} />
    </IconButtonContainer>
  );
};
