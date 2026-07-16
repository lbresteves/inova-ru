import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

interface SelectableBoxStyleProps {
  disabled?: boolean;
  minWidth: number;
  selected?: boolean;
}

function getButtonColor({
  disabled,
  selected,
  theme,
}: SelectableBoxStyleProps & { theme: import("@emotion/react").Theme }) {
  if (disabled && selected) {
    return theme.colors.controlDisabled;
  }

  if (selected) {
    return theme.colors.primary;
  }

  return theme.colors.background;
}

function getBorderColor({
  disabled,
  selected,
  theme,
}: SelectableBoxStyleProps & { theme: import("@emotion/react").Theme }) {
  if (disabled && selected) {
    return theme.colors.controlDisabled;
  }

  if (selected) {
    return theme.colors.primary;
  }

  return theme.colors.border;
}

export const SelectableBoxButton =
  styled.TouchableOpacity<SelectableBoxStyleProps>(
    ({ disabled, minWidth, selected, theme }) => ({
      alignItems: "center",
      backgroundColor: getButtonColor({ disabled, minWidth, selected, theme }),
      borderColor: getBorderColor({ disabled, minWidth, selected, theme }),
      borderRadius: 10,
      borderWidth: 1,
      flexGrow: 1,
      justifyContent: "center",
      minHeight: 36,
      minWidth,
      opacity: disabled && !selected ? 0.6 : 1,
      paddingHorizontal: 10,
      paddingVertical: 8,
    })
  );

export const SelectableBoxText = styled(ThemedText)<{
  disabled?: boolean;
  selected?: boolean;
}>(({ disabled, selected, theme }) => ({
    color: selected ? theme.colors.onPrimary : theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    opacity: disabled && !selected ? 0.7 : 1,
    textAlign: "center",
  }));
