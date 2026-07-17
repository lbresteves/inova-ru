import { AppButton, IconSymbol } from "@shared/components";
import {
  ResultActions,
  ResultContent,
  ResultDescription,
  ResultIcon,
  ResultTitle,
} from "../styles/PaymentScreen.styled";

export type PaymentResultProps = {
  type: "success" | "failure";
  title: string;
  description: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  children?: React.ReactNode;
};

export function PaymentResult({
  type,
  title,
  description,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  children,
}: PaymentResultProps) {
  return (
    <ResultContent>
      <ResultIcon>
        <IconSymbol
          color={type === "success" ? "primary" : "danger"}
          name={
            type === "success"
              ? "checkmark.circle.fill"
              : "exclamationmark.triangle.fill"
          }
          size={126}
        />
      </ResultIcon>
      <ResultTitle>{title}</ResultTitle>
      <ResultDescription>{description}</ResultDescription>
      {children}
      <ResultActions>
        <AppButton label={primaryLabel} onPress={onPrimaryPress} />
        {secondaryLabel && onSecondaryPress ? (
          <AppButton
            label={secondaryLabel}
            onPress={onSecondaryPress}
            variant="outlined"
          />
        ) : null}
      </ResultActions>
    </ResultContent>
  );
}
