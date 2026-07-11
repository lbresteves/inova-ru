import {
  StatusBadgeContainer,
  StatusBadgeText,
} from "./StatusBadge.styled";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <StatusBadgeContainer>
      <StatusBadgeText>{status}</StatusBadgeText>
    </StatusBadgeContainer>
  );
}
