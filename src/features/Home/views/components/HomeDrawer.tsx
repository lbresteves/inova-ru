import { IconButton } from "@shared/components";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Drawer,
  DrawerItem,
  DrawerItemText,
  DrawerTop,
  Scrim,
} from "../styles/HomeDrawer.styled";

export type DrawerDestination =
  | "recharge"
  | "rechargeHistory"
  | "mealHistory"
  | "menu"
  | "settings"
  | "logout";

const items: { key: DrawerDestination; label: string }[] = [
  { key: "recharge", label: "Recarregar" },
  { key: "rechargeHistory", label: "Hist. de Recargas" },
  { key: "mealHistory", label: "Hist. de Refeições" },
  { key: "menu", label: "Cardápio" },
  { key: "settings", label: "Configurações" },
];

export function HomeDrawer({
  visible,
  onClose,
  onNavigate,
}: {
  visible: boolean;
  onClose: () => void;
  onNavigate: (destination: DrawerDestination) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.84, 360);
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;

  useEffect(() => {
    if (visible) {
      translateX.setValue(-drawerWidth);
      Animated.timing(translateX, {
        duration: 220,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerWidth, translateX, visible]);

  function close(after?: () => void) {
    Animated.timing(translateX, {
      duration: 180,
      toValue: -drawerWidth,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      after?.();
    });
  }

  return (
    <Modal
      animationType="none"
      onRequestClose={() => close()}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Scrim accessibilityViewIsModal>
        <Pressable
          accessibilityLabel="Fechar menu"
          onPress={() => close()}
          style={{ flex: 1 }}
        />
        <Drawer
          as={Animated.View}
          style={{
            paddingBottom: Math.max(insets.bottom, 20),
            paddingTop: Math.max(insets.top, 20),
            transform: [{ translateX }],
            width: drawerWidth,
          }}
        >
          <DrawerTop>
            <IconButton
              accessibilityLabel="Fechar menu"
              iconColor="onPrimary"
              name="xmark"
              onPress={() => close()}
            />
          </DrawerTop>
          {items.map((item) => (
            <DrawerItem
              accessibilityRole="button"
              key={item.key}
              onPress={() => close(() => onNavigate(item.key))}
            >
              <DrawerItemText>{item.label}</DrawerItemText>
            </DrawerItem>
          ))}
          <DrawerItem
            accessibilityRole="button"
            onPress={() => close(() => onNavigate("logout"))}
            style={{ marginTop: "auto" }}
          >
            <DrawerItemText>Sair</DrawerItemText>
          </DrawerItem>
        </Drawer>
      </Scrim>
    </Modal>
  );
}
