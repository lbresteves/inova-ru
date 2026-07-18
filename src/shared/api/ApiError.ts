export type ApiErrorKind =
  | "http"
  | "network"
  | "timeout"
  | "cancelled"
  | "contract"
  | "unexpected";

export type ApiResponseHeaders = Record<string, string>;

function parseRetryAfter(headers?: ApiResponseHeaders): number | undefined {
  const raw = headers?.["retry-after"] ?? headers?.["Retry-After"];
  if (!raw) {
    return undefined;
  }

  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.ceil(seconds);
  }

  const date = new Date(raw);
  const delayMs = date.getTime() - Date.now();
  return Number.isFinite(delayMs) && delayMs > 0
    ? Math.ceil(delayMs / 1000)
    : undefined;
}

export class ApiError extends Error {
  readonly cause?: unknown;
  readonly retryAfterSeconds?: number;

  constructor(
    message: string,
    readonly kind: ApiErrorKind,
    readonly status?: number,
    readonly data?: unknown,
    readonly headers?: ApiResponseHeaders,
    cause?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.cause = cause;
    this.retryAfterSeconds = parseRetryAfter(headers);
  }
}

export function createContractError(message: string, data?: unknown): ApiError {
  return new ApiError(message, "contract", undefined, data);
}
