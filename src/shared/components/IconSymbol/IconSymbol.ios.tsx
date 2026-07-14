import { useTheme } from "@emotion/react";
import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";

import type { ThemeType } from "../../theme";

type ThemeColorName = keyof ThemeType["colors"];

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color: ThemeColorName;
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
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
