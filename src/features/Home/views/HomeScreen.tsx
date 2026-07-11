import { useTheme } from "@emotion/react";
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

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <>
      <Container contentContainerStyle={{ paddingBottom: 32 }}>
        <HomeHeader balance="R$ 45,50" name="João" status="Ativo" />
        <Content>
          <PrimaryAction activeOpacity={0.8}>
            <PrimaryActionContent>
              <IconSymbol
                color={theme.colors.onPrimary}
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
                  color={theme.colors.primary}
                  name="clock.arrow.circlepath"
                  size={22}
                />
              </ActionIconBox>
              <ActionTexts>
                <HistoryTitle>Histórico de recargas</HistoryTitle>
                <HistoryDescription>Ver recargas via PIX</HistoryDescription>
              </ActionTexts>
              <IconSymbol
                color={theme.colors.mutedText}
                name="chevron.right"
                size={18}
              />
            </HistoryAction>

            <HistoryAction activeOpacity={0.8}>
              <ActionIconBox>
                <IconSymbol
                  color={theme.colors.primary}
                  name="fork.knife"
                  size={22}
                />
              </ActionIconBox>
              <ActionTexts>
                <HistoryTitle>Histórico de refeições</HistoryTitle>
                <HistoryDescription>Consumos nos RUs</HistoryDescription>
              </ActionTexts>
              <IconSymbol
                color={theme.colors.mutedText}
                name="chevron.right"
                size={18}
              />
            </HistoryAction>
          </HistoryActions>
        </Content>
      </Container>
    </>
  );
}
