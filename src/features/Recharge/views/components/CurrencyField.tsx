import styled from "@emotion/native";
import type { TextInputProps } from "react-native";

import { ThemedText } from "@shared/components";

const FieldContainer = styled.View<{ hasError: boolean }>(
  ({ theme, hasError }) => ({
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: hasError ? theme.colors.danger : theme.colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 60,
    paddingHorizontal: 16,
  }),
);

const Prefix = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.mutedText,
  fontSize: 16,
  fontWeight: "700",
  lineHeight: 22,
  marginRight: 10,
}));

const Input = styled.TextInput(({ theme }) => ({
  color: theme.colors.text,
  flex: 1,
  fontSize: 20,
  fontWeight: "700",
  lineHeight: 26,
  paddingVertical: 0,
}));

export type CurrencyFieldProps = Omit<TextInputProps, "value"> & {
  value: string;
  errorText?: string;
};

export function CurrencyField({
  value,
  errorText,
  ...props
}: CurrencyFieldProps) {
  return (
    <FieldContainer hasError={Boolean(errorText)}>
      <Prefix>R$</Prefix>
      <Input
        keyboardType="number-pad"
        value={value}
        {...props}
      />
    </FieldContainer>
  );
}
