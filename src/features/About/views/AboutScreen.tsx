import {
  Collapsible,
  IconSymbol,
  PageHeader,
  ScreenContent,
  ScrollScreen,
} from "@shared/components";
import { useRouter } from "expo-router";
import { faqMock } from "../mocks/faqMock";
import {
  AboutContent,
  Answer,
  Description,
  FaqList,
  FaqTitle,
  MainTitle,
  TitleRow,
} from "./styles/AboutScreen.styled";

export default function AboutScreen() {
  const router = useRouter();
  return (
    <ScrollScreen>
      <PageHeader title="Sobre" onBack={() => router.back()} />
      <ScreenContent>
        <AboutContent>
          <TitleRow>
            <IconSymbol color="text" name="info.circle" size={44} />
            <MainTitle>Sobre o App</MainTitle>
          </TitleRow>
          <Description>
            Este aplicativo foi desenvolvido para estudantes e servidores da UFMG
            recarregarem créditos e consultarem informações dos RUs.
          </Description>
          <FaqTitle>Perguntas Frequentes</FaqTitle>
          <FaqList>
            {faqMock.map((item, index) => (
              <Collapsible defaultOpen={index === 1} key={item.id} title={item.question}>
                <Answer>{item.answer}</Answer>
              </Collapsible>
            ))}
          </FaqList>
        </AboutContent>
      </ScreenContent>
    </ScrollScreen>
  );
}
