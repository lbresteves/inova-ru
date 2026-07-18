export type RechargePreset = 10 | 20 | 50 | 100;

export type RechargeBalance = {
  current: number;
  maxRechargeAmount: number;
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
  qrCodeUri: string;
  ticketUrl: string;
  expiresAt: string;
};

export type ActivePayment = CreatedPayment & {
  schemaVersion: 1;
  ownerCpf: string;
  pollingStartedAt: string;
};

export type PaymentStatusResult = {
  id: string;
  status: PaymentStatus;
  statusDetail: string | null;
  credited: boolean;
};

export type PaymentFlowStatus =
  | "pending"
  | "approvedAwaitingCredit"
  | "credited"
  | "rejected"
  | "cancelled"
  | "expired"
  | "pollTimedOut"
  | "networkError"
  | "contractError";
