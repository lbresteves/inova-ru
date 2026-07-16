export type StorageOperation = "get" | "set" | "remove";

export class StorageError extends Error {
  readonly cause?: unknown;

  constructor(
    message: string,
    readonly operation: StorageOperation,
    readonly key: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = "StorageError";
    this.cause = cause;
  }
}
