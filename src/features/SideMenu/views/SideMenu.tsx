import { useEffect, useRef, useState } from "react";
import { MenuButton } from "@shared/components";
import { useRouter } from "expo-router";
import { Animated, Easing, Modal, useWindowDimensions } from "react-native";
import type { SideMenuProps } from "../types";
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

  const menuOptions = [
    { label: "Recarregar", route: "/recharge" },
    { label: "Hist. de Recargas", route: "/recharge-history" },
    { label: "Hist. de Refeições", route: "/meal-history" },
    { label: "Cardápio", route: "/menu" },
    { label: "Configurações", route: "/settings" },
  ];

  function handleNavigation(route: string) {
    onClose();
    // router.push(route as any);
    // console.log(`[Router Output] Navegando para: ${route}`);
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
                  // router.replace("/login");
                  // console.log("[Router Output] Sair da conta");
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
