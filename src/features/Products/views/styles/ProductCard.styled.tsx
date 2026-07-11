import styled from "@emotion/native";
import { ThemeType } from "@shared/theme";
import { View } from "react-native";

export const Card = styled(View)(
  ({ theme, full }: { theme?: ThemeType; full?: boolean }) => ({
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme?.colors.surface,
    shadowColor: theme?.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme?.colors.border,
    width: full ? "100%" : 260,
  })
);

export const CardImageWrapper = styled.View({
  borderRadius: 8,
  overflow: "hidden",
});

export const CardImage = styled.Image({
  width: "100%",
  aspectRatio: 3 / 2,
  objectFit: "scale-down",
});
