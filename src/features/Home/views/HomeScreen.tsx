import { BoxContent, ThemedText } from "@shared/components";
import { HighlightedProducts } from "../../Products";
import { HomeHeader } from "../HomeHeader";
import {
  Container,
  Content,
  HorizontalScrollSection,
  Section,
} from "./styles/HomeScreen.styled";

export default function HomeScreen() {
  return (
    <>
      <Container contentContainerStyle={{ paddingBottom: 32 }}>
        <HomeHeader balance="R$ 45,50" name="Usuário" status="Ativo" />
        <Content>
          <HorizontalScrollSection>
            <HighlightedProducts />
          </HorizontalScrollSection>
          <BoxContent gap={16}>
            <Section>
              <ThemedText type="subtitle">Banners</ThemedText>
            </Section>
            <Section>
              <ThemedText type="subtitle">Offers</ThemedText>
            </Section>
            <Section>
              <ThemedText type="subtitle">Brands</ThemedText>
            </Section>
          </BoxContent>
        </Content>
      </Container>
    </>
  );
}
