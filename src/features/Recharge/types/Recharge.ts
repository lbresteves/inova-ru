export type RechargePreset = 10 | 20 | 50 | 100;

export type RechargeBalance = {
  current: number;
  limit: number;
};

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
  ticketUrl: string | null;
  expiresAt: string;
  balanceCredited: boolean;
};

export type PaymentStatusResult = {
  id: string;
  status: PaymentStatus;
  statusDetail: string | null;
  credited: boolean;
};
