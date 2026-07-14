import { useTheme } from "@emotion/react";
import { View, type ViewProps } from "react-native";

export function ThemedView({ style, ...props }: ViewProps) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme.colors.background }, style]} {...props} />;
}
