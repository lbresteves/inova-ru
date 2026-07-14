import type { TextStyle } from "react-native";

export type ColorsType = {
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceElevated: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  gradientStart: string;
  gradientEnd: string;
  onPrimary: string;
  onPrimaryMuted: string;
  onPrimaryOverlay: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnSoftSurface: string;
  textOnStatusSurface: string;
  disabledContent: string;
  disabledSurface: string;
  border: string;
  borderSubtle: string;
  success: string;
  successSurface: string;
  successBorder: string;
  warning: string;
  warningSurface: string;
  warningBorder: string;
  danger: string;
  dangerSurface: string;
  dangerBorder: string;
  shadow: string;
  scrim: string;
  transparent: string;
};

export type TypographyToken = Pick<
  TextStyle,
  "fontFamily" | "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing"
>;

export type TypographyType = {
  caption: TypographyToken;
  bodySmall: TypographyToken;
  body: TypographyToken;
  label: TypographyToken;
  button: TypographyToken;
  screenTitle: TypographyToken;
  sectionTitle: TypographyToken;
  displayAmount: TypographyToken;
  monospace: TypographyToken;
};

export type LayoutType = {
  contentMaxWidth: number;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
};

export type ThemeType = {
  colors: ColorsType;
  typography: TypographyType;
  layout: LayoutType;
};
