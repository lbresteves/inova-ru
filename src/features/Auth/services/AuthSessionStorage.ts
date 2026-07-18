import type { IStorage } from "@shared/types/IStorage";
import type { AuthSession } from "../types/AuthSession";

const ACCESS_TOKEN_KEY = "auth.access-token";
const SESSION_KEY = "auth.session";

export class AuthSessionStorage {
  constructor(private readonly storage: IStorage) {}

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    if (session?.token) {
      return session.token;
    }

    return this.storage.get<string>(ACCESS_TOKEN_KEY);
  }

  getSession(): Promise<AuthSession | null> {
    return this.storage.get<AuthSession>(SESSION_KEY);
  }

  async setSession(session: AuthSession): Promise<void> {
    await this.storage.set(SESSION_KEY, session);
    await this.storage.set(ACCESS_TOKEN_KEY, session.token);
  }

  setAccessToken(token: string): Promise<void> {
    return this.storage.set(ACCESS_TOKEN_KEY, token);
  }

  async removeSession(): Promise<void> {
    await this.storage.remove(SESSION_KEY);
    await this.storage.remove(ACCESS_TOKEN_KEY);
  }

  removeAccessToken(): Promise<void> {
    return this.removeSession();
  }
}
