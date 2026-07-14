import type { PressableProps } from "react-native";
import { Chip, ChipText } from "./SelectChip.styled";

export function SelectChip({
  label,
  selected,
  disabled = false,
  ...props
}: PressableProps & { label: string; selected: boolean }) {
  const isDisabled = disabled === true;

  return (
    <Chip
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected }}
      disabled={isDisabled}
      selected={selected}
      {...props}
    >
      <ChipText disabled={isDisabled} selected={selected}>
        {label}
      </ChipText>
    </Chip>
  );
}
