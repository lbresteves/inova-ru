import { ApiError } from "@shared/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { rechargeRepository } from "../services/rechargeServices";
import type { PaymentStatusResult } from "../types/Recharge";
import {
  getNextPollingDelayMs,
  hasPollingTimedOut,
  isRetryablePollingError,
  isTerminalPaymentResult,
} from "../utils/paymentPollingPolicy";

type PollingState = {
  data?: PaymentStatusResult;
  error?: unknown;
  isFetching: boolean;
  isTimedOut: boolean;
};

export function usePaymentStatusPolling(
  paymentId: string,
  enabled: boolean,
  pollingStartedAt?: string,
) {
  const [state, setState] = useState<PollingState>({
    isFetching: false,
    isTimedOut: false,
  });
  const attemptRef = useRef(0);
  const hasRequestedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activeRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    abortRef.current?.abort();
    abortRef.current = null;
  }, [clearTimer]);

  const poll = useCallback(async () => {
    if (!paymentId || !enabled || !pollingStartedAt || !activeRef.current) {
      return;
    }

    const timedOutBeforeRequest = hasPollingTimedOut(pollingStartedAt);
    if (timedOutBeforeRequest && hasRequestedRef.current) {
      setState((current) => ({
        ...current,
        isFetching: false,
        isTimedOut: true,
      }));
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    hasRequestedRef.current = true;
    setState((current) => ({
      ...current,
      isFetching: true,
      isTimedOut: false,
      error: undefined,
    }));

    try {
      const result = await rechargeRepository.getPaymentStatus(
        paymentId,
        controller.signal,
      );
      if (!activeRef.current) {
        return;
      }

      if (isTerminalPaymentResult(result)) {
        setState({ data: result, isFetching: false, isTimedOut: false });
        return;
      }

      if (hasPollingTimedOut(pollingStartedAt)) {
        setState({ data: result, isFetching: false, isTimedOut: true });
        return;
      }

      setState({ data: result, isFetching: false, isTimedOut: false });
      const delay = getNextPollingDelayMs(attemptRef.current++);
      timeoutRef.current = setTimeout(() => void poll(), delay);
    } catch (error) {
      if (!activeRef.current) {
        return;
      }

      if (error instanceof ApiError && error.kind === "cancelled") {
        return;
      }

      const timedOut = hasPollingTimedOut(pollingStartedAt);
      setState((current) => ({
        ...current,
        error,
        isFetching: false,
        isTimedOut: timedOut,
      }));

      if (!isRetryablePollingError(error) || timedOut) {
        return;
      }

      const retryAfter =
        error instanceof ApiError ? error.retryAfterSeconds : undefined;
      const delay = getNextPollingDelayMs(attemptRef.current++, retryAfter);
      timeoutRef.current = setTimeout(() => void poll(), delay);
    }
  }, [enabled, paymentId, pollingStartedAt]);

  useEffect(() => {
    activeRef.current = enabled;
    attemptRef.current = 0;
    hasRequestedRef.current = false;
    setState({ isFetching: false, isTimedOut: false });

    if (enabled) {
      void poll();
    }

    return () => {
      activeRef.current = false;
      stop();
    };
  }, [enabled, paymentId, pollingStartedAt, poll, stop]);

  const refetch = useCallback(async () => {
    attemptRef.current = 0;
    hasRequestedRef.current = false;
    await poll();
  }, [poll]);

  return {
    ...state,
    isError: Boolean(state.error),
    refetch,
  };
}
