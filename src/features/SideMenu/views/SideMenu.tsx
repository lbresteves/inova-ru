import { useEffect, useRef, useState } from "react";
import { MenuButton } from "@shared/components";
import { RelativePathString, useRouter } from "expo-router";
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

  const menuOptions: { label: string; route: RelativePathString }[] = [
    { label: "Recarregar", route: "/main/recharge" as RelativePathString },
    { label: "Hist. de Recargas", route: "/main/recharge-history" as RelativePathString },
    { label: "Hist. de Refeições", route: "/main/meal-history" as RelativePathString },
    { label: "Cardápio", route: "/main/menu" as RelativePathString },
    { label: "Configurações", route: "/main/settings" as RelativePathString },
  ];

  function handleNavigation(route: RelativePathString) {
    router.replace(route)
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
