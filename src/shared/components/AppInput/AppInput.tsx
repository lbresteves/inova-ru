import { useTheme } from "@emotion/react";
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

import { InputContainer, InputField, InputLabel } from "./AppInput.styled";

export interface AppInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  isStrong?: boolean;
  label?: string;
}

export function AppInput({
  containerStyle,
  inputStyle,
  isStrong,
  label,
  placeholderTextColor,
  ...inputProps
}: AppInputProps) {
  const theme = useTheme();

  return (
    <InputContainer style={containerStyle}>
      {label ? <InputLabel>{label}</InputLabel> : null}
      <InputField
        isStrong={isStrong}
        placeholderTextColor={placeholderTextColor ?? theme.colors.mutedText}
        style={inputStyle}
        {...inputProps}
      />
    </InputContainer>
  );
}
