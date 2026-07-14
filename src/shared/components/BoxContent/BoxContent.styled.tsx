import styled from "@emotion/native";
import type { ThemeType } from "../../theme";

export interface IBoxProps {
  center?: boolean;
  centerVertical?: boolean;
  centerHorizontal?: boolean;
  flex?: number;
  flexDirection?: "row" | "column";
  bg?: keyof ThemeType["colors"];
  gap?: number;
  padding?: number;
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
}

export const Box = styled.View<IBoxProps>(({ theme, ...props }) => ({
  alignItems: props.center || props.centerHorizontal ? "center" : "stretch",
  backgroundColor: props.bg ? theme.colors[props.bg] : theme.colors.transparent,
  flex: props.flex,
  flexDirection: props.flexDirection ?? "column",
  gap: props.gap,
  justifyContent:
    props.center || props.centerVertical ? "center" : props.justifyContent ?? "flex-start",
  padding: props.padding,
  width: "100%",
}));
