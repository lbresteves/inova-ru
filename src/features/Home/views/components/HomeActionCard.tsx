import { IconSymbol } from "@shared/components";
import type { IconSymbolName } from "@shared/components/IconSymbol/IconSymbol";
import {
  ActionCard,
  ActionDescription,
  ActionIcon,
  ActionTextBlock,
  ActionTitle,
} from "../styles/HomeActionCard.styled";

export function HomeActionCard({
  title,
  description,
  icon,
  onPress,
}: {
  title: string;
  description: string;
  icon: IconSymbolName;
  onPress: () => void;
}) {
  return (
    <ActionCard accessibilityRole="button" onPress={onPress}>
      <ActionIcon>
        <IconSymbol color="primary" name={icon} size={24} />
      </ActionIcon>
      <ActionTextBlock>
        <ActionTitle>{title}</ActionTitle>
        <ActionDescription>{description}</ActionDescription>
      </ActionTextBlock>
      <IconSymbol color="textMuted" name="chevron.right" size={18} />
    </ActionCard>
  );
}
