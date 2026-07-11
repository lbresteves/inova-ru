import { darkColorSchema } from "./darkColorSchema";
import { ThemeType, TTextStyle } from "./ThemeType";

const defaultTextStyle: TTextStyle = {
  fontSize: 16,
  fontWeight: "normal",
  lineHeight: 24,
  color: "#000",
};

export const theme: ThemeType = {
  colors: {
    ...darkColorSchema,
    transparent: "transparent",
  },

  typography: {
    default: {
      ...defaultTextStyle,
    },
    btnText: {
      ...defaultTextStyle,
      fontWeight: "600",
      lineHeight: 22,
      color: "#ffffff",
    },
    iconText: {
      ...defaultTextStyle,
      fontSize: 14,
      fontWeight: "400",
    },
    inputLabel: {
      ...defaultTextStyle,
      fontSize: 14,
      fontWeight: "500",
    },
    inputText: {
      ...defaultTextStyle,
      fontSize: 16,
      fontWeight: "400",
    },
    inputTextBold: {
      ...defaultTextStyle,
      fontSize: 16,
      fontWeight: "700",
    },
    title: {
      ...defaultTextStyle,
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 32,
    },
    subtitle: {
      ...defaultTextStyle,
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 28,
    },
    link: {
      ...defaultTextStyle,
      fontSize: 14,
      fontWeight: "500",
      color: "primary",
    },
  },

  layout: {
    bottomTabs: {
      height: 64,
    },
    header: {
      height: 56,
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 16,
    },
  },

  buttons: {
    outlined: {
      primary: {
        pressableStyles: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "primary",
        },
        typographyStyles: {
          color: "primary",
        },
        onPressed: {
          backgroundColor: "",
        },
      },
      secondary: {
        pressableStyles: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "secondary",
        },
        typographyStyles: {
          color: "secondary",
        },
        onPressed: {
          backgroundColor: "",
        },
      },
      disabled: {
        pressableStyles: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "border",
        },
        typographyStyles: {
          color: "text",
        },
      },
    },

    contained: {
      primary: {
        pressableStyles: {
          backgroundColor: "primary",
          borderWidth: 0,
          borderColor: "primary",
        },
        typographyStyles: {
          color: "text",
        },
        onPressed: {
          backgroundColor: "primary",
        },
      },
      secondary: {
        pressableStyles: {
          backgroundColor: "secondary",
          borderWidth: 0,
          borderColor: "secondary",
        },
        typographyStyles: {
          color: "text",
        },
        onPressed: {
          backgroundColor: "secondary",
        },
      },
      disabled: {
        pressableStyles: {
          backgroundColor: "background",
          borderWidth: 0,
          borderColor: "border",
        },
        typographyStyles: {
          color: "secondary",
        },
      },
    },
  },
};
