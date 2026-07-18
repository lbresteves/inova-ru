import { ApiError } from "@shared/api";
import { QueryClient } from "@tanstack/react-query";

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError) {
    if (error.kind === "cancelled" || error.kind === "contract") {
      return false;
    }

    if ([401, 403, 404, 422].includes(error.status ?? 0)) {
      return false;
    }
  }

  return failureCount < 2;
}

function retryDelay(attemptIndex: number, error: unknown): number {
  if (error instanceof ApiError && error.retryAfterSeconds) {
    return error.retryAfterSeconds * 1_000;
  }

  return Math.min(1_000 * 2 ** attemptIndex, 10_000);
}

export const appQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      gcTime: 10 * 60 * 1_000,
      refetchOnReconnect: true,
      retry: shouldRetry,
      retryDelay,
      staleTime: 30 * 1_000,
    },
  },
});

export async function clearAuthenticatedQueryData(): Promise<void> {
  await appQueryClient.cancelQueries();
  appQueryClient.removeQueries();
}
