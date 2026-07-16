import { ToggleThumb, ToggleTrack } from "./Toggle.styled";

export interface ToggleProps {
  accessibilityLabel: string;
  disabled?: boolean;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Toggle({
  accessibilityLabel,
  disabled,
  value,
  onValueChange,
}: ToggleProps) {
  function handlePress() {
    if (!disabled) {
      onValueChange(!value);
    }
  }

  return (
    <ToggleTrack
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      activeOpacity={disabled ? 1 : 0.8}
      checked={value}
      disabled={disabled}
      onPress={handlePress}
    >
      <ToggleThumb checked={value} disabled={disabled} />
    </ToggleTrack>
  );
}
