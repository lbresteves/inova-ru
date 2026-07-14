import { IconSymbol, MenuButton, StatusBadge } from "@shared/components";
import { useState } from "react";

import {
  getBalanceVisibilityIconName,
  getBalanceVisibilityLabel,
} from "../utils/home-utils";
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
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const balanceText = isBalanceVisible ? balance : "R$ ****";

  function toggleBalanceVisibility() {
    setIsBalanceVisible((isVisible) => !isVisible);
  }

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
              color="onPrimary"
              name={getBalanceVisibilityIconName(isBalanceVisible)}
              size={24}
            />
          </BalanceVisibilityButton>
        </BalanceRow>
      </BalanceBlock>
    </Container>
  );
}
