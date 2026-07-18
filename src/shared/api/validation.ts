import { createContractError } from "./ApiError";

export function assertRecord(
  value: unknown,
  path: string,
): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  throw createContractError(`Campo ${path} inválido.`, value);
}

export function readString(
  record: Record<string, unknown>,
  key: string,
  path = key,
): string {
  const value = record[key];
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  throw createContractError(`Campo ${path} inválido.`, record);
}

export function readOptionalString(
  record: Record<string, unknown>,
  key: string,
): string | null {
  const value = record[key];
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  throw createContractError(`Campo ${key} inválido.`, record);
}

export function readNumber(
  record: Record<string, unknown>,
  key: string,
  path = key,
): number {
  const value = record[key];
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim().length > 0
        ? Number(value)
        : Number.NaN;
  if (Number.isFinite(parsed)) {
    return parsed;
  }

  throw createContractError(`Campo ${path} inválido.`, record);
}

export function readInteger(
  record: Record<string, unknown>,
  key: string,
  path = key,
): number {
  const value = readNumber(record, key, path);
  if (Number.isInteger(value)) {
    return value;
  }

  throw createContractError(`Campo ${path} deve ser inteiro.`, record);
}

export function readBoolean(
  record: Record<string, unknown>,
  key: string,
  defaultValue?: boolean,
): boolean {
  const value = record[key];
  if (typeof value === "boolean") {
    return value;
  }

  if (value === undefined && defaultValue !== undefined) {
    return defaultValue;
  }

  throw createContractError(`Campo ${key} inválido.`, record);
}

export function readDateString(
  record: Record<string, unknown>,
  key: string,
): string {
  const value = readString(record, key);
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString();
  }

  throw createContractError(`Campo ${key} não contém uma data válida.`, record);
}
