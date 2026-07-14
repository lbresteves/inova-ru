import styled from "@emotion/native";
import { LinearGradient } from "expo-linear-gradient";

export const LogoBackground = styled(LinearGradient)<{ size: number }>(
  ({ theme, size }) => ({
    alignItems: "center",
    borderRadius: Math.round(size * 0.31),
    height: size,
    justifyContent: "center",
    width: size,
  }),
);

export const LogoMark = styled.Image<{ size: number }>(({ size }) => ({
  height: size * 0.68,
  width: size * 0.68,
}));
