import { useEffect, useRef, useState } from "react";
import { MenuButton } from "@shared/components";
import { type Href, useRouter } from "expo-router";
import { Animated, Easing, Modal, useWindowDimensions } from "react-native";

import {
  FooterContainer,
  MenuAnimationContainer,
  MenuContainer,
  MenuHeader,
  MenuItemButton,
  MenuItemText,
  MenuItemsContainer,
  MenuWrapper,
  Overlay,
  OverlayAnimationContainer,
} from "./styles/SideMenu.styled";

const AnimatedMenuAnimationContainer =
  Animated.createAnimatedComponent(MenuAnimationContainer);
const AnimatedOverlayAnimationContainer = Animated.createAnimatedComponent(
  OverlayAnimationContainer
);
export interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

type MenuOption = {
  label: string;
  route?: Href;
};

const RECHARGE_ROUTE = "/main/recharge" as Href;
const RECHARGE_HISTORY_ROUTE = "/main/recharge-history" as Href;
const MEAL_HISTORY_ROUTE = "/main/meal-history" as Href;
const SETTINGS_ROUTE = "/settings" as Href;

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const animationProgress = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    const animation = Animated.timing(animationProgress, {
      duration: visible ? 220 : 180,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished && !visible) {
        setShouldRender(false);
      }
    });

    return () => animation.stop();
  }, [animationProgress, visible]);

  const overlayOpacity = animationProgress;
  const menuTranslateX = animationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.75, 0],
  });

  const menuOptions: MenuOption[] = [
    { label: "Recarregar", route: RECHARGE_ROUTE },
    { label: "Hist. de Recargas", route: RECHARGE_HISTORY_ROUTE },
    { label: "Hist. de Refeições", route: MEAL_HISTORY_ROUTE },
    { label: "Cardápio" },
    { label: "Configurações", route: SETTINGS_ROUTE },
  ];

  function handleNavigation(route?: Href) {
    if (route) {
      router.push(route);
    }

    onClose();
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={shouldRender}
      onRequestClose={onClose}
    >
      <MenuWrapper>
        <AnimatedOverlayAnimationContainer style={{ opacity: overlayOpacity }}>
          <Overlay
            accessibilityLabel="Fechar menu escurecido"
            accessibilityRole="button"
            onPress={onClose}
          />
        </AnimatedOverlayAnimationContainer>

        <AnimatedMenuAnimationContainer
          style={{ transform: [{ translateX: menuTranslateX }] }}
        >
          <MenuContainer>
            <MenuItemsContainer>
              <MenuHeader>
                <MenuButton
                  accessibilityLabel="Recolher menu"
                  name="line.3.horizontal"
                  onPress={onClose}
                />
              </MenuHeader>

              {menuOptions.map((option) => (
                <MenuItemButton
                  key={option.label}
                  accessibilityLabel={`Ir para ${option.label}`}
                  accessibilityRole="button"
                  onPress={() => handleNavigation(option.route)}
                >
                  <MenuItemText>{option.label}</MenuItemText>
                </MenuItemButton>
              ))}
            </MenuItemsContainer>

            <FooterContainer>
              <MenuItemButton
                accessibilityLabel="Sair da conta"
                accessibilityRole="button"
                onPress={() => {
                  onClose();
                }}
              >
                <MenuItemText>Sair</MenuItemText>
              </MenuItemButton>
            </FooterContainer>
          </MenuContainer>
        </AnimatedMenuAnimationContainer>
      </MenuWrapper>
    </Modal>
  );
}
