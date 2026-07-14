export type RechargePreset = 10 | 20 | 50 | 100;

export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired";

export type CreatedPayment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  copyPasteCode: string;
  qrCodeUri: string | null;
  createdAt: string;
  expiresAt: string;
};

export type PaymentStatusResult = {
  id: string;
  status: PaymentStatus;
  credited: boolean;
};

export type RechargeHistoryItem = {
  id: string;
  amount: string;
  date: string;
  status: "Aprovado" | "Expirado";
  timestamp?: string;
};
