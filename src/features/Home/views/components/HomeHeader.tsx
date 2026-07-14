import { useTheme } from "@emotion/react";
import { IconButton, IconSymbol, StatusBadge } from "@shared/components";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BalanceLabel,
  BalanceRow,
  BalanceValue,
  GreetingRow,
  GreetingText,
  HeaderContent,
  TopBar,
  TopBarActions,
  VisibilityButton,
} from "../styles/HomeHeader.styled";

export type HomeHeaderProps = {
  name: string;
  balance: string;
  status: string;
  onHelpPress: () => void;
  onMenuPress: () => void;
  onNotificationsPress: () => void;
};

export function HomeHeader({
  name,
  balance,
  status,
  onHelpPress,
  onMenuPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(true);

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
    >
      <HeaderContent safeTop={insets.top}>
        <TopBar>
          <IconButton
            accessibilityLabel="Abrir menu"
            iconColor="onPrimary"
            name="line.3.horizontal"
            onPress={onMenuPress}
            variant="onPrimary"
          />
          <TopBarActions>
            <IconButton
              accessibilityLabel="Abrir configurações de notificações"
              iconColor="onPrimary"
              name="bell.fill"
              onPress={onNotificationsPress}
            />
            <IconButton
              accessibilityLabel="Abrir ajuda"
              iconColor="onPrimary"
              name="questionmark.circle"
              onPress={onHelpPress}
            />
          </TopBarActions>
        </TopBar>

        <GreetingRow>
          <GreetingText>Olá, {name}</GreetingText>
          <StatusBadge status={status} />
        </GreetingRow>

        <BalanceLabel>Saldo disponível</BalanceLabel>
        <BalanceRow>
          <BalanceValue>{visible ? balance : "R$ ******"}</BalanceValue>
          <VisibilityButton
            accessibilityLabel={visible ? "Ocultar saldo" : "Mostrar saldo"}
            accessibilityRole="button"
            onPress={() => setVisible((value) => !value)}
          >
            <IconSymbol
              color="onPrimaryMuted"
              name={visible ? "eye" : "eye.slash"}
              size={28}
            />
          </VisibilityButton>
        </BalanceRow>
      </HeaderContent>
    </LinearGradient>
  );
}
