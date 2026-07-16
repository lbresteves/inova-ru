const VALID_STORAGE_KEY = /^[A-Za-z0-9._-]+$/;

export function buildStorageKey(namespace: string, key: string): string {
  if (!VALID_STORAGE_KEY.test(namespace)) {
    throw new TypeError(`Invalid storage namespace: "${namespace}".`);
  }

  if (!VALID_STORAGE_KEY.test(key)) {
    throw new TypeError(`Invalid storage key: "${key}".`);
  }

  return `${namespace}.${key}`;
}
