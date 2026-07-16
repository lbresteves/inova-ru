export type ApiErrorKind =
  | "http"
  | "network"
  | "timeout"
  | "cancelled"
  | "unexpected";

export class ApiError extends Error {
  readonly cause?: unknown;

  constructor(
    message: string,
    readonly kind: ApiErrorKind,
    readonly status?: number,
    readonly data?: unknown,
    cause?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.cause = cause;
  }
}
