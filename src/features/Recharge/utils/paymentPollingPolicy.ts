import { ApiError } from "@shared/api";
import type { PaymentStatusResult } from "../types/Recharge";

const MAX_POLLING_MS = 2 * 60 * 1_000;
const BASE_DELAYS_MS = [3_000, 5_000, 8_000, 13_000, 21_000, 34_000];
const JITTER_MS = 1_000;

export function isTerminalPaymentResult(result: PaymentStatusResult): boolean {
  return (
    result.status === "rejected" ||
    result.status === "cancelled" ||
    result.status === "expired" ||
    (result.status === "approved" && result.credited)
  );
}

export function isRetryablePollingError(error: unknown): boolean {
  if (!(error instanceof ApiError)) {
    return false;
  }

  if (error.kind === "network" || error.kind === "timeout") {
    return true;
  }

  return (
    error.kind === "http" &&
    (error.status === 429 || (error.status !== undefined && error.status >= 500))
  );
}

export function hasPollingTimedOut(startedAt: string, now = Date.now()): boolean {
  const startedAtMs = new Date(startedAt).getTime();
  return Number.isFinite(startedAtMs) && now - startedAtMs >= MAX_POLLING_MS;
}

export function getNextPollingDelayMs(
  attempt: number,
  retryAfterSeconds?: number,
): number {
  if (retryAfterSeconds && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1_000;
  }

  const baseDelay = BASE_DELAYS_MS[Math.min(attempt, BASE_DELAYS_MS.length - 1)];
  const jitter = Math.round((Math.random() * 2 - 1) * JITTER_MS);
  return Math.max(1_000, baseDelay + jitter);
}
