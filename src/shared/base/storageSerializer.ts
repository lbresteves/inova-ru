const STORAGE_FORMAT_VERSION = 1;

type StoredEnvelope<T> = {
  version: typeof STORAGE_FORMAT_VERSION;
  value: T;
};

export type StorageDeserializationResult<T> =
  | { success: true; value: T }
  | { success: false };

function assertSerializable(_key: string, value: unknown): unknown {
  if (
    typeof value === "undefined" ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    throw new TypeError("Storage values must be JSON serializable.");
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new TypeError("Storage values must contain finite numbers.");
  }

  return value;
}

export function serializeStorageValue<T>(value: T): string {
  const envelope: StoredEnvelope<T> = {
    version: STORAGE_FORMAT_VERSION,
    value,
  };

  const serialized = JSON.stringify(envelope, assertSerializable);
  if (serialized === undefined) {
    throw new TypeError("Storage values must be JSON serializable.");
  }

  return serialized;
}

export function deserializeStorageValue<T>(
  serialized: string,
): StorageDeserializationResult<T> {
  try {
    const parsed: unknown = JSON.parse(serialized);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== STORAGE_FORMAT_VERSION ||
      !("value" in parsed)
    ) {
      return { success: false };
    }

    return {
      success: true,
      value: parsed.value as T,
    };
  } catch {
    return { success: false };
  }
}
