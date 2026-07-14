import { IconButton } from "../IconButton/IconButton";
import { HeaderContainer, HeaderTitle } from "./PageHeader.styled";

export function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <HeaderContainer>
      <IconButton
        accessibilityLabel="Voltar"
        iconColor="primary"
        name="arrow.left"
        onPress={onBack}
        size={44}
        variant="soft"
      />
      <HeaderTitle numberOfLines={1}>{title}</HeaderTitle>
    </HeaderContainer>
  );
}
