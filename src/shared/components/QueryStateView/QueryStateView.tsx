import { AppButton } from "../AppButton/AppButton";
import { Screen } from "../Screen/Screen";
import { Message, Root, Title } from "./QueryStateView.styled";

export function QueryStateView({
  actionLabel = "Tentar novamente",
  message,
  onAction,
  title,
}: {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <Screen>
      <Root>
        <Title>{title}</Title>
        <Message>{message}</Message>
        {onAction ? <AppButton label={actionLabel} onPress={onAction} /> : null}
      </Root>
    </Screen>
  );
}
