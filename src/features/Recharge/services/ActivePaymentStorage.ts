import { cacheStorage } from "@shared/storage";
import type { IStorage } from "@shared/types/IStorage";
import type {
  ActivePayment,
  CreatedPayment,
  PaymentStatus,
} from "../types/Recharge";

const ACTIVE_PAYMENT_KEY = "recharge.active-payment";
const CPF_PATTERN = /^\d{11}$/;
const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "expired",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    Number.isFinite(new Date(value).getTime())
  );
}

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    typeof value === "string" &&
    PAYMENT_STATUSES.includes(value as PaymentStatus)
  );
}

function isActivePayment(value: unknown): value is ActivePayment {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    record.schemaVersion === 1 &&
    typeof record.amount === "number" &&
    Number.isFinite(record.amount) &&
    record.amount > 0 &&
    isNonEmptyString(record.copyPasteCode) &&
    isValidDate(record.expiresAt) &&
    isNonEmptyString(record.id) &&
    typeof record.ownerCpf === "string" &&
    CPF_PATTERN.test(record.ownerCpf) &&
    isValidDate(record.pollingStartedAt) &&
    isNonEmptyString(record.qrCodeUri) &&
    isPaymentStatus(record.status) &&
    isNonEmptyString(record.ticketUrl)
  );
}

export class ActivePaymentStorage {
  constructor(private readonly storage: IStorage) {}

  async get(ownerCpf: string): Promise<ActivePayment | null> {
    const value = await this.storage.get<unknown>(ACTIVE_PAYMENT_KEY);
    if (!isActivePayment(value) || value.ownerCpf !== ownerCpf) {
      if (value !== null) {
        await this.remove();
      }
      return null;
    }

    return value;
  }

  set(payment: CreatedPayment, ownerCpf: string): Promise<void> {
    const activePayment: ActivePayment = {
      ...payment,
      schemaVersion: 1,
      ownerCpf,
      pollingStartedAt: new Date().toISOString(),
    };

    return this.storage.set(ACTIVE_PAYMENT_KEY, activePayment);
  }

  async updateStatus(
    ownerCpf: string,
    paymentId: string,
    status: PaymentStatus,
  ): Promise<void> {
    const payment = await this.get(ownerCpf);
    if (!payment || payment.id !== paymentId || payment.status === status) {
      return;
    }

    await this.storage.set(ACTIVE_PAYMENT_KEY, { ...payment, status });
  }

  remove(): Promise<void> {
    return this.storage.remove(ACTIVE_PAYMENT_KEY);
  }
}

export const activePaymentStorage = new ActivePaymentStorage(cacheStorage);
