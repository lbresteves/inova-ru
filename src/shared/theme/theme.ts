import type { ThemeType } from "./ThemeType";
import { lightColorSchema } from "./lightColorSchema";

export const theme: ThemeType = {
  colors: lightColorSchema,
  typography: {
    caption: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 16,
    },
    bodySmall: {
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 20,
    },
    body: {
      fontFamily: "Inter_400Regular",
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
    },
    label: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      fontWeight: "600",
      lineHeight: 18,
    },
    button: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 15,
      fontWeight: "600",
      lineHeight: 20,
    },
    screenTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 19,
      fontWeight: "600",
      lineHeight: 28,
    },
    sectionTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 24,
      fontWeight: "600",
      lineHeight: 34,
    },
    displayAmount: {
      fontFamily: "Poppins_700Bold",
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 44,
    },
    monospace: {
      fontFamily: "SpaceMono",
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 18,
    },
  },
  layout: {
    contentMaxWidth: 720,
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 32 },
    radius: { sm: 8, md: 10, lg: 14, xl: 20, pill: 999 },
  },
};
