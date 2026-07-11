import { useTheme } from "@emotion/react";
import { IconSymbol, MenuButton, StatusBadge } from "@shared/components";
import type { ComponentProps } from "react";

import { useBalanceVisibility } from "./hooks/useBalanceVisibility";
import {
  BalanceBlock,
  BalanceLabel,
  BalanceRow,
  BalanceValue,
  BalanceVisibilityButton,
  Container,
  GreetingRow,
  GreetingText,
  TopBar,
  TopBarActions,
} from "./styles/HomeHeader.styled";
import type { HomeHeaderStatus } from "./types";

type IconName = ComponentProps<typeof IconSymbol>["name"];

function getBalanceVisibilityLabel(isBalanceVisible: boolean) {
  if (isBalanceVisible) {
    return "Ocultar saldo";
  }

  return "Mostrar saldo";
}

function getBalanceVisibilityIconName(isBalanceVisible: boolean): IconName {
  if (isBalanceVisible) {
    return "eye";
  }

  return "eye.slash";
}

export interface HomeHeaderProps {
  name: string;
  balance: string;
  status: HomeHeaderStatus;
  onHelpPress?: () => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
}

export function HomeHeader({
  name,
  balance,
  status,
  onHelpPress,
  onMenuPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  const theme = useTheme();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const balanceText = isBalanceVisible ? balance : "R$ ****";

  return (
    <Container>
      <TopBar>
        <MenuButton accessibilityLabel="Abrir menu" onPress={onMenuPress} />

        <TopBarActions>
          <MenuButton
            accessibilityLabel="Abrir notificações"
            name="bell.fill"
            onPress={onNotificationsPress}
          />
          <MenuButton
            accessibilityLabel="Abrir ajuda"
            name="questionmark.circle"
            onPress={onHelpPress}
          />
        </TopBarActions>
      </TopBar>

      <GreetingRow>
        <GreetingText type="title">Olá, {name}</GreetingText>
        <StatusBadge status={status} />
      </GreetingRow>

      <BalanceBlock>
        <BalanceLabel>Saldo disponível</BalanceLabel>
        <BalanceRow>
          <BalanceValue>{balanceText}</BalanceValue>
          <BalanceVisibilityButton
            accessibilityLabel={getBalanceVisibilityLabel(isBalanceVisible)}
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={toggleBalanceVisibility}
          >
            <IconSymbol
              color={theme.colors.onPrimary}
              name={getBalanceVisibilityIconName(isBalanceVisible)}
              size={24}
            />
          </BalanceVisibilityButton>
        </BalanceRow>
      </BalanceBlock>
    </Container>
  );
}
