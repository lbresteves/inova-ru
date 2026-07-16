import { SecureStorage } from "../base/SecureStorage";
import type { IStorage } from "../types/IStorage";

export const secureStorage: IStorage = new SecureStorage(
  "inova-ru.secure.v1",
);
