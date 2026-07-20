import type { IStorage } from "@shared/types/IStorage";
import type { AuthSession } from "../types/AuthSession";
import { isAuthSession } from "../utils/authSessionValidation";

const SESSION_KEY = "auth.session";

export class AuthSessionStorage {
  constructor(private readonly storage: IStorage) {}

  async getAccessToken(): Promise<string | null> {
    return (await this.getSession())?.token ?? null;
  }

  async getSession(): Promise<AuthSession | null> {
    const stored = await this.storage.get<unknown>(SESSION_KEY);
    if (stored === null) {
      return null;
    }

    if (!isAuthSession(stored)) {
      await this.storage.remove(SESSION_KEY);
      return null;
    }

    return stored;
  }

  setSession(session: AuthSession): Promise<void> {
    if (!isAuthSession(session)) {
      throw new TypeError("Invalid authentication session.");
    }

    return this.storage.set(SESSION_KEY, session);
  }

  removeSession(): Promise<void> {
    return this.storage.remove(SESSION_KEY);
  }
}
