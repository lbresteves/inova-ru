import { type Href, useRouter } from "expo-router";
import { useState } from "react";

import { useRechargeBalanceQuery } from "@features/Recharge/hooks/useRechargeBalanceQuery";
import { formatCurrency } from "@features/Recharge/utils/currency";
import { IconSymbol } from "@shared/components";

import { HomeHeader } from "../HomeHeader";
import {
  ActionIconBox,
  ActionTexts,
  Container,
  Content,
  HistoryAction,
  HistoryActions,
  HistoryDescription,
  HistoryTitle,
  PrimaryAction,
  PrimaryActionContent,
  PrimaryActionText,
} from "./styles/HomeScreen.styled";

import { SideMenu } from "@features/SideMenu/views/SideMenu";

const RECHARGE_ROUTE = "/main/recharge" as Href;

export default function HomeScreen() {
  const router = useRouter();
  const balanceQuery = useRechargeBalanceQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Container contentContainerStyle={{ paddingBottom: 32 }}>
        <HomeHeader
          balance={
            balanceQuery.data
              ? formatCurrency(balanceQuery.data.current)
              : "R$ --"
          }
          name="João"
          status="Ativo"
          onMenuPress={() => setIsMenuOpen(true)}
          onNotificationsPress={() => router.push("/settings")}
          onHelpPress={() => router.push("/about")}
        />
        <Content>
          <PrimaryAction
            activeOpacity={0.8}
            onPress={() => router.push(RECHARGE_ROUTE)}
          >
            <PrimaryActionContent>
              <IconSymbol
                color="onPrimary"
                name="arrow.clockwise"
                size={18}
              />
              <PrimaryActionText>Recarregar créditos</PrimaryActionText>
            </PrimaryActionContent>
          </PrimaryAction>

          <HistoryActions>
            <HistoryAction activeOpacity={0.8}>
              <ActionIconBox>
                <IconSymbol
                  color="primary"
                  name="clock.arrow.circlepath"
                  size={22}
                />
              </ActionIconBox>
              <ActionTexts>
                <HistoryTitle>Histórico de recargas</HistoryTitle>
                <HistoryDescription>Ver recargas via PIX</HistoryDescription>
              </ActionTexts>
              <IconSymbol
                color="mutedText"
                name="chevron.right"
                size={18}
              />
            </HistoryAction>

            <HistoryAction activeOpacity={0.8}>
              <ActionIconBox>
                <IconSymbol
                  color="primary"
                  name="fork.knife"
                  size={22}
                />
              </ActionIconBox>
              <ActionTexts>
                <HistoryTitle>Histórico de refeições</HistoryTitle>
                <HistoryDescription>Consumos nos RUs</HistoryDescription>
              </ActionTexts>
              <IconSymbol
                color="mutedText"
                name="chevron.right"
                size={18}
              />
            </HistoryAction>
          </HistoryActions>
        </Content>
      </Container>

      <SideMenu
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
