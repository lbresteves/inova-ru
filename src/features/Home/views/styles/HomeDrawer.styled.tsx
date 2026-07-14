import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const Scrim = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.scrim,
  flex: 1,
  flexDirection: "row",
}));
export const Drawer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.primaryDark,
  left: 0,
  paddingHorizontal: 28,
  position: "absolute",
  top: 0,
  bottom: 0,
}));
export const DrawerTop = styled.View({ alignItems: "flex-end", marginBottom: 24 });
export const DrawerItem = styled.Pressable({ justifyContent: "center", minHeight: 52 });
export const DrawerItemText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontFamily: "Inter_400Regular",
  fontSize: 24,
  lineHeight: 36,
}));
