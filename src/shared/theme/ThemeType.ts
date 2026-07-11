// add/replace colors tokens as needed based on figma design
export type ColorsType = {
  background: string;
  foreground: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  border: string;
  tabBarActiveTintColor: string;
  transparent: string;
  shadow: string;
};

export type TTextStyle = {
  fontSize: number;
  lineHeight: number;
  fontWeight:
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | "bold"
    | "normal";
  color: string;
};

// add/replace typography tokens as needed based on figma design
export type TTypography = {
  default: TTextStyle;
  btnText: TTextStyle;
  iconText: TTextStyle;
  inputLabel: TTextStyle;
  inputText: TTextStyle;
  inputTextBold: TTextStyle;
  title: TTextStyle;
  subtitle: TTextStyle;
  link: TTextStyle;
};

// add/replace button tokens as needed based on figma design
export type TButtons = {
  outlined: {
    primary: {
      pressableStyles: {
        backgroundColor: keyof ColorsType;
        borderWidth: number;
        borderColor: keyof ColorsType;
      };
      typographyStyles: {
        color: keyof ColorsType;
      };
      onPressed: {
        backgroundColor: string;
      };
    };
    secondary: {
      pressableStyles: {
        borderWidth: number;
        backgroundColor: keyof ColorsType;
        borderColor: keyof ColorsType;
      };
      typographyStyles: {
        color: keyof ColorsType;
      };
      onPressed: {
        backgroundColor: string;
      };
    };
    disabled: {
      pressableStyles: {
        borderWidth: number;
        backgroundColor: keyof ColorsType;
        borderColor: keyof ColorsType;
      };
      typographyStyles: {
        color: keyof ColorsType;
      };
    };
  };
  contained: {
    primary: {
      pressableStyles: {
        borderWidth: number;
        backgroundColor: keyof ColorsType;
        borderColor: keyof ColorsType;
      };
      typographyStyles: {
        color: keyof ColorsType;
      };
      onPressed: {
        backgroundColor: string;
      };
    };
    secondary: {
      pressableStyles: {
        borderWidth: number;
        backgroundColor: keyof ColorsType;
        borderColor: keyof ColorsType;
      };
      typographyStyles: {
        color: keyof ColorsType;
      };
      onPressed: {
        backgroundColor: string;
      };
    };
    disabled: {
      pressableStyles: {
        borderWidth: number;
        backgroundColor: keyof ColorsType;
        borderColor: keyof ColorsType;
      };
      typographyStyles: {
        color: keyof ColorsType;
      };
    };
  };
};

/// add/replace layout tokens as needed based on figma design
export type LayoutType = {
  bottomTabs: {
    height: number;
  };

  header: {
    height: number;
  };

  spacing: {
    small: number;
    medium: number;
    large: number;
  };

  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
};

export type ThemeType = {
  buttons: TButtons;
  colors: ColorsType;
  typography: TTypography;
  layout?: Partial<LayoutType>;
};
