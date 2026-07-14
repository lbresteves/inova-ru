export type Weekday = "D" | "S1" | "T" | "Q1" | "Q2" | "S2" | "S3";

export type NotificationSettings = {
  notificationsEnabled: boolean;
  lowBalanceEnabled: boolean;
  lowBalanceThreshold: number;
  weeklyReminderEnabled: boolean;
  reminderDays: Weekday[];
  reminderTime: string;
};
