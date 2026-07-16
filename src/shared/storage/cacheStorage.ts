import { AsyncStorageAdapter } from "../base/AsyncStorageAdapter";
import type { IStorage } from "../types/IStorage";

export const cacheStorage: IStorage = new AsyncStorageAdapter(
  "inova-ru.cache.v1",
);
