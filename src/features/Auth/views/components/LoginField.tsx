import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { IconSymbol } from "@shared/components";
import { useEffect, useRef, useState } from "react";
import type { TextInputProps } from "react-native";

const PASSWORD_REVEAL_DURATION_MS = 1_500;

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
  flex: 1,
  fontSize: theme.typography.inputText.fontSize,
  fontWeight: theme.typography.inputText.fontWeight,
  lineHeight: theme.typography.inputText.lineHeight,
  paddingVertical: 12,
}));
const PasswordDisplay = styled.Text<{ $placeholder: boolean }>(
  ({ theme, $placeholder }) => ({
    color: $placeholder ? theme.colors.mutedText : theme.colors.text,
    fontSize: theme.typography.inputText.fontSize,
    fontWeight: theme.typography.inputText.fontWeight,
    left: 0,
    lineHeight: theme.typography.inputText.lineHeight,
    position: "absolute",
    right: 0,
    top: 12,
  }),
);
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

function getInsertedCharacterIndex(
  previousValue: string,
  currentValue: string,
): number | undefined {
  const previousCharacters = Array.from(previousValue);
  const currentCharacters = Array.from(currentValue);

  if (currentCharacters.length <= previousCharacters.length) {
    return undefined;
  }

  let commonPrefixLength = 0;
  while (
    commonPrefixLength < previousCharacters.length &&
    previousCharacters[commonPrefixLength] ===
      currentCharacters[commonPrefixLength]
  ) {
    commonPrefixLength += 1;
  }

  const insertedCharacterCount =
    currentCharacters.length - previousCharacters.length;

  return Math.min(
    currentCharacters.length - 1,
    commonPrefixLength + insertedCharacterCount - 1,
  );
}

function maskPassword(value: string, revealedIndex?: number): string {
  return Array.from(value)
    .map((character, index) =>
      index === revealedIndex ? character : "•",
    )
    .join("");
}

export function LoginField({
  errorText,
  label,
  onBlur,
  onFocus,
  onToggleVisibility,
  passwordVisible,
  placeholder,
  secureTextEntry,
  value,
  ...inputProps
}: LoginFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealedCharacterIndex, setRevealedCharacterIndex] =
    useState<number>();
  const previousValueRef = useRef("");
  const inputValue = typeof value === "string" ? value : "";
  const shouldControlPasswordMask = Boolean(
    onToggleVisibility && secureTextEntry && !passwordVisible,
  );

  useEffect(() => {
    const previousValue = previousValueRef.current;
    previousValueRef.current = inputValue;

    if (!shouldControlPasswordMask) {
      setRevealedCharacterIndex(undefined);
      return;
    }

    const nextRevealedIndex = getInsertedCharacterIndex(
      previousValue,
      inputValue,
    );
    setRevealedCharacterIndex(nextRevealedIndex);

    if (nextRevealedIndex === undefined) {
      return;
    }

    const timeout = setTimeout(
      () => setRevealedCharacterIndex(undefined),
      PASSWORD_REVEAL_DURATION_MS,
    );

    return () => clearTimeout(timeout);
  }, [inputValue, shouldControlPasswordMask]);

  const passwordDisplay = inputValue
    ? maskPassword(inputValue, revealedCharacterIndex)
    : placeholder;

  return (
    <Field>
      <Label>{label}</Label>
      <InputContainer $focused={focused} $hasError={Boolean(errorText)}>
        <InputArea>
          <Input
            {...inputProps}
            $masked={shouldControlPasswordMask}
            accessibilityLabel={inputProps.accessibilityLabel ?? label}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            placeholder={shouldControlPasswordMask ? undefined : placeholder}
            placeholderTextColor={theme.colors.mutedText}
            secureTextEntry={secureTextEntry}
            selectionColor={
              inputProps.selectionColor ?? theme.colors.primary
            }
            value={value}
          />
          {shouldControlPasswordMask ? (
            <PasswordDisplay
              $placeholder={!inputValue}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              numberOfLines={1}
              pointerEvents="none"
            >
              {passwordDisplay}
            </PasswordDisplay>
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
