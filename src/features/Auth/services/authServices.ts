import { ruApi } from "@shared/api";
import { secureStorage } from "@shared/storage";
import type { IHttpClient } from "@shared/types/IHttpClient";
import { AuthenticatedHttpClient } from "../http/AuthenticatedHttpClient";
import { UnauthorizedHttpClient } from "../http/UnauthorizedHttpClient";
import { useSessionStore } from "../store/sessionStore";
import { AuthRepository } from "./AuthRepository";
import { AuthSessionStorage } from "./AuthSessionStorage";

export const authSessionStorage = new AuthSessionStorage(secureStorage);
export const authRepository = new AuthRepository(ruApi);

async function clearSession(): Promise<void> {
  try {
    await authSessionStorage.removeAccessToken();
  } finally {
    useSessionStore.getState().setAnonymous();
  }
}

export const authenticatedRuApi: IHttpClient = new UnauthorizedHttpClient(
  new AuthenticatedHttpClient(ruApi, authSessionStorage),
  clearSession,
);

export const logout = clearSession;
