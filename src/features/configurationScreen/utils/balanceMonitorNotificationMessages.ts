export interface LowBalanceNotificationMessageParams {
  currentBalance: number;
  minimumBalance: number;
}

export interface LowBalanceNotificationMessage {
  body: string;
  title: string;
}

function formatCurrencyForNotification(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function getLowBalanceNotificationMessage({
  currentBalance,
  minimumBalance,
}: LowBalanceNotificationMessageParams): LowBalanceNotificationMessage {
  return {
    title: "Saldo baixo no RU",
    body: `Seu saldo atual é ${formatCurrencyForNotification(
      currentBalance
    )}, abaixo do mínimo de ${formatCurrencyForNotification(
      minimumBalance
    )}. Recarregue seus créditos para evitar imprevistos.`,
  };
}
