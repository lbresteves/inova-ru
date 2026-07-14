import type { PropsWithChildren } from "react";
import type { ScrollViewProps, ViewProps } from "react-native";
import { SafeScreen, ScreenContent, ScreenScroll } from "./Screen.styled";

export function Screen({ children, ...props }: PropsWithChildren<ViewProps>) {
  return <SafeScreen {...props}>{children}</SafeScreen>;
}

export function ScrollScreen({
  children,
  contentContainerStyle,
  ...props
}: PropsWithChildren<ScrollViewProps>) {
  return (
    <SafeScreen>
      <ScreenScroll
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </ScreenScroll>
    </SafeScreen>
  );
}

export { ScreenContent };
