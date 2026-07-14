import { useTheme } from "@emotion/react";
import { useState, type ReactNode } from "react";
import type { TextInputProps } from "react-native";
import {
  FieldContainer,
  FieldLabel,
  HelpText,
  Input,
  InputShell,
  PrefixText,
} from "./TextField.styled";

export type TextFieldProps = TextInputProps & {
  label?: string;
  helpText?: string;
  errorText?: string;
  prefix?: string;
  trailing?: ReactNode;
};

export function TextField({
  label,
  helpText,
  errorText,
  prefix,
  trailing,
  onBlur,
  onFocus,
  editable = true,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const disabled = editable === false;

  return (
    <FieldContainer accessibilityState={{ disabled }}>
      {label ? <FieldLabel disabled={disabled}>{label}</FieldLabel> : null}
      <InputShell disabled={disabled} focused={focused} invalid={Boolean(errorText)}>
        {prefix ? <PrefixText disabled={disabled}>{prefix}</PrefixText> : null}
        <Input
          editable={editable}
          placeholderTextColor={theme.colors.textMuted}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          {...props}
        />
        {trailing}
      </InputShell>
      {errorText ? <HelpText invalid>{errorText}</HelpText> : null}
      {!errorText && helpText ? <HelpText>{helpText}</HelpText> : null}
    </FieldContainer>
  );
}
