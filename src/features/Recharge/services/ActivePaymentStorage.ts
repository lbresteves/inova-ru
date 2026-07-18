import { cacheStorage } from "@shared/storage";
import type { IStorage } from "@shared/types/IStorage";
import type { ActivePayment, CreatedPayment } from "../types/Recharge";

const ACTIVE_PAYMENT_KEY = "recharge.active-payment";

function isActivePayment(value: unknown): value is ActivePayment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return [
    "amount",
    "copyPasteCode",
    "expiresAt",
    "id",
    "ownerCpf",
    "pollingStartedAt",
    "qrCodeUri",
    "status",
    "ticketUrl",
  ].every((key) => record[key] !== undefined);
}

export class ActivePaymentStorage {
  constructor(private readonly storage: IStorage) {}

  async get(ownerCpf: string): Promise<ActivePayment | null> {
    const value = await this.storage.get<ActivePayment>(ACTIVE_PAYMENT_KEY);
    if (!isActivePayment(value) || value.ownerCpf !== ownerCpf) {
      if (value !== null) {
        await this.remove();
      }
      return null;
    }

    if (new Date(value.expiresAt).getTime() <= Date.now()) {
      await this.remove();
      return null;
    }

    return value;
  }

  set(payment: CreatedPayment, ownerCpf: string): Promise<void> {
    const activePayment: ActivePayment = {
      ...payment,
      ownerCpf,
      pollingStartedAt: new Date().toISOString(),
    };

    return this.storage.set(ACTIVE_PAYMENT_KEY, activePayment);
  }

  remove(): Promise<void> {
    return this.storage.remove(ACTIVE_PAYMENT_KEY);
  }
}

export const activePaymentStorage = new ActivePaymentStorage(cacheStorage);
