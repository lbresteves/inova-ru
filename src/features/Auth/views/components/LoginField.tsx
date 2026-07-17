import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { IconSymbol } from "@shared/components";
import { useState } from "react";
import type { TextInputProps } from "react-native";

const Field = styled.View({ gap: 6 });
const Label = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.typography.inputLabel.fontSize,
  fontWeight: theme.typography.inputLabel.fontWeight,
  lineHeight: theme.typography.inputLabel.lineHeight,
}));
const InputContainer = styled.View<{
  $focused: boolean;
  $hasError: boolean;
}>(({ theme, $focused, $hasError }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.surface,
  borderColor: $hasError
    ? theme.colors.danger
    : $focused
      ? theme.colors.primary
      : theme.colors.border,
  borderRadius: 12,
  borderWidth: $focused || $hasError ? 2 : 1,
  flexDirection: "row",
  minHeight: 52,
  paddingHorizontal: 14,
}));
const InputArea = styled.View({
  flex: 1,
  justifyContent: "center",
  position: "relative",
});
const Input = styled.TextInput<{ $masked: boolean }>(({ theme, $masked }) => ({
  color: $masked ? theme.colors.transparent : theme.colors.text,
  fontSize: theme.typography.inputText.fontSize,
  fontWeight: theme.typography.inputText.fontWeight,
  lineHeight: theme.typography.inputText.lineHeight,
  paddingVertical: 12,
}));
const MaskedPassword = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.typography.inputText.fontSize,
  fontWeight: theme.typography.inputText.fontWeight,
  left: 0,
  lineHeight: theme.typography.inputText.lineHeight,
  position: "absolute",
  right: 0,
}));
const ErrorText = styled.Text(({ theme }) => ({
  color: theme.colors.danger,
  fontSize: 12,
  fontWeight: theme.typography.default.fontWeight,
  lineHeight: 16,
}));
const VisibilityButton = styled.Pressable({
  alignItems: "center",
  height: 44,
  justifyContent: "center",
  marginRight: -10,
  width: 44,
});

type LoginFieldProps = TextInputProps & {
  errorText?: string;
  label: string;
  onToggleVisibility?: () => void;
  passwordVisible?: boolean;
};

export function LoginField({
  errorText,
  label,
  onBlur,
  onFocus,
  onToggleVisibility,
  passwordVisible,
  ...inputProps
}: LoginFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const shouldMaskPassword = Boolean(
    inputProps.secureTextEntry && !passwordVisible,
  );
  const inputValue = String(inputProps.value ?? "");
  const maskedValue = "•".repeat(Array.from(inputValue).length);

  return (
    <Field>
      <Label>{label}</Label>
      <InputContainer $focused={focused} $hasError={Boolean(errorText)}>
        <InputArea>
          <Input
            {...inputProps}
            $masked={shouldMaskPassword}
            accessibilityLabel={inputProps.accessibilityLabel ?? label}
            caretHidden={shouldMaskPassword || inputProps.caretHidden}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            placeholderTextColor={theme.colors.mutedText}
            selectionColor={
              shouldMaskPassword
                ? theme.colors.transparent
                : inputProps.selectionColor ?? theme.colors.primary
            }
          />
          {shouldMaskPassword && maskedValue ? (
            <MaskedPassword
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              numberOfLines={1}
              pointerEvents="none"
            >
              {maskedValue}
            </MaskedPassword>
          ) : null}
        </InputArea>
        {onToggleVisibility ? (
          <VisibilityButton
            accessibilityLabel={
              passwordVisible ? "Ocultar senha" : "Mostrar senha"
            }
            accessibilityRole="button"
            onPress={onToggleVisibility}
          >
            <IconSymbol
              color="mutedText"
              name={passwordVisible ? "eye.slash" : "eye"}
              size={20}
            />
          </VisibilityButton>
        ) : null}
      </InputContainer>
      {errorText ? <ErrorText>{errorText}</ErrorText> : null}
    </Field>
  );
}
