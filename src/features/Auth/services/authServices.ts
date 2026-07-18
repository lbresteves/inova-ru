import { clearAuthenticatedQueryData } from "@/src/_app/query";
import { activePaymentStorage } from "@features/Recharge/services/ActivePaymentStorage";
import { ruApi } from "@shared/api";
import { secureStorage } from "@shared/storage";
import type { IHttpClient } from "@shared/types/IHttpClient";
import { AuthenticatedHttpClient } from "../http/AuthenticatedHttpClient";
import { UnauthorizedHttpClient } from "../http/UnauthorizedHttpClient";
import { useSessionStore } from "../store/sessionStore";
import type { AnonymousReason } from "../types/AuthSession";
import { AuthRepository } from "./AuthRepository";
import { AuthSessionStorage } from "./AuthSessionStorage";

export const authSessionStorage = new AuthSessionStorage(secureStorage);
export const authRepository = new AuthRepository(ruApi);

let clearSessionPromise: Promise<void> | null = null;

export async function clearSession(reason: AnonymousReason = "explicit"): Promise<void> {
  if (clearSessionPromise) {
    return clearSessionPromise;
  }

  clearSessionPromise = (async () => {
    try {
      await authSessionStorage.removeSession();
      await activePaymentStorage.remove();
      await clearAuthenticatedQueryData();
    } finally {
      useSessionStore.getState().setAnonymous(reason);
      clearSessionPromise = null;
    }
  })();

  return clearSessionPromise;
}

export const authenticatedRuApi: IHttpClient = new UnauthorizedHttpClient(
  new AuthenticatedHttpClient(ruApi, authSessionStorage),
  () => clearSession("expired"),
);

export const logout = () => clearSession("explicit");
