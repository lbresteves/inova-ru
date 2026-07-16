import styled from "@emotion/native";
import { ThemedText, ThemedView } from "@shared/components";

export const MenuWrapper = styled.View({
  flex: 1,
  flexDirection: "row",
});

export const OverlayAnimationContainer = styled.View({
  bottom: 0,
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
});

export const Overlay = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.foreground,
  flex: 1,
  opacity: 0.6,
}));

export const MenuAnimationContainer = styled.View({
  flex: 1,
  maxWidth: "75%",
});

export const MenuContainer = styled(ThemedView)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderBottomRightRadius: 40,
  flex: 1,
  justifyContent: "space-between",
  paddingBottom: 40,
  paddingHorizontal: 32,
  paddingTop: 60,
}));

export const MenuHeader = styled.View({
  alignItems: "flex-end",
  marginBottom: 40,
});

export const MenuItemsContainer = styled.View({
  gap: 24,
});

export const MenuItemButton = styled.TouchableOpacity({
  paddingVertical: 8,
});

export const MenuItemText = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.onPrimary,
  fontSize: 20,
  fontWeight: "500",
}));

export const FooterContainer = styled.View({
  marginTop: "auto",
  paddingTop: 40,
});
