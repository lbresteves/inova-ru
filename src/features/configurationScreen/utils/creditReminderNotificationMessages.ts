export interface CreditReminderNotificationMessage {
  body: string;
  title: string;
}

export const CREDIT_REMINDER_NOTIFICATION_MESSAGES: readonly CreditReminderNotificationMessage[] =
  [
    {
      title: "Lembrete de recarga",
      body: "Hora de recarregar seus créditos! 💳",
    },
    {
      title: "Créditos Inova RU",
      body: "Não esqueça de recarregar seus créditos para usar no RU.",
    },
    {
      title: "Recarga programada",
      body: "Passe no app e confira seus créditos antes da próxima refeição.",
    },
  ];

export function getCreditReminderNotificationMessage(): CreditReminderNotificationMessage {
  return CREDIT_REMINDER_NOTIFICATION_MESSAGES[0];
}
