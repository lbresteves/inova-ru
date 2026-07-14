import { useTheme } from "@emotion/react";
import { LogoBackground, LogoMark } from "./AppLogo.styled";

export function AppLogo({ size = 52 }: { size?: number }) {
  const theme = useTheme();
  return (
    <LogoBackground
      accessibilityIgnoresInvertColors
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      end={{ x: 1, y: 1 }}
      size={size}
      start={{ x: 0, y: 0 }}
    >
      <LogoMark
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        size={size}
        source={require("../../../../assets/images/ru-mark.png")}
      />
    </LogoBackground>
  );
}
