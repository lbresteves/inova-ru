import { IconSymbol } from "@shared/components";
import { useState } from "react";
import {
  AnswerContainer,
  AnswerText,
  ItemContainer,
  QuestionButton,
  QuestionText,
} from "./styles/FaqItem.styled";

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ItemContainer>
      <QuestionButton
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Expandir resposta para: ${question}`}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <QuestionText>{question}</QuestionText>
        <IconSymbol
          color="onPrimary"
          name="chevron.right"
          size={20}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />
      </QuestionButton>

      {isOpen && (
        <AnswerContainer>
          <AnswerText>{answer}</AnswerText>
        </AnswerContainer>
      )}
    </ItemContainer>
  );
}
