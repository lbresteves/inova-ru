import { HeaderBack, IconSymbol } from "@shared/components";
import { Stack, useRouter } from "expo-router";
import { faqData } from "../utils/faq-data";
import { FaqItem } from "./FaqItem";
import {
  BackButtonBox,
  Container,
  ContentScroll,
  CustomHeaderRow,
  FaqSectionTitle,
  HeaderTitle,
  HeroDescription,
  HeroSection,
  HeroTitle,
  HeroTitleRow,
} from "./styles/AboutScreen.styled";

export function AboutScreen() {
  const router = useRouter();

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <HeaderBack title="About" onReturnPress={() => router.dismissTo("/main/home")} />

      <ContentScroll contentContainerStyle={{ paddingBottom: 40 }}>
        <HeroSection>
          <HeroTitleRow>
            <IconSymbol color="text" name="info.circle" size={32} />
            <HeroTitle>Sobre o App</HeroTitle>
          </HeroTitleRow>
          <HeroDescription>
            Este aplicativo foi desenvolvido para estudantes e servidores da UFMG
            recarregarem créditos e consultarem informações dos RUs.
          </HeroDescription>
        </HeroSection>

        <FaqSectionTitle>Perguntas Frequentes</FaqSectionTitle>

        {faqData.map((item) => (
          <FaqItem
            key={item.id}
            answer={item.answer}
            question={item.question}
          />
        ))}
      </ContentScroll>
    </Container>
  );
}
