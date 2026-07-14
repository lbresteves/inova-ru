import { useTheme } from "@emotion/react";
import { Text, type TextProps } from "react-native";
import type { TypographyType } from "@shared/theme";

export type TextVariant = keyof TypographyType;

export type ThemedTextProps = TextProps & {
  variant?: TextVariant;
};

export function ThemedText({
  style,
  variant = "body",
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[theme.typography[variant], { color: theme.colors.text }, style]}
      {...rest}
    />
  );
}
