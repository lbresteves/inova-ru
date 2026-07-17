import { SelectableBoxButton, SelectableBoxText } from "./SelectableBox.styled";

export interface SelectableBoxProps<TValue> {
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  minWidth?: number;
  selected?: boolean;
  selectedValues?: TValue[];
  value: TValue;
  onPress?: (value: TValue) => void;
  onSelectedValuesChange?: (values: TValue[]) => void;
}

export function SelectableBox<TValue>({
  accessibilityLabel,
  disabled,
  label,
  minWidth = 56,
  selected,
  selectedValues,
  value,
  onPress,
  onSelectedValuesChange,
}: SelectableBoxProps<TValue>) {
  const isSelected = selected ?? selectedValues?.includes(value) ?? false;

  function handlePress() {
    if (disabled) {
      return;
    }

    if (selectedValues && onSelectedValuesChange) {
      const nextValues = isSelected
        ? selectedValues.filter((selectedValue) => selectedValue !== value)
        : [...selectedValues, value];

      onSelectedValuesChange(nextValues);
      return;
    }

    onPress?.(value);
  }

  return (
    <SelectableBoxButton
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isSelected }}
      activeOpacity={disabled ? 1 : 0.82}
      disabled={disabled}
      minWidth={minWidth}
      selected={isSelected}
      onPress={handlePress}
    >
      <SelectableBoxText disabled={disabled} selected={isSelected}>
        {label}
      </SelectableBoxText>
    </SelectableBoxButton>
  );
}
