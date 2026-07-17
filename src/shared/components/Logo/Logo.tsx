import type { ImageStyle, StyleProp } from "react-native";
import { Image } from "react-native";

export type LogoProps = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function Logo({ size = 40, style }: LogoProps) {
  return (
    <Image
      accessibilityLabel="Restaurante Universitário"
      resizeMode="contain"
      source={require("../../../../assets/images/logo.png")}
      style={[
        {
          height: size,
          marginHorizontal: 16,
          width: size,
        },
        style,
      ]}
    />
  );
}
