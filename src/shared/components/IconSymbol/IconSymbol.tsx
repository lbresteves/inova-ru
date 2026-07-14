import { useTheme } from "@emotion/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { SFSymbol, SymbolWeight } from "expo-symbols";
import type { ComponentProps } from "react";
import type { StyleProp, TextStyle } from "react-native";
import type { ColorsType } from "@shared/theme";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

const MAPPING = {
  "house.fill": "home",
  "chevron.right": "chevron-right",
  "chevron.down": "keyboard-arrow-down",
  "arrow.left": "arrow-back",
  "line.3.horizontal": "menu",
  "bell.fill": "notifications",
  "questionmark.circle": "help-outline",
  eye: "visibility",
  "eye.slash": "visibility-off",
  "arrow.clockwise": "refresh",
  "clock.arrow.circlepath": "history",
  "fork.knife": "restaurant",
  "doc.on.doc": "content-copy",
  checkmark: "check",
  exclamationmark: "priority-high",
  "info.circle": "info-outline",
  xmark: "close",
  "rectangle.portrait.and.arrow.right": "logout",
  "gearshape.fill": "settings",
  "creditcard.fill": "credit-card",
  "calendar": "calendar-today",
  "clock.fill": "schedule",
} satisfies Partial<Record<SFSymbol, MaterialIconName>>;

export type IconSymbolName = keyof typeof MAPPING;

export type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color?: keyof ColorsType;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

export function IconSymbol({
  name,
  size = 24,
  color = "text",
  style,
}: IconSymbolProps) {
  const theme = useTheme();
  return (
    <MaterialIcons
      color={theme.colors[color]}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
