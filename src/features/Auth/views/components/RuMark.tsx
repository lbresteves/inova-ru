import { Image } from "expo-image";

export function RuMark({ size = 52 }: { size?: number }) {
  return (
    <Image
      accessibilityLabel="Restaurante Universitário"
      contentFit="contain"
      source={require("../../../../../assets/images/ru-mark.png")}
      style={{ height: size, width: size }}
    />
  );
}
