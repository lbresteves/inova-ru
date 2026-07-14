import { useTheme } from "@emotion/react";
import { SymbolView, type SymbolWeight } from "expo-symbols";
import type { StyleProp, ViewStyle } from "react-native";
import type { ColorsType } from "@shared/theme";
import type { IconSymbolName } from "./IconSymbol";

export function IconSymbol({
  name,
  size = 24,
  color = "text",
  style,
  weight = "regular",
}: {
  name: IconSymbolName;
  size?: number;
  color?: keyof ColorsType;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const theme = useTheme();
  return (
    <SymbolView
      weight={weight}
      tintColor={theme.colors[color]}
      resizeMode="scaleAspectFit"
      name={name}
      style={[{ width: size, height: size }, style]}
    />
  );
}
