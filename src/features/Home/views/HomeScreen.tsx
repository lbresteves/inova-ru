import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl } from "react-native";

import { useSessionStore } from "@features/Auth";
import { type ConsumerSituation, useCreditAccountQuery } from "@features/CreditAccount";
import { formatCurrency } from "@features/Recharge/utils/currency";
import { getApiErrorMessage } from "@shared/api";
import { AppButton, IconSymbol } from "@shared/components";

import { HomeHeader } from "../HomeHeader";
import {
  AccountNotice,
  AccountNoticeText,
  AccountNoticeTitle,
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
const RECHARGE_HISTORY_ROUTE = "/main/recharge-history" as Href;
const MEAL_HISTORY_ROUTE = "/main/meal-history" as Href;
const SETTINGS_ROUTE = "/main/settings" as Href;

function mapHeaderStatus(situation?: ConsumerSituation) {
  switch (situation) {
    case "active":
      return "Ativo";
    case "blocked":
      return "Bloqueado";
    case "inactive":
      return "Inativo";
    default:
      return "Pendente";
  }
}

function getAccountNotice(
  situation: ConsumerSituation | undefined,
  accountError?: string,
): { title: string; description: string; retry?: boolean } | null {
  if (accountError) {
    return {
      description: accountError,
      retry: true,
      title: "Não foi possível atualizar sua conta",
    };
  }

  if (situation === "blocked") {
    return {
      description: "A consulta de saldo continua disponível, mas novas recargas estão bloqueadas para este consumidor.",
      title: "Recarga indisponível",
    };
  }

  if (situation === "inactive") {
    return {
      description: "Seu cadastro está inativo. As operações de saldo e recarga não estão disponíveis neste momento.",
      title: "Consumidor inativo",
    };
  }

  return null;
}

export default function HomeScreen() {
  const router = useRouter();
  const accountQuery = useCreditAccountQuery();
  const sessionUser = useSessionStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accountError = accountQuery.isError
    ? getApiErrorMessage(accountQuery.error)
    : undefined;
  const accountNotice = getAccountNotice(
    accountQuery.data?.consumer.situation,
    accountError,
  );
  const canOpenRecharge = accountQuery.data?.permissions.canRecharge === true;

  return (
    <>
      <Container
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            onRefresh={() => void accountQuery.refetch()}
            refreshing={accountQuery.isRefetching}
          />
        }
      >
        <HomeHeader
          balance={
            accountQuery.data
              ? formatCurrency(accountQuery.data.balance.current)
              : accountQuery.isLoading
                ? "Carregando..."
                : "R$ --"
          }
          name={accountQuery.data?.consumer.name ?? sessionUser?.name ?? "usuário"}
          status={mapHeaderStatus(accountQuery.data?.consumer.situation)}
          onMenuPress={() => setIsMenuOpen(true)}
          onNotificationsPress={() => router.dismissTo(SETTINGS_ROUTE)}
          onHelpPress={() => router.dismissTo("/about")}
        />
        <Content>
          {accountNotice ? (
            <AccountNotice>
              <AccountNoticeTitle>{accountNotice.title}</AccountNoticeTitle>
              <AccountNoticeText>{accountNotice.description}</AccountNoticeText>
              {accountNotice.retry ? (
                <AppButton
                  label="Tentar novamente"
                  onPress={() => void accountQuery.refetch()}
                  variant="outlined"
                />
              ) : null}
            </AccountNotice>
          ) : null}

          <PrimaryAction
            activeOpacity={0.8}
            disabled={!canOpenRecharge}
            onPress={() => {
              if (!canOpenRecharge) {
                return;
              }
              router.dismissTo(RECHARGE_ROUTE);
            }}
            style={!canOpenRecharge ? { opacity: 0.55 } : undefined}
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
            <HistoryAction
              activeOpacity={0.8}
              onPress={() => router.dismissTo(RECHARGE_HISTORY_ROUTE)}
            >
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

            <HistoryAction
              activeOpacity={0.8}
              onPress={() => router.dismissTo(MEAL_HISTORY_ROUTE)}
            >
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
