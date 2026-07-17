import type { IStorage } from "@shared/types/IStorage";

const ACCESS_TOKEN_KEY = "auth.access-token";

export class AuthSessionStorage {
  constructor(private readonly storage: IStorage) {}

  getAccessToken(): Promise<string | null> {
    return this.storage.get<string>(ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): Promise<void> {
    return this.storage.set(ACCESS_TOKEN_KEY, token);
  }

  removeAccessToken(): Promise<void> {
    return this.storage.remove(ACCESS_TOKEN_KEY);
  }
}
