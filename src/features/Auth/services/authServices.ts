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

const authenticatedClient = new AuthenticatedHttpClient(
  ruApi,
  authSessionStorage,
);

export const authenticatedRuApi: IHttpClient = new UnauthorizedHttpClient(
  authenticatedClient,
  async () => {
    useSessionStore.getState().setAnonymous();
    await authSessionStorage.removeAccessToken();
  },
);

export async function logout(): Promise<void> {
  await authSessionStorage.removeAccessToken();
  useSessionStore.getState().setAnonymous();
}
