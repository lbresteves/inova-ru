import { Modal } from "react-native";
import { useRouter } from "expo-router";
import { MenuButton } from "@shared/components";
import type { SideMenuProps } from "../types";
import {
  FooterContainer,
  MenuContainer,
  MenuHeader,
  MenuItemButton,
  MenuItemText,
  MenuItemsContainer,
  MenuWrapper,
  Overlay,
} from "./styles/SideMenu.styled";

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter();

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
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <MenuWrapper>
        <Overlay
          accessibilityLabel="Fechar menu escurecido"
          accessibilityRole="button"
          onPress={onClose}
        />
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
      </MenuWrapper>
    </Modal>
  );
}
