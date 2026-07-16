import * as SecureStore from "expo-secure-store";
import type { IStorage } from "../types/IStorage";
import { StorageError, type StorageOperation } from "./StorageError";
import { buildStorageKey } from "./storageKey";
import {
  deserializeStorageValue,
  serializeStorageValue,
} from "./storageSerializer";

export class SecureStorage implements IStorage {
  constructor(private readonly namespace: string) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const storageKey = buildStorageKey(this.namespace, key);
      const serialized = await SecureStore.getItemAsync(storageKey);
      if (serialized === null) {
        return null;
      }

      const result = deserializeStorageValue<T>(serialized);
      if (result.success) {
        return result.value;
      }

      await SecureStore.deleteItemAsync(storageKey);
      return null;
    } catch (error) {
      throw this.toStorageError("get", key, error);
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const storageKey = buildStorageKey(this.namespace, key);
      const serialized = serializeStorageValue(value);
      await SecureStore.setItemAsync(storageKey, serialized, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      throw this.toStorageError("set", key, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const storageKey = buildStorageKey(this.namespace, key);
      await SecureStore.deleteItemAsync(storageKey);
    } catch (error) {
      throw this.toStorageError("remove", key, error);
    }
  }

  private toStorageError(
    operation: StorageOperation,
    key: string,
    error: unknown,
  ): StorageError {
    if (error instanceof StorageError) {
      return error;
    }

    return new StorageError(
      `Unable to ${operation} storage key "${key}".`,
      operation,
      key,
      error,
    );
  }
}
