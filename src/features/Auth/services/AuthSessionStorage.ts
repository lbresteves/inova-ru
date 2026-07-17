import type { IStorage } from "@shared/types/IStorage";

const AUTH_STORAGE_KEYS = {
  accessToken: "auth.access-token",
} as const;

export class AuthSessionStorage {
  constructor(private readonly storage: IStorage) {}

  getAccessToken(): Promise<string | null> {
    return this.storage.get<string>(AUTH_STORAGE_KEYS.accessToken);
  }

  setAccessToken(token: string): Promise<void> {
    return this.storage.set(AUTH_STORAGE_KEYS.accessToken, token);
  }

  removeAccessToken(): Promise<void> {
    return this.storage.remove(AUTH_STORAGE_KEYS.accessToken);
  }
}
